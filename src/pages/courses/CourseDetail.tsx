import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getCourse, 
    getCourseVideos, 
    getCoursePDFs, 
    getCourseLiveSessions,
    isEnrolled, 
    enrollCourse 
  } = useCourses();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const course = getCourse(id || '');
  const videos = getCourseVideos(id || '');
  const pdfs = getCoursePDFs(id || '');
  const liveSessions = getCourseLiveSessions(id || '');

  const [isEnrolling, setIsEnrolling] = useState(false);
  const enrolled = isEnrolled(id || '');

  if (!course) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login or register to enroll in this course.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    setTimeout(() => {
      enrollCourse(course.id);
      setIsEnrolling(false);
      toast({
        title: "Enrollment Successful!",
        description: `You have successfully enrolled in ${course.title}.`,
      });
    }, 1500);
  };
  
  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Get subject badge color
  const getSubjectColor = (subject: string) => {
    switch(subject) {
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Course Header */}
      <div className="bg-primary/10 py-8">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getSubjectColor(course.subject)}>
                  {course.subject.charAt(0).toUpperCase() + course.subject.slice(1)}
                </Badge>
                <Badge variant="outline">Class {course.classGrade}</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl heading-gradient mb-4">
                {course.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                {course.description}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <img 
                    src={course.instructor.profileImage || 'https://i.pravatar.cc/150'} 
                    alt={course.instructor.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div className="ml-2">
                    <div className="font-medium">{course.instructor.name}</div>
                    <div className="text-sm text-muted-foreground">Instructor</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({course.enrolledStudentCount} students)
                    </span>
                  </div>
                </div>
              </div>
              {enrolled ? (
                <div className="flex gap-4">
                  <Button size="lg" variant="outline" disabled>
                    Already Enrolled
                  </Button>
                  <Button size="lg">
                    Continue Learning
                  </Button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="text-2xl font-bold">
                    {formatPrice(course.price)}
                  </div>
                  <Button size="lg" onClick={handleEnroll} disabled={isEnrolling}>
                    {isEnrolling ? 'Processing...' : 'Enroll Now'}
                  </Button>
                </div>
              )}
            </div>
            <div>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{course.contentCount.videos + course.contentCount.pdfs + course.contentCount.liveClasses}</div>
                    <div className="text-lg font-medium">Total Learning Resources</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="font-bold text-lg">{course.contentCount.videos}</div>
                  <div className="text-xs text-muted-foreground">Videos</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="font-bold text-lg">{course.contentCount.pdfs}</div>
                  <div className="text-xs text-muted-foreground">PDFs</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <div className="font-bold text-lg">{course.contentCount.liveClasses}</div>
                  <div className="text-xs text-muted-foreground">Live Classes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content Tabs */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="live">Live Classes</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    This comprehensive course is designed to help students master all aspects of {course.subject} 
                    for Class {course.classGrade}. The curriculum follows the latest CBSE guidelines and also 
                    covers topics relevant to competitive exams.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-2">What You'll Learn</h3>
                  <div className="grid gap-2 md:grid-cols-2 mb-6">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Complete Class {course.classGrade} {course.subject} syllabus</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Problem-solving techniques</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Board exam preparation strategies</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Competitive exam prep modules</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">Requirements</h3>
                  <div className="space-y-1 mb-6">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Basic understanding of Class {parseInt(course.classGrade) - 1} concepts</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Internet connection for streaming videos and attending live classes</span>
                    </div>
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Basic notebook, stationery supplies for working through problems</span>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last updated</span>
                      <span className="text-sm font-medium">{new Date(course.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Language</span>
                      <span className="text-sm font-medium">English, Hindi</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Access</span>
                      <span className="text-sm font-medium">1 Year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Course Videos</h2>
                  
                  {videos.length > 0 ? (
                    <div className="space-y-4">
                      {enrolled ? (
                        <>
                          <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4">Featured Video</h3>
                            <VideoPlayer 
                              videoUrl={videos[0].videoUrl}
                              title={videos[0].title}
                              thumbnailUrl={videos[0].thumbnail}
                            />
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-xl font-semibold mb-2">All Videos</h3>
                            {videos.map((video) => (
                              <div 
                                key={video.id} 
                                className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                              >
                                <div className="w-40 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                  <img 
                                    src={video.thumbnail} 
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium mb-1">{video.title}</h4>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {video.description}
                                  </p>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDuration(video.duration)} • {new Date(video.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="space-y-6">
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                            <h3 className="text-xl font-semibold mb-2">Enroll to Access Videos</h3>
                            <p className="text-muted-foreground mb-4">
                              This course includes {videos.length} high-quality video lectures. Enroll to start watching.
                            </p>
                            <Button onClick={handleEnroll} disabled={isEnrolling}>
                              {isEnrolling ? 'Processing...' : 'Enroll Now'}
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            <h3 className="text-xl font-semibold">Video Preview</h3>
                            <div className="rounded-lg border p-4">
                              <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                                  1
                                </div>
                                <div>
                                  <h4 className="font-medium">{videos[0].title}</h4>
                                  <p className="text-sm text-muted-foreground">{formatDuration(videos[0].duration)}</p>
                                </div>
                              </div>
                            </div>
                            
                            {videos.slice(1).map((video, index) => (
                              <div key={video.id} className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-900">
                                <div className="flex gap-3 opacity-60">
                                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                                    {index + 2}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{video.title}</h4>
                                    <p className="text-sm text-muted-foreground">{formatDuration(video.duration)} (Locked)</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No videos available for this course yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Materials Tab */}
            <TabsContent value="materials" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Study Materials</h2>
                  
                  {pdfs.length > 0 ? (
                    <div className="space-y-4">
                      {enrolled ? (
                        <div className="space-y-4">
                          {pdfs.map((pdf) => (
                            <div 
                              key={pdf.id} 
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 text-red-700 rounded">
                                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-medium">{pdf.title}</h4>
                                  <p className="text-sm text-muted-foreground">{pdf.fileSize}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                          <h3 className="text-xl font-semibold mb-2">Enroll to Access Study Materials</h3>
                          <p className="text-muted-foreground mb-4">
                            This course includes {pdfs.length} downloadable PDF resources. Enroll to access them.
                          </p>
                          <Button onClick={handleEnroll} disabled={isEnrolling}>
                            {isEnrolling ? 'Processing...' : 'Enroll Now'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No study materials available for this course yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Live Classes Tab */}
            <TabsContent value="live" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Live Classes</h2>
                  
                  {liveSessions.length > 0 ? (
                    <div className="space-y-4">
                      {enrolled ? (
                        <div className="space-y-6">
                          {liveSessions.map((session) => {
                            const sessionDate = new Date(session.startTime);
                            const formattedDate = sessionDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            });
                            
                            const formattedTime = sessionDate.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                            
                            return (
                              <div 
                                key={session.id} 
                                className="border rounded-lg overflow-hidden"
                              >
                                <div className="p-5 flex gap-4 items-center justify-between">
                                  <div className="flex gap-4 items-center">
                                    {session.status === 'live' ? (
                                      <Badge className="bg-red-500 text-white">LIVE NOW</Badge>
                                    ) : (
                                      <div className="text-center min-w-[60px]">
                                        <div className="text-2xl font-bold">{sessionDate.getDate()}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {sessionDate.toLocaleString('default', { month: 'short' })}
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div>
                                      <h4 className="font-medium">{session.title}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {formattedDate} at {formattedTime} • {session.duration} minutes
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <Button 
                                    variant={session.status === 'live' ? "default" : "outline"}
                                    disabled={session.status === 'scheduled'}
                                  >
                                    {session.status === 'live' ? 'Join Now' : 
                                     session.status === 'scheduled' ? 'Coming Soon' : 'Watch Recording'}
                                  </Button>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t">
                                  <p className="text-sm">{session.description}</p>
                                </div>
                              </div>
                            );
                          })}
                          
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                              You'll receive notifications before each live session
                            </p>
                            <Button variant="outline" size="sm">
                              Add to Calendar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                          <h3 className="text-xl font-semibold mb-2">Enroll to Join Live Classes</h3>
                          <p className="text-muted-foreground mb-4">
                            This course includes {liveSessions.length} scheduled live sessions. Enroll to attend.
                          </p>
                          <Button onClick={handleEnroll} disabled={isEnrolling}>
                            {isEnrolling ? 'Processing...' : 'Enroll Now'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No live sessions scheduled for this course yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CourseDetail;
