import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  artistUrl: string;
  playCount?: number;
  isCurrentlyPlaying?: boolean;
}

interface AlbumImageProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  borderRadius?: string;
}

function AlbumImage({ src, alt, width = "100%", height = "100%", borderRadius = "8px" }: AlbumImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className="album-image-container" 
      style={{ width, height, borderRadius }}
      data-testid="album-image-container"
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`album-image ${isLoaded ? 'loaded' : ''}`}
        style={{ borderRadius }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        data-testid="album-image"
      />
      
      <div className={`image-fallback ${isLoaded ? '' : 'loading'} ${hasError ? 'no-image' : ''}`} style={{ borderRadius }}>
        <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20">
          <path d="M9 18V6l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
        {!isLoaded && !hasError && <div className="loading-spinner"></div>}
      </div>
    </div>
  );
}

export default function RecentTracks() {
  const emblaRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (emblaRef.current) {
      emblaRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (emblaRef.current) {
      emblaRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Check authentication status
  const { data: authStatus } = useQuery({
    queryKey: ['/api/auth/spotify/status'],
    queryFn: () => fetch('/api/auth/spotify/status').then(res => res.json()),
  });

  // Get currently playing track
  const { data: currentTrack } = useQuery({
    queryKey: ['/api/spotify/currently-playing'],
    queryFn: () => fetch('/api/spotify/currently-playing').then(res => {
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error('Failed to fetch current track');
      }
      return res.json();
    }),
    enabled: Boolean(authStatus?.authenticated),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: spotifyTracks, isLoading, error } = useQuery({
    queryKey: ['/api/spotify/recently-played'],
    queryFn: () => fetch('/api/spotify/recently-played').then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch tracks');
      }
      return res.json();
    }),
    enabled: Boolean(authStatus?.authenticated), // Only fetch if authenticated
  });

  // Combine current track with recent tracks
  let allTracks = spotifyTracks || [];
  
  // Add currently playing track at the beginning if it exists
  if (currentTrack) {
    // Remove the current track from recent tracks if it exists to avoid duplicates
    allTracks = allTracks.filter((track: Track) => track.id !== currentTrack.id);
    allTracks = [currentTrack, ...allTracks];
  }
  
  const tracks = allTracks;
  const isAuthenticated = authStatus?.authenticated;

  // Handle Spotify login
  const handleSpotifyLogin = async () => {
    try {
      const response = await fetch('/api/auth/spotify/login');
      const data = await response.json();
      
      if (data.authUrl) {
        // Redirect to Spotify authorization page
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error starting Spotify login:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="carousel-container" data-testid="music-carousel">
        <div className="carousel-header">
          <h2 data-testid="carousel-title">recent listening history</h2>
          <div className="header-info">
            <span className="track-count" data-testid="track-count">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container" data-testid="music-carousel">
      <div className="carousel-header">
        <h2 data-testid="carousel-title">recent listening history</h2>
        <div className="header-info">
          <span className="track-count" data-testid="track-count">{tracks.length} songs</span>
          <div className="carousel-controls">
            <button 
              onClick={scrollPrev}
              aria-label="Previous tracks"
              data-testid="button-carousel-prev"
              className="carousel-nav-button"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button 
              onClick={scrollNext}
              aria-label="Next tracks"
              data-testid="button-carousel-next"
              className="carousel-nav-button"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {tracks.length > 0 ? (
              tracks.map((track: Track) => (
                <div key={track.id} className="embla__slide" data-testid={`track-slide-${track.id}`}>
                  <div className={`card card-block card-clickable ${track.isCurrentlyPlaying ? 'currently-playing' : ''}`}>
                    <div className="track-card">
                      <div className="track-cover" style={{ position: 'relative' }}>
                        <AlbumImage
                          src={track.image}
                          alt={`${track.artist} - ${track.name}`}
                          width="100%"
                          height="100%"
                          borderRadius="8px"
                        />
                        {track.isCurrentlyPlaying && (
                          <div 
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: '#1DB954',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              animation: 'pulse 2s infinite'
                            }}
                            title="Currently Playing"
                          >
                            <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="track-info">
                        <a 
                          className="track-name" 
                          href={track.url}
                          target="_blank"
                          title={track.name}
                          rel="noopener noreferrer"
                          data-testid={`track-name-${track.id}`}
                          style={track.isCurrentlyPlaying ? { color: '#1DB954', fontWeight: '600' } : {}}
                        >
                          {track.name}
                        </a>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <a 
                            className="track-artist" 
                            href={track.artistUrl}
                            target="_blank"
                            title={track.artist}
                            rel="noopener noreferrer"
                            data-testid={`track-artist-${track.id}`}
                          >
                            {track.artist}
                          </a>
                          {track.isCurrentlyPlaying && (
                            <span 
                              style={{ 
                                fontSize: '10px', 
                                color: '#1DB954', 
                                fontWeight: '600',
                                textTransform: 'uppercase'
                              }}
                            >
                              ♪ NOW PLAYING
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : !isAuthenticated ? (
              <div className="embla__slide">
                <div className="card card-block" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <svg width="48" height="48" fill="#1DB954" viewBox="0 0 24 24" style={{ marginBottom: '16px' }}>
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </div>
                  <h3 style={{ marginBottom: '12px', color: 'var(--text-color)' }}>Connect to Spotify</h3>
                  <p style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Connect your Spotify account to see your recent listening history
                  </p>
                  <button 
                    onClick={handleSpotifyLogin}
                    data-testid="button-spotify-connect"
                    className="spotify-connect-btn"
                    style={{
                      background: '#1DB954',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    Connect with Spotify
                  </button>
                </div>
              </div>
            ) : (
              <div className="embla__slide">
                <div className="card card-block" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    No recent tracks found. Try playing some music on Spotify first.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}