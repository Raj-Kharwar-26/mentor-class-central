import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, FileText, Video as VideoIcon, Calendar, CheckCircle, Play, AlertCircle } from 'lucide-react';
import { Course, LiveSession, PDF, VideoContent, useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import VideoPlayer from '@/components/VideoPlayer';
import StudentLiveClass from '@/components/student/StudentLiveClass';
import QuickEnrollButton from '@/components/QuickEnrollButton';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { getCourseById, isEnrolled, getCourseVideos, getCoursePDFs, getCourseLiveSessions } = useCourses();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [activeLiveSession, setActiveLiveSession] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) {
        console.log('No courseId provided');
        setError('No course ID provided');
        setLoading(false);
        return;
      }
      
      console.log('Fetching course details for:', courseId);
      setLoading(true);
      setError(null);
      
      try {
        const courseData = await getCourseById(courseId);
        console.log('Course data received:', courseData);
        
        if (courseData) {
          setCourse(courseData);
          
          // Fetch course content in parallel
          console.log('Fetching course content...');
          const [videosData, pdfsData, liveSessionsData] = await Promise.all([
            getCourseVideos(courseId),
            getCoursePDFs(courseId),
            getCourseLiveSessions(courseId)
          ]);
          
          console.log('Content loaded:', { 
            videos: videosData?.length || 0, 
            pdfs: pdfsData?.length || 0, 
            sessions: liveSessionsData?.length || 0 
          });
          
          setVideos(videosData || []);
          setPdfs(pdfsData || []);
          setLiveSessions(liveSessionsData || []);
          
          // Set first video as selected if available
          if (videosData && videosData.length > 0) {
            setSelectedVideo(videosData[0]);
          }
        } else {
          console.log('No course data found for ID:', courseId);
          setError('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details');
        toast({
          title: 'Error',
          description: 'Failed to load course details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [courseId, getCourseById, getCourseVideos, getCoursePDFs, getCourseLiveSessions, toast]);

  const joinLiveSession = (sessionId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to join live classes.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!courseId || !isEnrolled(courseId)) {
      toast({
        title: 'Enrollment Required',
        description: 'Please enroll in this course to join live classes.',
        variant: 'destructive',
      });
      return;
    }
    
    setActiveLiveSession(sessionId);
    toast({
      title: 'Joining Live Class',
      description: 'You are now joining the live class.',
    });
  };

  const leaveLiveSession = () => {
    setActiveLiveSession(null);
    toast({
      title: 'Left Live Class',
      description: 'You have left the live class.',
    });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getSubjectColor = (subject: string) => {
    const lowerSubject = subject.toLowerCase();
    switch(lowerSubject) {
      case 'mathematics':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'physics':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'chemistry':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'biology':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // If in live session, show the live class interface
  if (activeLiveSession) {
    return (
      <StudentLiveClass 
        sessionId={activeLiveSession}
        onLeave={leaveLiveSession}
      />
    );
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading course details...</p>
          <p className="text-sm text-muted-foreground">Course ID: {courseId}</p>
        </div>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">
            {error === 'Course not found' ? 'Course Not Found' : 'Error Loading Course'}
          </h2>
          <p className="mb-6 text-muted-foreground">
            {error || 'The course you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">Course ID: {courseId}</p>
          <div className="flex gap-4">
            <Link to="/courses">
              <Button>Browse All Courses</Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Quick enrollment banner for non-enrolled users */}
      {!isEnrolled(course.id) && isAuthenticated && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Enroll to Access Full Content</h3>
              <p className="text-blue-700">Join this course to access all videos, materials, and live classes.</p>
            </div>
            <div className="ml-4">
              <QuickEnrollButton courseId={course.id} courseName={course.title} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Info - Left Column */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={getSubjectColor(course.subject)}>
              {course.subject}
            </Badge>
            {course.class_grade && (
              <Badge variant="outline">
                Class {course.class_grade}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <div className="flex items-center mr-4">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{course.rating}</span>
              <span className="ml-1">({course.enrolledStudentCount} students)</span>
            </div>
            <div className="flex items-center mr-4">
              <Clock className="h-4 w-4 mr-1" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>By {course.instructor?.name}</span>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">About This Course</h2>
            <p className="text-muted-foreground whitespace-pre-line">{course.description}</p>
          </div>
          
          {/* Course Content Tabs */}
          <Tabs defaultValue="videos" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="videos" className="flex items-center">
                <VideoIcon className="h-4 w-4 mr-2" />
                Videos {videos.length > 0 && <span className="ml-1">({videos.length})</span>}
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Materials {pdfs.length > 0 && <span className="ml-1">({pdfs.length})</span>}
              </TabsTrigger>
              <TabsTrigger value="live-sessions" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Live Sessions {liveSessions.length > 0 && <span className="ml-1">({liveSessions.length})</span>}
              </TabsTrigger>
            </TabsList>
            
            {/* Videos Content */}
            <TabsContent value="videos" className="space-y-4">
              {videos.length === 0 ? (
                <p className="text-muted-foreground">No videos available for this course yet.</p>
              ) : (
                <div className="space-y-4">
                  {videos.map((video) => (
                    <Card key={video.id} className={`cursor-pointer hover:border-primary transition-colors ${selectedVideo?.id === video.id ? 'border-primary' : ''}`}
                      onClick={() => setSelectedVideo(video)}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 flex-shrink-0 bg-muted rounded-md flex items-center justify-center">
                            <VideoIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{video.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {Math.floor(video.duration / 60)}min {video.duration % 60}sec
                            </p>
                          </div>
                        </div>
                        {selectedVideo?.id === video.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Video Player for Selected Video */}
              {selectedVideo && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-2">{selectedVideo.title}</h3>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <VideoPlayer videoUrl={selectedVideo.video_url} thumbnail={selectedVideo.thumbnail || undefined} />
                  </div>
                  {selectedVideo.description && (
                    <p className="mt-3 text-muted-foreground">{selectedVideo.description}</p>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Materials Content */}
            <TabsContent value="materials" className="space-y-4">
              {pdfs.length === 0 ? (
                <p className="text-muted-foreground">No study materials available for this course yet.</p>
              ) : (
                <div className="space-y-3">
                  {pdfs.map((pdf) => (
                    <Card key={pdf.id} className="hover:border-primary transition-colors">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 flex-shrink-0 bg-muted rounded-md flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{pdf.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {pdf.file_size}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={pdf.file_url} target="_blank" rel="noreferrer">
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Showing limited PDFs if not enrolled */}
              {!isEnrolled(course.id) && pdfs.length > 1 && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold">Enroll to access all {pdfs.length} materials</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    You're viewing the preview content. Enroll in this course to access all materials.
                  </p>
                  <QuickEnrollButton courseId={course.id} courseName={course.title} />
                </div>
              )}
            </TabsContent>
            
            {/* Live Sessions Content */}
            <TabsContent value="live-sessions" className="space-y-4">
              {liveSessions.length === 0 ? (
                <p className="text-muted-foreground">No live sessions scheduled for this course yet.</p>
              ) : (
                <div className="space-y-4">
                  {liveSessions.map((session) => (
                    <Card key={session.id} className="hover:border-primary transition-colors">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div>
                            <h3 className="font-medium text-lg">{session.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {formatDate(session.start_time)} · {session.duration} minutes
                            </p>
                            {session.description && (
                              <p className="text-sm mb-3">{session.description}</p>
                            )}
                          </div>
                          
                          <div className="mt-3 md:mt-0 md:ml-4 flex items-center">
                            <Badge className={`mr-3 ${
                              session.status === 'live' ? 'bg-red-100 text-red-800' :
                              session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </Badge>
                            
                            {session.status === 'live' && isEnrolled(course.id) && (
                              <Button 
                                size="sm"
                                onClick={() => joinLiveSession(session.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Join Live Class
                              </Button>
                            )}
                            {session.status === 'scheduled' && (
                              <Button variant="outline" size="sm">
                                Set Reminder
                              </Button>
                            )}
                            {session.status === 'completed' && session.recording_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={session.recording_url} target="_blank" rel="noreferrer">
                                  Watch Recording
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Showing limited info if not enrolled */}
              {!isEnrolled(course.id) && liveSessions.length > 0 && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold">Enroll to access live sessions</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    You can view the schedule, but you need to enroll to join the live sessions.
                  </p>
                  <QuickEnrollButton courseId={course.id} courseName={course.title} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Enrollment Card - Right Column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                <img 
                  src={course.thumbnail || 'https://placehold.co/600x400?text=Course'} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mb-6">
                <div className="text-3xl font-bold mb-3">
                  {formatPrice(course.price)}
                </div>
                
                <QuickEnrollButton courseId={course.id} courseName={course.title} />
                
                <p className="text-center text-sm text-muted-foreground mt-3">
                  Access to all course materials
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">This course includes:</h3>
                <div className="flex items-start space-x-3">
                  <VideoIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{videos.length} videos</p>
                    <p className="text-sm text-muted-foreground">
                      {course.duration} of content
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{pdfs.length} downloadable resources</p>
                    <p className="text-sm text-muted-foreground">
                      PDFs, notes, and assignments
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{liveSessions.length} live sessions</p>
                    <p className="text-sm text-muted-foreground">
                      Interactive classes with the instructor
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
