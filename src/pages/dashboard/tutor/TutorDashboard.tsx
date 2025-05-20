import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const TutorDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { courses } = useCourses();
  
  // For demo, assume the tutor teaches all courses
  const tutorCourses = courses;

  // Mock data for tutor stats
  const stats = {
    totalStudents: 2847,
    totalCourses: tutorCourses.length,
    avgRating: 4.8,
    completionRate: 92,
    upcomingLiveClasses: 5,
    totalRevenue: '₹248,500'
  };

  // Mock upcoming sessions
  const upcomingSessions = [
    {
      id: '1',
      courseTitle: 'Complete Physics Course for Class 12',
      title: 'Wave Optics: Advanced Problems',
      date: '2025-05-19T15:00:00Z', // Today's date
      duration: 90, // minutes
      studentsEnrolled: 128
    },
    {
      id: '2',
      courseTitle: 'Mathematics Foundation for Class 10',
      title: 'Trigonometry Mastery Session',
      date: '2025-05-20T14:00:00Z', // Tomorrow
      duration: 60, // minutes
      studentsEnrolled: 156
    },
    {
      id: '3',
      courseTitle: 'Organic Chemistry Mastery for Class 11',
      title: 'Reaction Mechanisms Deep Dive',
      date: '2025-05-21T16:00:00Z', // Day after tomorrow
      duration: 120, // minutes
      studentsEnrolled: 98
    },
  ];

  // Mock recent uploads
  const recentUploads = [
    {
      id: '1',
      type: 'video',
      title: 'Understanding Electric Field Intensity',
      courseTitle: 'Complete Physics Course for Class 12',
      date: '2025-05-15T10:30:00Z',
      views: 86
    },
    {
      id: '2',
      type: 'pdf',
      title: 'Quadratic Equations Practice Problems',
      courseTitle: 'Mathematics Foundation for Class 10',
      date: '2025-05-14T09:15:00Z',
      downloads: 124
    },
    {
      id: '3',
      type: 'video',
      title: 'Introduction to Organic Compounds',
      courseTitle: 'Organic Chemistry Mastery for Class 11',
      date: '2025-05-12T14:45:00Z',
      views: 102
    },
  ];

  // Mock announcements
  const announcements = [
    {
      id: '1',
      title: 'Special Doubt Clearing Session',
      content: 'There will be a special doubt clearing session for Class 12 Physics students on Saturday at 3 PM.',
      date: '2025-05-14T08:30:00Z'
    },
    {
      id: '2',
      title: 'Quiz Postponed',
      content: 'The scheduled quiz for Mathematics Class 10 has been postponed to next Monday due to technical issues.',
      date: '2025-05-13T11:20:00Z'
    },
    {
      id: '3',
      title: 'New Study Materials Added',
      content: 'Important practice problems for Organic Chemistry have been uploaded. Please check the course materials section.',
      date: '2025-05-10T15:45:00Z'
    },
  ];

  return (
    <DashboardLayout>
      <div className="py-8 px-4 md:px-6">
        <div className="container">
          {/* Welcome banner */}
          <div className="bg-primary/10 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome, {profile.full_name}!</h1>
                <p className="text-muted-foreground">
                  You have {stats.upcomingLiveClasses} upcoming live classes and {stats.totalStudents} students across your courses.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/tutor/course/create">Create Course</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link to="/tutor/schedule/create">Schedule Class</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 mb-8">
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">{stats.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </CardContent>
            </Card>
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">{stats.totalCourses}</div>
                <div className="text-sm text-muted-foreground">Active Courses</div>
              </CardContent>
            </Card>
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">{stats.avgRating}</div>
                <div className="text-sm text-muted-foreground">Avg. Rating</div>
              </CardContent>
            </Card>
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">{stats.completionRate}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </CardContent>
            </Card>
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">{stats.upcomingLiveClasses}</div>
                <div className="text-sm text-muted-foreground">Upcoming Classes</div>
              </CardContent>
            </Card>
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-3xl font-bold text-primary">{stats.totalRevenue}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Sessions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Upcoming Live Classes</h2>
              <Button variant="outline" asChild>
                <Link to="/tutor/schedule">View All</Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {upcomingSessions.map(session => {
                const sessionDate = new Date(session.date);
                const now = new Date();
                const isLive = now >= sessionDate && 
                  now <= new Date(sessionDate.getTime() + session.duration * 60000);
                
                return (
                  <Card key={session.id} className="overflow-hidden">
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-4 items-center">
                        {isLive ? (
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
                          <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4">
                            <span>
                              {sessionDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} • {session.duration} min
                            </span>
                            <span>{session.courseTitle}</span>
                            <span>{session.studentsEnrolled} Students Enrolled</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {isLive ? (
                          <>
                            <Button>Start Class</Button>
                            <Button variant="outline">Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline">Edit</Button>
                            {sessionDate > now ? (
                              <Button>Prepare</Button>
                            ) : (
                              <Button variant="secondary">View Recording</Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* Content Management Tabs */}
          <div className="mb-8">
            <Tabs defaultValue="courses">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Content Management</h2>
                <TabsList>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="uploads">Uploads</TabsTrigger>
                  <TabsTrigger value="announcements">Announcements</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="courses">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {tutorCourses.map(course => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2">
                          <Badge className="bg-black/70 text-white border-0">Class {course.class_grade}</Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-white dark:bg-gray-800 border-0">
                            {course.enrolledStudentCount} Students
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center text-sm mb-4">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                            <span>{course.rating}</span>
                          </div>
                          <span>
                            {course.contentCount.videos} Videos • {course.contentCount.pdfs} PDFs • {course.contentCount.liveClasses} Live Classes
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" asChild>
                            <Link to={`/courses/${course.id}`}>View</Link>
                          </Button>
                          <Button variant="secondary" className="flex-1" asChild>
                            <Link to={`/tutor/course/${course.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="uploads">
                <div className="space-y-4">
                  {recentUploads.map(upload => (
                    <Card key={upload.id} className="overflow-hidden">
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex gap-4 items-center">
                          <div className={`p-2 rounded-lg ${
                            upload.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {upload.type === 'video' ? (
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{upload.title}</h4>
                            <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4">
                              <span>{upload.courseTitle}</span>
                              <span>{new Date(upload.date).toLocaleDateString()}</span>
                              <span>
                                {upload.type === 'video' 
                                  ? `${upload.views} Views` 
                                  : `${upload.downloads} Downloads`}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline">Edit</Button>
                          <Button variant="secondary">View</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="announcements">
                <div className="space-y-4">
                  {announcements.map(announcement => (
                    <Card key={announcement.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                          <span className="text-sm text-muted-foreground">
                            {new Date(announcement.date).toLocaleDateString()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{announcement.content}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="secondary" size="sm">Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="flex justify-center pt-4">
                    <Button variant="outline" asChild>
                      <Link to="/tutor/announcements/create">Create New Announcement</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TutorDashboard;
