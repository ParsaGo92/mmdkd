import { getSpotifyAuthURL } from '../../_lib/spotify.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { authUrl, state } = getSpotifyAuthURL();
    
    // Store state in secure httpOnly cookie for CSRF protection
    res.setHeader('Set-Cookie', `spotify_oauth_state=${state}; HttpOnly; Secure; SameSite=Strict; Max-Age=600; Path=/`);
    
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
}