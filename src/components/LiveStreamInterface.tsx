
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import liveStreamService, { ChatMessage, StreamParticipant } from '@/services/liveStreamService';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Hand, 
  Send,
  Users,
  Settings
} from 'lucide-react';

interface LiveStreamInterfaceProps {
  sessionId: string;
  isHost: boolean;
  onLeave: () => void;
}

const LiveStreamInterface: React.FC<LiveStreamInterfaceProps> = ({
  sessionId,
  isHost,
  onLeave
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [participants, setParticipants] = useState<StreamParticipant[]>([]);
  const [showChat, setShowChat] = useState<boolean>(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    initializeStream();
    setupEventHandlers();

    return () => {
      liveStreamService.disconnect();
    };
  }, [sessionId, isHost]);

  const initializeStream = async () => {
    try {
      const success = await liveStreamService.initializeStream(sessionId, isHost);
      if (success) {
        setIsConnected(true);
        
        // Display local video
        if (localVideoRef.current && liveStreamService.localStream) {
          localVideoRef.current.srcObject = liveStreamService.localStream;
        }
      }
    } catch (error) {
      console.error('Error initializing stream:', error);
    }
  };

  const setupEventHandlers = () => {
    liveStreamService.onRemoteStreamAdded = (participantId: string, stream: MediaStream) => {
      // Create video element for remote participant
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.className = 'w-full h-full object-cover rounded-lg';
      videoElement.id = `remote-${participantId}`;

      if (remoteVideosRef.current) {
        remoteVideosRef.current.appendChild(videoElement);
      }
    };

    liveStreamService.onChatMessage = (message: any) => {
      if (message.type === 'chat') {
        const chatMessage: ChatMessage = {
          id: Date.now().toString(),
          sessionId,
          userId: message.userId || 'unknown',
          userName: message.userName || 'Anonymous',
          message: message.message,
          timestamp: message.timestamp,
          type: 'text'
        };
        setChatMessages(prev => [...prev, chatMessage]);
      } else if (message.type === 'hand_raise') {
        // Handle hand raise notification
        const systemMessage: ChatMessage = {
          id: Date.now().toString(),
          sessionId,
          userId: 'system',
          userName: 'System',
          message: `${message.userName || 'A participant'} raised their hand`,
          timestamp: message.timestamp,
          type: 'system'
        };
        setChatMessages(prev => [...prev, systemMessage]);
      }
    };
  };

  const toggleMute = () => {
    const muted = liveStreamService.toggleMute();
    setIsMuted(muted);
  };

  const toggleVideo = () => {
    const videoOff = liveStreamService.toggleVideo();
    setIsVideoOff(videoOff);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await liveStreamService.stopScreenShare();
      setIsScreenSharing(false);
    } else {
      const success = await liveStreamService.startScreenShare();
      if (success) {
        setIsScreenSharing(true);
      }
    }
  };

  const toggleHandRaise = () => {
    if (!isHost) {
      liveStreamService.raiseHand(sessionId);
      setIsHandRaised(!isHandRaised);
    }
  };

  const sendChatMessage = () => {
    if (newMessage.trim() && user) {
      liveStreamService.sendChatMessage(newMessage, sessionId);
      
      // Add message to local chat immediately
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        sessionId,
        userId: user.id,
        userName: user.user_metadata?.full_name || 'You',
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setChatMessages(prev => [...prev, chatMessage]);
      setNewMessage('');
    }
  };

  const startRecording = async () => {
    if (isHost) {
      const success = await liveStreamService.startRecording(sessionId);
      if (success) {
        setIsRecording(true);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Recording stop is handled in the service
  };

  const leaveSession = () => {
    liveStreamService.disconnect();
    onLeave();
  };

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Main video area */}
      <div className="flex-1 relative">
        {/* Remote participants grid */}
        <div 
          ref={remoteVideosRef}
          className="absolute inset-0 grid grid-cols-2 gap-2 p-4"
        >
          {/* Remote video elements will be added here dynamically */}
        </div>

        {/* Local video (picture-in-picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-white/20">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs">
              You {isHost && '(Host)'}
            </Badge>
          </div>
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4">
            <Badge variant="destructive" className="animate-pulse">
              🔴 Recording
            </Badge>
          </div>
        )}

        {/* Connection status */}
        {!isConnected && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Connecting to live session...</p>
            </div>
          </div>
        )}

        {/* Controls bar */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="sm"
              onClick={toggleMute}
              className="rounded-full w-10 h-10 p-0"
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            <Button
              variant={isVideoOff ? "destructive" : "secondary"}
              size="sm"
              onClick={toggleVideo}
              className="rounded-full w-10 h-10 p-0"
            >
              {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </Button>

            {isHost && (
              <Button
                variant={isScreenSharing ? "default" : "secondary"}
                size="sm"
                onClick={toggleScreenShare}
                className="rounded-full w-10 h-10 p-0"
              >
                <Monitor className="h-4 w-4" />
              </Button>
            )}

            {!isHost && (
              <Button
                variant={isHandRaised ? "default" : "secondary"}
                size="sm"
                onClick={toggleHandRaise}
                className="rounded-full w-10 h-10 p-0"
              >
                <Hand className="h-4 w-4" />
              </Button>
            )}

            {isHost && (
              <Button
                variant={isRecording ? "destructive" : "secondary"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                className="rounded-full w-10 h-10 p-0"
              >
                {isRecording ? '⏹️' : '🔴'}
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={leaveSession}
              className="rounded-full px-4"
            >
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Chat sidebar */}
      {showChat && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Live Chat</span>
              <Badge variant="outline" className="ml-2">
                <Users className="h-3 w-3 mr-1" />
                {participants.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`
                    ${message.type === 'system' ? 'text-center text-gray-500 text-sm' : ''}
                  `}>
                    {message.type === 'text' && (
                      <div className={`
                        ${message.userId === user?.id ? 'text-right' : 'text-left'}
                      `}>
                        <div className={`
                          inline-block px-3 py-2 rounded-lg max-w-[80%]
                          ${message.userId === user?.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-gray-100 text-gray-900'
                          }
                        `}>
                          <p className="text-sm font-medium">{message.userName}</p>
                          <p>{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {message.type === 'system' && (
                      <p>{message.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  className="flex-1"
                />
                <Button onClick={sendChatMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      )}

      {/* Toggle chat button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setShowChat(!showChat)}
        className="absolute top-4 right-4 z-10"
      >
        💬
      </Button>
    </div>
  );
};

export default LiveStreamInterface;
