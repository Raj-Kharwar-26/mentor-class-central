
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, thumbnailUrl }) => {
  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      {/* This would be replaced with a real video player in production */}
      <div className="aspect-video flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <img 
            src={thumbnailUrl || "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=1200"} 
            alt={title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium">{title}</p>
            <p className="text-sm opacity-80">(Video playback restricted in demo)</p>
          </div>
        </div>
      </div>
      
      {/* Video controls */}
      <div className="bg-gray-900 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="text-white hover:text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="text-white hover:text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0l-4.243 4.243m-8.485 0l4.243-4.243" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="text-white hover:text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button className="text-white hover:text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
