import { exchangeCodeForToken } from '../../_lib/spotify.mjs';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error, state } = req.query;

  if (error) {
    console.error('Spotify auth error:', error);
    const redirectUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000';
    return res.redirect(`${redirectUrl}/?error=auth_failed`);
  }

  // Validate state parameter for CSRF protection
  const cookies = req.headers.cookie ? req.headers.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {}) : {};
  
  const storedState = cookies.spotify_oauth_state;
  if (!state || state !== storedState) {
    console.error('Invalid OAuth state parameter');
    const redirectUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000';
    return res.redirect(`${redirectUrl}/?error=invalid_state`);
  }

  // Clear the state cookie
  res.setHeader('Set-Cookie', 'spotify_oauth_state=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/');

  if (!code || typeof code !== 'string') {
    const redirectUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000';
    return res.redirect(`${redirectUrl}/?error=no_code`);
  }

  try {
    await exchangeCodeForToken(code);
    const redirectUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000';
    res.redirect(`${redirectUrl}/?success=connected`);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    const redirectUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000';
    res.redirect(`${redirectUrl}/?error=token_exchange_failed`);
  }
}