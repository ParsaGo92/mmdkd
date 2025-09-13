// Shared Spotify utilities for Vercel functions
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { storage } from "./storage.mjs";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  throw new Error('SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in environment variables');
}
const SPOTIFY_REDIRECT_URI = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/auth/spotify/callback`
  : "http://localhost:5000/api/auth/spotify/callback";

export function getSpotifyAuthURL() {
  const scopes = [
    'user-read-recently-played',
    'user-read-playback-state',
    'user-read-currently-playing'
  ];
  
  // Generate secure random state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', SPOTIFY_REDIRECT_URI);
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('state', state);
  
  return { authUrl: authUrl.toString(), state };
}

export async function exchangeCodeForToken(code) {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange code for token: ${response.statusText}`);
  }

  const tokenData = await response.json();
  
  const accessToken = {
    access_token: tokenData.access_token,
    token_type: tokenData.token_type,
    expires_in: tokenData.expires_in,
    refresh_token: tokenData.refresh_token,
  };

  // Store token in database
  const expiresAt = Date.now() + (tokenData.expires_in * 1000);
  await storage.saveSpotifyToken({
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt
  });
  
  return accessToken;
}

async function refreshSpotifyToken(spotifyToken) {
  try {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: spotifyToken.refreshToken,
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const tokenData = await response.json();
    
    // Update the stored token
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    const updatedToken = await storage.updateSpotifyToken(spotifyToken.id, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || spotifyToken.refreshToken,
      expiresAt
    });
    
    return updatedToken;
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    return null;
  }
}

async function getSpotifyClient() {
  const spotifyToken = await storage.getSpotifyToken();
  
  if (!spotifyToken) {
    return null; // User not authenticated
  }
  
  // Check if token is expired
  if (Date.now() > spotifyToken.expiresAt) {
    // Token is expired, try to refresh it
    const refreshedToken = await refreshSpotifyToken(spotifyToken);
    if (!refreshedToken) {
      return null;
    }
    
    const accessToken = {
      access_token: refreshedToken.accessToken,
      token_type: 'Bearer',
      expires_in: Math.floor((refreshedToken.expiresAt - Date.now()) / 1000),
      refresh_token: refreshedToken.refreshToken,
    };
    
    const spotify = SpotifyApi.withAccessToken(SPOTIFY_CLIENT_ID, accessToken);
    return spotify;
  }
  
  const accessToken = {
    access_token: spotifyToken.accessToken,
    token_type: 'Bearer',
    expires_in: Math.floor((spotifyToken.expiresAt - Date.now()) / 1000),
    refresh_token: spotifyToken.refreshToken,
  };
  
  const spotify = SpotifyApi.withAccessToken(SPOTIFY_CLIENT_ID, accessToken);
  return spotify;
}

export async function isUserAuthenticated() {
  const spotifyToken = await storage.getSpotifyToken();
  return spotifyToken !== undefined;
}

export async function getCurrentlyPlaying() {
  try {
    const spotify = await getSpotifyClient();
    
    if (!spotify) {
      throw new Error('User not authenticated with Spotify');
    }
    
    // Get currently playing track
    const currentlyPlaying = await spotify.player.getCurrentlyPlayingTrack();
    
    if (!currentlyPlaying || !currentlyPlaying.item || !currentlyPlaying.is_playing) {
      return null; // Nothing currently playing
    }

    const track = currentlyPlaying.item;
    
    return {
      id: 'current',
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      image: track.album.images[0]?.url || '',
      url: track.external_urls.spotify,
      artistUrl: track.artists[0].external_urls.spotify,
      playCount: 1,
      isCurrentlyPlaying: true,
      progress: currentlyPlaying.progress_ms,
      duration: track.duration_ms
    };
  } catch (error) {
    console.error('Error fetching currently playing track:', error);
    return null;
  }
}

export async function getRecentlyPlayedTracks() {
  try {
    const spotify = await getSpotifyClient();
    
    if (!spotify) {
      throw new Error('User not authenticated with Spotify');
    }
    
    // Get user's recently played tracks
    const recentlyPlayed = await spotify.player.getRecentlyPlayedTracks(20);
    
    // Map to our format
    const recentTracks = recentlyPlayed.items.map((item, index) => ({
      id: (index + 1).toString(),
      name: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      image: item.track.album.images[0]?.url || '',
      url: item.track.external_urls.spotify,
      artistUrl: item.track.artists[0].external_urls.spotify,
      playCount: 1,
      isCurrentlyPlaying: false
    }));

    return recentTracks;
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    // Return empty array when connection fails - no fake data
    return [];
  }
}