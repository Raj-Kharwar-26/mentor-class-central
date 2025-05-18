
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CourseContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useCourses();
  
  // Mock data for platform stats
  const stats = {
    totalStudents: 10542,
    totalTutors: 48,
    totalCourses: courses.length,
    totalLiveClasses: 267,
    totalRevenue: '₹4,835,500',
    totalVideoViews: '138,642'
  };

  // Mock recent activities
  const recentActivities = [
    {
      id: '1',
      action: 'New Student Registration',
      details: 'Arun Kumar registered as a new student',
      time: '10 minutes ago'
    },
    {
      id: '2',
      action: 'Course Published',
      details: 'Chemistry for Class 10 has been published by Dr. Meera Patel',
      time: '2 hours ago'
    },
    {
      id: '3',
      action: 'Support Ticket',
      details: 'New support ticket #4582 requires attention',
      time: '3 hours ago'
    },
    {
      id: '4',
      action: 'Live Class Completed',
      details: 'Physics for Class 12 live class has ended with 247 attendees',
      time: '5 hours ago'
    },
    {
      id: '5',
      action: 'Payment Received',
      details: 'Received ₹5,999 from Rahul Verma for Physics Class 12',
      time: '8 hours ago'
    },
  ];

  // Mock performance data
  const performance = [
    {
      course: 'Physics Class 12',
      enrollments: 1287,
      completionRate: 78,
      averageRating: 4.8,
      revenue: '₹7,720,413'
    },
    {
      course: 'Mathematics Class 10',
      enrollments: 1560,
      completionRate: 82,
      averageRating: 4.7,
      revenue: '₹6,237,240'
    },
    {
      course: 'Chemistry Class 11',
      enrollments: 980,
      completionRate: 75,
      averageRating: 4.9,
      revenue: '₹4,895,020'
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
                <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.name}! Here's an overview of your platform.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/admin/reports">View Reports</Link>
                </Button>
                <Button size="lg" asChild>
                  <Link to="/admin/settings">Platform Settings</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 mb-8">
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">{stats.totalStudents.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Students</div>
              </CardContent>
            </Card>
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">{stats.totalTutors}</div>
                <div className="text-xs text-muted-foreground">Total Tutors</div>
              </CardContent>
            </Card>
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">{stats.totalCourses}</div>
                <div className="text-xs text-muted-foreground">Active Courses</div>
              </CardContent>
            </Card>
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">{stats.totalLiveClasses}</div>
                <div className="text-xs text-muted-foreground">Live Classes</div>
              </CardContent>
            </Card>
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">{stats.totalRevenue}</div>
                <div className="text-xs text-muted-foreground">Total Revenue</div>
              </CardContent>
            </Card>
            <Card className="stats-card">
              <CardContent className="p-4 flex flex-col items-center">
                <div className="text-2xl font-bold text-primary">{stats.totalVideoViews}</div>
                <div className="text-xs text-muted-foreground">Video Views</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Admin Management Tabs */}
          <div className="mb-8">
            <Tabs defaultValue="users">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Platform Management</h2>
                <TabsList>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>User Management</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/users/students">Students</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/users/tutors">Tutors</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/users/admins">Admins</Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Role</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-right p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">Priya Sharma</td>
                            <td className="p-2">priya.s@example.com</td>
                            <td className="p-2">Student</td>
                            <td className="p-2">
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            </td>
                            <td className="p-2 text-right">
                              <Button variant="ghost" size="sm" className="h-8 px-2">View</Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Dr. Rajiv Kumar</td>
                            <td className="p-2">dr.rajiv@example.com</td>
                            <td className="p-2">Tutor</td>
                            <td className="p-2">
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            </td>
                            <td className="p-2 text-right">
                              <Button variant="ghost" size="sm" className="h-8 px-2">View</Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Rahul Verma</td>
                            <td className="p-2">rahul.v@example.com</td>
                            <td className="p-2">Student</td>
                            <td className="p-2">
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            </td>
                            <td className="p-2 text-right">
                              <Button variant="ghost" size="sm" className="h-8 px-2">View</Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/users">View All Users</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="courses">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Course Management</CardTitle>
                      <Button size="sm" asChild>
                        <Link to="/admin/course/create">Add New Course</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Course</th>
                            <th className="text-left p-2">Subject</th>
                            <th className="text-left p-2">Class</th>
                            <th className="text-left p-2">Instructor</th>
                            <th className="text-left p-2">Students</th>
                            <th className="text-right p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.slice(0, 3).map(course => (
                            <tr key={course.id} className="border-b">
                              <td className="p-2">{course.title}</td>
                              <td className="p-2 capitalize">{course.subject}</td>
                              <td className="p-2">{course.classGrade}</td>
                              <td className="p-2">{course.instructor.name}</td>
                              <td className="p-2">{course.enrolledStudentCount}</td>
                              <td className="p-2 text-right">
                                <Button variant="ghost" size="sm" className="h-8 px-2">View</Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/courses">View All Courses</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Content Management</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/content/videos">Videos</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/admin/content/pdfs">PDFs</Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link to="/admin/content/upload">Upload Content</Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Title</th>
                            <th className="text-left p-2">Type</th>
                            <th className="text-left p-2">Course</th>
                            <th className="text-left p-2">Uploaded By</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-right p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">Introduction to Mechanics</td>
                            <td className="p-2">Video</td>
                            <td className="p-2">Physics Class 12</td>
                            <td className="p-2">Dr. Rajiv Kumar</td>
                            <td className="p-2">
                              <Badge className="bg-green-100 text-green-800">Published</Badge>
                            </td>
                            <td className="p-2 text-right">
                              <Button variant="ghost" size="sm" className="h-8 px-2">View</Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Trigonometry Formula Sheet</td>
                            <td className="p-2">PDF</td>
                            <td className="p-2">Mathematics Class 10</td>
                            <td className="p-2">Priya Sharma</td>
                            <td className="p-2">
                              <Badge className="bg-green-100 text-green-800">Published</Badge>
                            </td>
                            <td className="p-2 text-right">
                              <Button variant="ghost" size="sm" className="h-8 px-2">View</Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Chemical Bonding Explained</td>
                            <td className="p-2">Video</td>
                            <td className="p-2">Chemistry Class 11</td>
                            <td className="p-2">Dr. Anand Verma</td>
                            <td className="p-2">
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            </td>
                            <td className="p-2 text-right">
                              <Button variant="ghost" size="sm" className="h-8 px-2">View</Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/content">View All Content</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4 items-start">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        index % 2 === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{activity.action}</h3>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/activity">View All Activity</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Top Performing Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performance.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">{item.course}</h3>
                        <Badge className="bg-primary/10 text-primary">Top {index + 1}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Enrollments</p>
                          <p className="font-medium">{item.enrollments.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Completion</p>
                          <p className="font-medium">{item.completionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Rating</p>
                          <p className="font-medium">{item.averageRating}/5.0</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="font-medium">{item.revenue}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/analytics">View Analytics</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
