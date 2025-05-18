
import React, { createContext, useContext, useState, useEffect } from 'react';
import courseService, { Course, CourseEnrollment } from '@/services/courseService';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/toast';

interface CourseContextType {
  courses: Course[];
  enrolledCourses: CourseEnrollment[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  fetchEnrolledCourses: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<boolean>;
  getCourseById: (id: string) => Course | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch all courses on initial load
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch enrolled courses when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchEnrolledCourses();
    }
  }, [isAuthenticated, user]);

  const fetchCourses = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError(error.message || 'Failed to fetch courses');
      toast({
        title: 'Error',
        description: 'Failed to fetch courses. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrolledCourses = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const data = await courseService.getEnrolledCourses();
      setEnrolledCourses(data);
    } catch (error: any) {
      console.error('Error fetching enrolled courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your enrolled courses.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const enrollment = await courseService.enrollInCourse(courseId);
      
      // Update enrolled courses
      setEnrolledCourses(prev => [...prev, enrollment]);
      
      toast({
        title: 'Enrolled successfully',
        description: 'You have successfully enrolled in this course.',
        variant: 'default',
      });
      return true;
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      toast({
        title: 'Enrollment failed',
        description: error.response?.data?.message || 'Failed to enroll in this course.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseById = (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  };

  return (
    <CourseContext.Provider 
      value={{
        courses,
        enrolledCourses,
        isLoading,
        error,
        fetchCourses,
        fetchEnrolledCourses,
        enrollInCourse,
        getCourseById,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
