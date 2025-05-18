
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { useCourses } from '@/contexts/CourseContext';

const Home = () => {
  const { courses } = useCourses();

  // Mock stats
  const stats = [
    { label: 'Students', value: '10,000+' },
    { label: 'Courses', value: '200+' },
    { label: 'Tutors', value: '50+' },
    { label: 'Success Rate', value: '98%' },
  ];

  // Mock testimonials
  const testimonials = [
    {
      content: "EduCoach helped me secure 95% in my Class 12 board exams. The teachers are excellent and the study materials are comprehensive.",
      author: "Priya Sharma",
      role: "Class 12 Student",
      avatar: "https://i.pravatar.cc/150?u=priya"
    },
    {
      content: "The live classes and instant doubt clearing sessions are game changers. It feels like having a personal tutor available 24/7.",
      author: "Rahul Verma",
      role: "Class 11 Student",
      avatar: "https://i.pravatar.cc/150?u=rahul"
    },
    {
      content: "My son's grades improved significantly after enrolling in EduCoach's courses. The platform's approach to teaching is exceptional.",
      author: "Mrs. Gupta",
      role: "Parent",
      avatar: "https://i.pravatar.cc/150?u=gupta"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  Trusted by 10,000+ students
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl heading-gradient">
                Ace Your Academics with Expert Guidance
              </h1>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Comprehensive online coaching for students in classes 9-12. Live classes, recorded lectures, and downloadable study materials.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link to="/courses">
                    Explore Courses
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/register">
                    Register Now
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1594312915251-48db9280c8f1?q=80&w=600"
                alt="Students learning"
                className="rounded-lg object-cover shadow-xl aspect-video w-full max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {stats.map((stat, i) => (
              <Card key={i} className="stats-card">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-primary">{stat.value}</h2>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight heading-gradient mb-2">
              Why Choose EduCoach?
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              We combine technology with expert teaching to deliver an unmatched learning experience
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            <div className="feature-card">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Classes</h3>
              <p className="text-muted-foreground">
                Attend interactive live sessions with expert teachers and get your doubts cleared in real-time.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Study Materials</h3>
              <p className="text-muted-foreground">
                Access comprehensive notes, practice papers, and sample questions for all subjects and topics.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Recorded Lectures</h3>
              <p className="text-muted-foreground">
                Learn at your own pace with high-quality recorded lectures that you can revisit anytime.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice Tests</h3>
              <p className="text-muted-foreground">
                Evaluate your preparation with regular tests and get detailed performance analytics.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Doubt Resolution</h3>
              <p className="text-muted-foreground">
                Get your queries resolved through dedicated doubt clearing sessions and forums.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey with detailed analytics and progress reports.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Courses */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight heading-gradient">
              Popular Courses
            </h2>
            <Button variant="outline" asChild>
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.slice(0, 4).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight heading-gradient mb-2">
              What Our Students Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Don't just take our word for it - hear from our students
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col h-full justify-between">
                  <div className="mb-4">
                    <svg className="h-6 w-6 text-primary mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-gray-700 dark:text-gray-300">
                      {testimonial.content}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Boost Your Academic Performance?
              </h2>
              <p className="text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of students who have transformed their learning experience with EduCoach.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/register">
                    Get Started Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/courses">
                    Explore Courses
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-1.5 w-12 bg-primary-foreground rounded-full" />
                  <h3 className="text-xl font-semibold">Expert Teachers</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Learn from experienced educators with proven teaching methods
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-12 bg-primary-foreground rounded-full" />
                  <h3 className="text-xl font-semibold">Flexible Learning</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Access courses anytime, anywhere on any device
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-12 bg-primary-foreground rounded-full" />
                  <h3 className="text-xl font-semibold">Interactive Classes</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Engage with teachers and peers in our live sessions
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-12 bg-primary-foreground rounded-full" />
                  <h3 className="text-xl font-semibold">Proven Results</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Our students consistently achieve top grades
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
