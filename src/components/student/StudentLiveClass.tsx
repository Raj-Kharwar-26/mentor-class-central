import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MessageSquare, 
  Users, 
  Phone,
  Hand,
  Send,
  HandMetal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentLiveClassProps {
  sessionId: string;
  onLeave: () => void;
}

interface ChatMessage {
  id: string;
  participantId: string;
  participantName: string;
  message: string;
  timestamp: Date;
}

const StudentLiveClass: React.FC<StudentLiveClassProps> = ({ sessionId, onLeave }) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      participantId: 'tutor',
      participantName: 'Dr. Sarah Wilson',
      message: 'Welcome everyone! Today we will cover differentiation rules.',
      timestamp: new Date(Date.now() - 5 * 60000)
    },
    {
      id: '2',
      participantId: '2',
      participantName: 'John Smith',
      message: 'Thank you for the session!',
      timestamp: new Date(Date.now() - 2 * 60000)
    }
  ]);
  const [sessionDuration, setSessionDuration] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? 'Camera turned off' : 'Camera turned on',
    });
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? 'Microphone muted' : 'Microphone unmuted',
    });
  };

  const toggleRaiseHand = () => {
    setHasRaisedHand(!hasRaisedHand);
    toast({
      title: hasRaisedHand ? 'Hand lowered' : 'Hand raised',
      description: hasRaisedHand ? 'You lowered your hand' : 'The teacher will see your raised hand',
    });
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      participantId: 'student',
      participantName: 'You',
      message: chatMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-white font-medium">Mathematics Live Class</div>
          <Badge variant="secondary" className="bg-red-600 text-white">
            🔴 LIVE
          </Badge>
          <div className="text-gray-300 text-sm">
            {formatDuration(sessionDuration)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-gray-300 text-sm flex items-center gap-1">
            <Users className="h-4 w-4" />
            4 participants
          </div>
          {hasRaisedHand && (
            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
              <Hand className="h-3 w-3 mr-1" />
              Hand Raised
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4">
          {/* Teacher's Main Video */}
          <div className="mb-4 relative">
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative">
                <div className="text-white text-center">
                  <div className="relative w-full h-full">
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold">SW</span>
                        </div>
                        <p className="text-lg font-medium">Dr. Sarah Wilson</p>
                        <p className="text-sm opacity-75">Teaching Mathematics</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      Dr. Sarah Wilson (Teacher)
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Student's Own Video */}
          <div className="grid grid-cols-4 gap-2">
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                {isVideoOn ? (
                  <div className="w-full h-full bg-gradient-to-br from-green-900 to-teal-900 flex items-center justify-center">
                    <div className="text-white text-lg font-bold">You</div>
                  </div>
                ) : (
                  <VideoOff className="h-8 w-8 text-gray-400" />
                )}
                
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                  You
                </div>
                
                <div className="absolute bottom-1 right-1 flex gap-1">
                  {!isAudioOn && (
                    <div className="bg-red-600 rounded-full p-1">
                      <MicOff className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {hasRaisedHand && (
                    <div className="bg-yellow-500 rounded-full p-1">
                      <Hand className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Other students */}
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
                  <div className="text-white text-lg font-bold">JS</div>
                </div>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                  John
                </div>
              </div>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                <VideoOff className="h-8 w-8 text-gray-400" />
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                  Emma
                </div>
                <div className="absolute bottom-1 right-1">
                  <div className="bg-yellow-500 rounded-full p-1">
                    <Hand className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Class Chat</h3>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-blue-400 text-sm font-medium">
                        {msg.participantName}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-gray-700 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <Button size="sm" onClick={sendChatMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Controls */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-center gap-4">
        <Button
          variant={isAudioOn ? "default" : "destructive"}
          size="lg"
          onClick={toggleAudio}
          className="rounded-full w-12 h-12"
        >
          {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={isVideoOn ? "default" : "destructive"}
          size="lg"
          onClick={toggleVideo}
          className="rounded-full w-12 h-12"
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Button
          variant={hasRaisedHand ? "secondary" : "outline"}
          size="lg"
          onClick={toggleRaiseHand}
          className="rounded-full w-12 h-12"
        >
          <Hand className="h-5 w-5" />
        </Button>
        
        <Button
          variant={isChatOpen ? "secondary" : "outline"}
          size="lg"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="rounded-full w-12 h-12 relative"
        >
          <MessageSquare className="h-5 w-5" />
          {chatMessages.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
              {chatMessages.length}
            </Badge>
          )}
        </Button>
        
        <div className="w-px h-8 bg-gray-600 mx-2" />
        
        <Button
          variant="destructive"
          size="lg"
          onClick={onLeave}
          className="rounded-full px-6"
        >
          <Phone className="h-5 w-5 mr-2" />
          Leave Class
        </Button>
      </div>
    </div>
  );
};

export default StudentLiveClass;
