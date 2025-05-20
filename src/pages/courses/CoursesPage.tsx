
import React, { useState, useEffect } from 'react';
import { useCourses, Course } from '@/contexts/CourseContext';
import CourseCard from '@/components/CourseCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, X } from 'lucide-react';

const CoursesPage: React.FC = () => {
  const { courses, isLoading } = useCourses();
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique subjects and grades from courses
  const subjects = Array.from(new Set(courses.map(course => course.subject)));
  const grades = Array.from(new Set(courses.filter(course => course.class_grade).map(course => course.class_grade as string)));

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedSubject, selectedGrade, priceRange, courses]);

  const applyFilters = () => {
    let filtered = [...courses];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(term) || 
        course.description.toLowerCase().includes(term)
      );
    }

    // Apply subject filter
    if (selectedSubject) {
      filtered = filtered.filter(course => course.subject === selectedSubject);
    }

    // Apply grade filter
    if (selectedGrade) {
      filtered = filtered.filter(course => course.class_grade === selectedGrade);
    }

    // Apply price range filter
    filtered = filtered.filter(course => 
      course.price >= priceRange[0] && course.price <= priceRange[1]
    );

    setFilteredCourses(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedGrade('');
    setPriceRange([0, 10000]);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
        <p className="text-muted-foreground">
          Discover top-quality courses from expert instructors
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - For mobile view as a toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex justify-between"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </div>
            {showFilters ? <X className="h-4 w-4" /> : null}
          </Button>
        </div>

        {/* Filters panel - conditionally visible on mobile */}
        <div className={`lg:w-1/4 xl:w-1/5 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-card border rounded-lg p-4 shadow-sm sticky top-24">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">Filters</h2>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-sm">
                  Reset
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Subject filter */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grade filter */}
              <div className="space-y-2">
                <Label htmlFor="grade">Class Grade</Label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Grades</SelectItem>
                    {grades.map(grade => (
                      <SelectItem key={grade} value={grade}>
                        Class {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price range filter */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Price Range</Label>
                  <div className="pt-5 px-2">
                    <Slider
                      defaultValue={[0, 10000]}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course grid */}
        <div className="lg:w-3/4 xl:w-4/5">
          {isLoading ? (
            // Loading state
            <div className="flex justify-center items-center h-60">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-muted-foreground">Loading courses...</p>
              </div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </>
          ) : (
            // No results
            <div className="flex flex-col items-center justify-center h-60 text-center">
              <div className="mb-4 bg-muted/50 p-3 rounded-full">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search term.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
