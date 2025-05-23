
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';

const StudentDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { courses, enrolledCourses, enrollments } = useCourses();
  
  // Get user's enrolled courses
  const userCourses = enrollments
    .filter(enrollment => enrollment.status === 'active')
    .map(enrollment => {
      const course = courses.find(c => c.id === enrollment.course_id);
      return course;
    })
    .filter(Boolean);

  // Mock data for student stats
  const stats = {
    totalWatchTime: '26 hours',
    completedLessons: 48,
    totalLessons: 120,
    activeCourses: userCourses.length,
    upcomingLiveClasses: 3,
    averageQuizScore: 82
  };

  // Mock upcoming classes
  const upcomingClasses = [
    {
      id: '1',
      courseTitle: 'Complete Physics Course for Class 12',
      title: 'Wave Optics: Advanced Problems',
      date: '2025-06-25T15:00:00Z',
      duration: 90, // minutes
    },
    {
      id: '2',
      courseTitle: 'Mathematics Foundation for Class 10',
      title: 'Trigonometry Mastery Session',
      date: '2025-06-26T14:00:00Z',
      duration: 60, // minutes
    },
    {
      id: '3',
      courseTitle: 'Organic Chemistry Mastery for Class 11',
      title: 'Reaction Mechanisms Deep Dive',
      date: '2025-06-27T16:00:00Z',
      duration: 120, // minutes
    },
  ];

  return (
    <div className="py-8 px-4 md:px-6">
      <div className="container">
        {/* Welcome banner */}
        <div className="bg-primary/10 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, {profile?.full_name}!</h1>
              <p className="text-muted-foreground">
                Continue your learning journey. You have {stats.upcomingLiveClasses} upcoming live classes this week.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="stats-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">{stats.totalWatchTime}</div>
              <div className="text-sm text-muted-foreground">Watch Time</div>
            </CardContent>
          </Card>
          <Card className="stats-card">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Course Completion</div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-xl font-bold">{Math.round(stats.completedLessons / stats.totalLessons * 100)}%</div>
                <div className="text-xs text-muted-foreground">{stats.completedLessons}/{stats.totalLessons} lessons</div>
              </div>
              <Progress value={stats.completedLessons / stats.totalLessons * 100} className="h-2" />
            </CardContent>
          </Card>
          <Card className="stats-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">{stats.activeCourses}</div>
              <div className="text-sm text-muted-foreground">Active Courses</div>
            </CardContent>
          </Card>
          <Card className="stats-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="text-3xl font-bold text-primary">{stats.averageQuizScore}%</div>
              <div className="text-sm text-muted-foreground">Avg. Quiz Score</div>
            </CardContent>
          </Card>
        </div>
        
        {/* My courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <Button variant="outline" asChild>
              <Link to="/student/courses">View All</Link>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userCourses.map(course => course && (
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
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span>42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <Button variant="secondary" className="w-full" asChild>
                    <Link to={`/courses/${course.id}`}>Continue Learning</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {userCourses.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                <h3 className="text-lg font-medium mb-2">No courses enrolled yet</h3>
                <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course</p>
                <Button asChild>
                  <Link to="/courses">Explore Courses</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming live classes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Upcoming Live Classes</h2>
            <Button variant="outline" asChild>
              <Link to="/student/schedule">View Schedule</Link>
            </Button>
          </div>
          
          <div className="space-y-4">
            {upcomingClasses.map(session => {
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
                        <p className="text-sm text-muted-foreground">
                          {sessionDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} • {session.duration} min • {session.courseTitle}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant={isLive ? "default" : "outline"}
                      disabled={!isLive && sessionDate > now}
                    >
                      {isLive ? 'Join Now' : 
                       sessionDate > now ? 'Reminder Set' : 'Watch Recording'}
                    </Button>
                  </div>
                </Card>
              );
            })}
            
            {upcomingClasses.length === 0 && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border">
                <h3 className="text-lg font-medium mb-2">No upcoming live classes</h3>
                <p className="text-muted-foreground">Check back later for new schedule updates</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
