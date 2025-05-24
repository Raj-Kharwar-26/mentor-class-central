
import React, { useEffect } from 'react';
import { useCourses } from '@/contexts/CourseContext';
import CourseCard from '@/components/CourseCard';
import DemoAccessButton from '@/components/DemoAccessButton';

const CoursesPage: React.FC = () => {
  const { courses, isLoading, error, fetchCourses } = useCourses();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Courses</h2>
        <p className="mb-4">{error}</p>
        <button 
          onClick={fetchCourses}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Courses</h1>
      </div>

      {/* Demo Access Section */}
      <div className="mb-8">
        <DemoAccessButton />
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Courses Available</h2>
          <p className="text-muted-foreground">Check back later for new courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
