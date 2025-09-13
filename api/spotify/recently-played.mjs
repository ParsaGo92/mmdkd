import { isUserAuthenticated, getRecentlyPlayedTracks } from '../_lib/spotify.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authenticated = await isUserAuthenticated();
    if (!authenticated) {
      return res.status(401).json({ 
        error: "not_connected", 
        message: "Please connect your Spotify account first" 
      });
    }

    const tracks = await getRecentlyPlayedTracks();
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    if (error instanceof Error && error.message === "User not authenticated with Spotify") {
      return res.status(401).json({ 
        error: "not_connected", 
        message: "Please connect your Spotify account first" 
      });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}