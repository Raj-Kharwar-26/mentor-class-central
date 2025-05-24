
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import liveStreamService, { LiveStreamSession } from '@/services/liveStreamService';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EnhancedLiveClassInterface from '@/components/tutor/EnhancedLiveClassInterface';
import ContentUpload from '@/components/tutor/ContentUpload';
import { Calendar, Clock, Users, Video, Plus, Upload, BookOpen, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LiveClassManagement: React.FC = () => {
  const [liveSessions, setLiveSessions] = useState<LiveStreamSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sessions');
  const { user } = useAuth();
  const { courses } = useCourses();
  const { toast } = useToast();

  // Form state for creating new session
  const [newSession, setNewSession] = useState({
    courseId: '',
    title: '',
    description: '',
    startTime: '',
    duration: 60
  });

  useEffect(() => {
    fetchLiveSessions();
  }, []);

  const fetchLiveSessions = async () => {
    try {
      setIsLoading(true);
      const sessions = await liveStreamService.getLiveSessions();
      // Filter sessions for current tutor
      const tutorSessions = sessions.filter(session => session.tutorId === user?.id);
      setLiveSessions(tutorSessions);
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load live sessions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createLiveSession = async () => {
    if (!user || !newSession.courseId || !newSession.title || !newSession.startTime) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const sessionData = {
        courseId: newSession.courseId,
        tutorId: user.id,
        title: newSession.title,
        description: newSession.description,
        startTime: newSession.startTime,
        duration: newSession.duration
      };

      const createdSession = await liveStreamService.createLiveSession(sessionData);
      if (createdSession) {
        setLiveSessions(prev => [...prev, createdSession]);
        setIsCreateDialogOpen(false);
        setNewSession({
          courseId: '',
          title: '',
          description: '',
          startTime: '',
          duration: 60
        });
        toast({
          title: 'Success',
          description: 'Live session scheduled successfully.',
        });
      }
    } catch (error) {
      console.error('Error creating live session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create live session.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startLiveSession = async (sessionId: string) => {
    try {
      const success = await liveStreamService.initializeStream(sessionId, true);
      if (success) {
        setActiveSession(sessionId);
        // Update session status to live
        setLiveSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? { ...session, status: 'live' as const }
            : session
        ));
        toast({
          title: 'Live Session Started',
          description: 'Your live class has started successfully.',
        });
      }
    } catch (error) {
      console.error('Error starting live session:', error);
      toast({
        title: 'Error',
        description: 'Failed to start live session.',
        variant: 'destructive',
      });
    }
  };

  const endLiveSession = () => {
    if (activeSession) {
      liveStreamService.disconnect();
      setLiveSessions(prev => prev.map(session => 
        session.id === activeSession 
          ? { ...session, status: 'ended' as const }
          : session
      ));
      setActiveSession(null);
      toast({
        title: 'Live Session Ended',
        description: 'Your live class has ended.',
      });
    }
  };

  const handleContentUploaded = () => {
    toast({
      title: 'Content Uploaded',
      description: 'Your content has been uploaded successfully.',
    });
  };

  const getSessionStatusColor = (status: LiveStreamSession['status']) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white';
      case 'scheduled': return 'bg-blue-500 text-white';
      case 'ended': return 'bg-gray-500 text-white';
      case 'recording': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  if (activeSession) {
    return (
      <EnhancedLiveClassInterface
        sessionId={activeSession}
        isHost={true}
        onLeave={endLiveSession}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="py-8 px-4 md:px-6">
        <div className="container">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Live Classes & Content</h1>
              <p className="text-muted-foreground mt-2">
                Manage your live teaching sessions and upload course content
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Live Class
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule New Live Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="course">Course</Label>
                    <Select 
                      value={newSession.courseId} 
                      onValueChange={(value) => setNewSession(prev => ({ ...prev, courseId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
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
                    <Label htmlFor="title">Session Title</Label>
                    <Input
                      id="title"
                      value={newSession.title}
                      onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Advanced Physics - Quantum Mechanics"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={newSession.description}
                      onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of what will be covered..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="startTime">Start Date & Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={newSession.startTime}
                      onChange={(e) => setNewSession(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select 
                      value={newSession.duration.toString()} 
                      onValueChange={(value) => setNewSession(prev => ({ ...prev, duration: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={createLiveSession} 
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Schedule Class
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Live Sessions
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Content Upload
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions" className="space-y-4 mt-6">
              {/* Live Sessions List */}
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : liveSessions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Live Classes Scheduled</h3>
                    <p className="text-muted-foreground mb-4">
                      Schedule your first live class to start teaching students in real-time
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Live Class
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                liveSessions.map(session => {
                  const { date, time } = formatDateTime(session.startTime);
                  const isLive = session.status === 'live';
                  const isScheduled = session.status === 'scheduled';
                  const sessionTime = new Date(session.startTime);
                  const now = new Date();
                  const canStart = isScheduled && now >= sessionTime;

                  return (
                    <Card key={session.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{session.title}</h3>
                              <Badge className={getSessionStatusColor(session.status)}>
                                {isLive && '🔴'} {session.status.toUpperCase()}
                              </Badge>
                            </div>
                            
                            {session.description && (
                              <p className="text-muted-foreground mb-4">{session.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{time} ({session.duration} min)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{session.participantCount} participants</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            {isLive ? (
                              <Button onClick={endLiveSession} variant="destructive">
                                End Class
                              </Button>
                            ) : canStart ? (
                              <Button onClick={() => startLiveSession(session.id)}>
                                <Video className="h-4 w-4 mr-2" />
                                Start Class
                              </Button>
                            ) : session.status === 'ended' ? (
                              <Button variant="outline" disabled>
                                Completed
                              </Button>
                            ) : (
                              <Button variant="outline" disabled>
                                Scheduled
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
            
            <TabsContent value="content" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {course.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {course.subject} • Class {course.class_grade}
                        </p>
                      </CardHeader>
                    </Card>
                    
                    <ContentUpload
                      courseId={course.id}
                      onContentUploaded={handleContentUploaded}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LiveClassManagement;
