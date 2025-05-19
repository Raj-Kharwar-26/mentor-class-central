import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { useCourses } from '@/contexts/CourseContext';
const CoursesPage: React.FC = () => {
  const {
    courses
  } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' ? true : course.classGrade === selectedClass;
    const matchesSubject = selectedSubject === 'all' ? true : course.subject === selectedSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });
  return <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Banner */}
      <div className="bg-primary/10 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl heading-gradient">
              Explore Our Courses
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-0 px-px">
              Discover comprehensive learning modules designed specifically for students in classes 9-12
            </p>
          </div>
        </div>
      </div>
      
      {/* Filter Section */}
      <section className="py-8 border-b">
        <div className="container px-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-3 md:gap-8">
            <div>
              <Input placeholder="Search courses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" />
            </div>
            
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Class/Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="9">Class 9</SelectItem>
                <SelectItem value="10">Class 10</SelectItem>
                <SelectItem value="11">Class 11</SelectItem>
                <SelectItem value="12">Class 12</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      
      {/* Courses Grid */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          {filteredCourses.length > 0 ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map(course => <CourseCard key={course.id} course={course} />)}
            </div> : <div className="text-center py-20">
              <h3 className="text-lg font-semibold">No courses found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search query.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => {
            setSearchQuery('');
            setSelectedClass('all');
            setSelectedSubject('all');
          }}>
                Clear filters
              </Button>
            </div>}
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default CoursesPage;