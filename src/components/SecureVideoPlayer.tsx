
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SecureVideoPlayerProps {
  videoId: string;
  courseId: string;
  onProgress?: (progress: number) => void;
  autoPlay?: boolean;
}

const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({ 
  videoId, 
  courseId, 
  onProgress, 
  autoPlay = false 
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [streamingUrls, setStreamingUrls] = useState<Record<string, string>>({});
  const [currentQuality, setCurrentQuality] = useState<string>('720p');
  const [accessToken, setAccessToken] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [showControls, setShowControls] = useState<boolean>(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadSecureVideo();
  }, [videoId, user]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleTimeUpdate = () => {
        const currentProgress = videoElement.currentTime;
        setProgress(currentProgress);
        onProgress?.(currentProgress);
      };

      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('ended', handleEnded);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [onProgress]);

  // Auto-hide controls
  useEffect(() => {
    const hideControls = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (showControls && isPlaying) {
      controlsTimeoutRef.current = setTimeout(hideControls, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const loadSecureVideo = async () => {
    if (!user) {
      setError('Authentication required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get secure streaming URLs
      const { data, error } = await supabase.functions.invoke('video-stream', {
        body: { videoId, courseId },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      setStreamingUrls(data.streamingUrls);
      setAccessToken(data.accessToken);

      // Detect bandwidth and set initial quality
      await detectOptimalQuality();
      
    } catch (err: any) {
      console.error('Error loading secure video:', err);
      setError(err.message || 'Failed to load video');
    } finally {
      setIsLoading(false);
    }
  };

  const detectOptimalQuality = async () => {
    // Simple bandwidth detection
    const startTime = Date.now();
    try {
      const response = await fetch('/placeholder.svg'); // Small test file
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      const fileSize = 1024; // Approximate size
      const bandwidth = (fileSize * 8) / duration; // bits per second

      if (bandwidth > 5000000) { // 5 Mbps
        setCurrentQuality('1080p');
      } else if (bandwidth > 2000000) { // 2 Mbps
        setCurrentQuality('720p');
      } else {
        setCurrentQuality('360p');
      }
    } catch (error) {
      console.log('Could not detect bandwidth, using 720p');
      setCurrentQuality('720p');
    }
  };

  const changeQuality = (quality: string) => {
    if (streamingUrls[quality] && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setCurrentQuality(quality);
      
      // Store current position and reload with new quality
      videoRef.current.src = streamingUrls[quality];
      videoRef.current.currentTime = currentTime;
      
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleProgressChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-black flex items-center justify-center">
        <div className="text-white">Loading secure video...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="mb-4">Error loading video: {error}</p>
          <Button onClick={loadSecureVideo} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-black"
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        src={streamingUrls[currentQuality]}
        onClick={togglePlayPause}
        preload="metadata"
        crossOrigin="anonymous"
      >
        Your browser does not support secure video playback.
      </video>

      {/* DRM Protection Overlay */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-4 right-4 text-xs text-white/50">
          Protected Content
        </div>
      </div>

      {/* Video Controls */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full flex flex-col gap-2">
          {/* Progress bar */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={(e) => handleProgressChange(Number(e.target.value))}
            className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause button */}
              <button 
                onClick={togglePlayPause}
                className="text-white hover:text-primary focus:outline-none"
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>

              {/* Time display */}
              <div className="text-sm text-white">
                {formatTime(progress)} / {formatTime(duration)}
              </div>

              {/* Quality selector */}
              <select
                value={currentQuality}
                onChange={(e) => changeQuality(e.target.value)}
                className="bg-black/50 text-white text-sm px-2 py-1 rounded border border-white/30"
              >
                {Object.keys(streamingUrls).map(quality => (
                  <option key={quality} value={quality}>
                    {quality}
                  </option>
                ))}
              </select>
            </div>

            {/* Volume and fullscreen controls */}
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={(e) => {
                  const newVolume = Number(e.target.value);
                  setVolume(newVolume);
                  if (videoRef.current) {
                    videoRef.current.volume = newVolume;
                  }
                }}
                className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer hidden md:block"
              />

              <button 
                onClick={() => {
                  if (videoRef.current) {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      videoRef.current.requestFullscreen();
                    }
                  }
                }}
                className="text-white hover:text-primary focus:outline-none"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Play button overlay when paused */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlayPause}
        >
          <div className="bg-white/20 rounded-full p-5 backdrop-blur-sm">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecureVideoPlayer;
