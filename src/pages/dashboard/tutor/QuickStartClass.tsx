import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import liveStreamService from '@/services/liveStreamService';
import LiveStreamInterface from '@/components/LiveStreamInterface';
import { Video, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuickStartClass: React.FC = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [quickSession, setQuickSession] = useState({
    courseId: '',
    title: '',
    duration: 60
  });
  
  const { user } = useAuth();
  const { courses } = useCourses();
  const { toast } = useToast();

  const startQuickClass = async () => {
    if (!user || !quickSession.courseId || !quickSession.title) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsStarting(true);
      
      // Create session with current time as start time
      const sessionData = {
        courseId: quickSession.courseId,
        tutorId: user.id,
        title: quickSession.title,
        description: 'Quick start live class',
        startTime: new Date().toISOString(),
        duration: quickSession.duration
      };

      const createdSession = await liveStreamService.createLiveSession(sessionData);
      if (createdSession) {
        // Initialize stream immediately
        const success = await liveStreamService.initializeStream(createdSession.id, true);
        if (success) {
          setActiveSession(createdSession.id);
          toast({
            title: 'Live Class Started',
            description: 'Your quick live class has started successfully.',
          });
        }
      }
    } catch (error) {
      console.error('Error starting quick class:', error);
      toast({
        title: 'Error',
        description: 'Failed to start live class.',
        variant: 'destructive',
      });
    } finally {
      setIsStarting(false);
    }
  };

  const endQuickClass = () => {
    if (activeSession) {
      liveStreamService.disconnect();
      setActiveSession(null);
      toast({
        title: 'Live Class Ended',
        description: 'Your quick live class has ended.',
      });
    }
  };

  if (activeSession) {
    return (
      <LiveStreamInterface
        sessionId={activeSession}
        isHost={true}
        onLeave={endQuickClass}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Quick Start Live Class</CardTitle>
          <p className="text-muted-foreground">
            Start a live class instantly with your students
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="course">Select Course</Label>
            <Select 
              value={quickSession.courseId} 
              onValueChange={(value) => setQuickSession(prev => ({ ...prev, courseId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="title">Class Title</Label>
            <Input
              id="title"
              value={quickSession.title}
              onChange={(e) => setQuickSession(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Quick Doubt Clearing Session"
            />
          </div>
          
          <div>
            <Label htmlFor="duration">Expected Duration</Label>
            <Select 
              value={quickSession.duration.toString()} 
              onValueChange={(value) => setQuickSession(prev => ({ ...prev, duration: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4 space-y-3">
            <Button 
              onClick={startQuickClass} 
              disabled={isStarting || !quickSession.courseId || !quickSession.title}
              className="w-full"
              size="lg"
            >
              {isStarting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Starting Class...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Start Live Class Now
                </>
              )}
            </Button>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Students will be notified</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Recording available</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStartClass;
