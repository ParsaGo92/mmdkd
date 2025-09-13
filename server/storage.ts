import { type User, type InsertUser, type SpotifyToken, type InsertSpotifyToken } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Spotify token methods
  getSpotifyToken(): Promise<SpotifyToken | undefined>;
  saveSpotifyToken(token: InsertSpotifyToken): Promise<SpotifyToken>;
  updateSpotifyToken(id: string, token: Partial<InsertSpotifyToken>): Promise<SpotifyToken | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private spotifyTokens: Map<string, SpotifyToken>;

  constructor() {
    this.users = new Map();
    this.spotifyTokens = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Spotify token methods
  async getSpotifyToken(): Promise<SpotifyToken | undefined> {
    // Return the first (and only) spotify token - for single user setup
    return Array.from(this.spotifyTokens.values())[0];
  }

  async saveSpotifyToken(token: InsertSpotifyToken): Promise<SpotifyToken> {
    const id = randomUUID();
    const spotifyToken: SpotifyToken = { 
      ...token, 
      id,
      createdAt: new Date()
    };
    // Clear existing tokens and add new one (single user setup)
    this.spotifyTokens.clear();
    this.spotifyTokens.set(id, spotifyToken);
    return spotifyToken;
  }

  async updateSpotifyToken(id: string, token: Partial<InsertSpotifyToken>): Promise<SpotifyToken | undefined> {
    const existingToken = this.spotifyTokens.get(id);
    if (!existingToken) return undefined;
    
    const updatedToken: SpotifyToken = { ...existingToken, ...token };
    this.spotifyTokens.set(id, updatedToken);
    return updatedToken;
  }
}

export const storage = new MemStorage();
