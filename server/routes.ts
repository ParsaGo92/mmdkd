import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getRecentlyPlayedTracks, getCurrentlyPlaying, getSpotifyAuthURL, exchangeCodeForToken, isUserAuthenticated } from "./spotify";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Check if user is authenticated
  app.get("/api/auth/spotify/status", async (req, res) => {
    const authenticated = await isUserAuthenticated();
    res.json({ authenticated });
  });

  // Get Spotify auth URL
  app.get("/api/auth/spotify/login", (req, res) => {
    try {
      const authUrl = getSpotifyAuthURL();
      res.json({ authUrl });
    } catch (error) {
      console.error("Error generating auth URL:", error);
      res.status(500).json({ message: "Failed to generate auth URL" });
    }
  });

  // Handle Spotify callback
  app.get("/api/auth/spotify/callback", async (req, res) => {
    const { code, error } = req.query;

    if (error) {
      console.error("Spotify auth error:", error);
      res.redirect("/?error=auth_failed");
      return;
    }

    if (!code || typeof code !== 'string') {
      res.redirect("/?error=no_code");
      return;
    }

    try {
      await exchangeCodeForToken(code);
      res.redirect("/?success=connected");
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      res.redirect("/?error=token_exchange_failed");
    }
  });

  // Get currently playing track
  app.get("/api/spotify/currently-playing", async (req, res) => {
    try {
      const authenticated = await isUserAuthenticated();
      if (!authenticated) {
        res.status(401).json({ 
          error: "not_connected", 
          message: "Please connect your Spotify account first" 
        });
        return;
      }

      const currentTrack = await getCurrentlyPlaying();
      res.json(currentTrack);
    } catch (error) {
      console.error("Error fetching currently playing track:", error);
      if (error instanceof Error && error.message === "User not authenticated with Spotify") {
        res.status(401).json({ 
          error: "not_connected", 
          message: "Please connect your Spotify account first" 
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/spotify/recently-played", async (req, res) => {
    try {
      const authenticated = await isUserAuthenticated();
      if (!authenticated) {
        res.status(401).json({ 
          error: "not_connected", 
          message: "Please connect your Spotify account first" 
        });
        return;
      }

      const tracks = await getRecentlyPlayedTracks();
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching recently played tracks:", error);
      if (error instanceof Error && error.message === "User not authenticated with Spotify") {
        res.status(401).json({ 
          error: "not_connected", 
          message: "Please connect your Spotify account first" 
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
