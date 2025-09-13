// Shared storage utilities for Vercel functions
import { sql } from '@vercel/postgres';

class DatabaseStorage {
  async getSpotifyToken() {
    try {
      const result = await sql`
        SELECT 
          id,
          access_token AS "accessToken", 
          refresh_token AS "refreshToken", 
          expires_at AS "expiresAt",
          created_at AS "createdAt"
        FROM spotify_tokens 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      return result.rows[0] || undefined;
    } catch (error) {
      console.error('Error getting Spotify token:', error);
      return undefined;
    }
  }

  async saveSpotifyToken(token) {
    try {
      const result = await sql`
        INSERT INTO spotify_tokens (access_token, refresh_token, expires_at)
        VALUES (${token.accessToken}, ${token.refreshToken}, ${token.expiresAt})
        RETURNING *
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error saving Spotify token:', error);
      throw error;
    }
  }

  async updateSpotifyToken(id, token) {
    try {
      const result = await sql`
        UPDATE spotify_tokens 
        SET access_token = ${token.accessToken}, 
            refresh_token = ${token.refreshToken}, 
            expires_at = ${token.expiresAt}
        WHERE id = ${id}
        RETURNING 
          id,
          access_token AS "accessToken", 
          refresh_token AS "refreshToken", 
          expires_at AS "expiresAt",
          created_at AS "createdAt"
      `;
      return result.rows[0] || undefined;
    } catch (error) {
      console.error('Error updating Spotify token:', error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();