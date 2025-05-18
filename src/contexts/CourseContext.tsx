
import React, { createContext, useContext, useState, useEffect } from 'react';
import courseService, { Course, CourseEnrollment } from '@/services/courseService';
import contentService, { Video, PDFDocument, LiveSession } from '@/services/contentService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Re-export the Course type so it can be imported from this file
export type { Course } from '@/services/courseService';

interface CourseContextType {
  courses: Course[];
  enrolledCourses: CourseEnrollment[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  fetchEnrolledCourses: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<boolean>;
  getCourseById: (id: string) => Course | undefined;
  getCourse: (id: string) => Promise<Course | undefined>;
  getCourseVideos: (courseId: string) => Promise<Video[]>;
  getCoursePDFs: (courseId: string) => Promise<PDFDocument[]>;
  getCourseLiveSessions: (courseId: string) => Promise<LiveSession[]>;
  isEnrolled: (courseId: string) => boolean;
  enrollCourse: (courseId: string) => Promise<boolean>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

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

  // Additional methods for CourseDetail page
  const getCourse = async (id: string): Promise<Course | undefined> => {
    try {
      const course = await courseService.getCourseById(id);
      return course;
    } catch (error) {
      console.error(`Error getting course ${id}:`, error);
      return undefined;
    }
  };

  const getCourseVideos = async (courseId: string): Promise<Video[]> => {
    try {
      return await contentService.getVideosForCourse(courseId);
    } catch (error) {
      console.error(`Error getting videos for course ${courseId}:`, error);
      return [];
    }
  };

  const getCoursePDFs = async (courseId: string): Promise<PDFDocument[]> => {
    try {
      return await contentService.getPDFsForCourse(courseId);
    } catch (error) {
      console.error(`Error getting PDFs for course ${courseId}:`, error);
      return [];
    }
  };

  const getCourseLiveSessions = async (courseId: string): Promise<LiveSession[]> => {
    try {
      return await contentService.getLiveSessionsForCourse(courseId);
    } catch (error) {
      console.error(`Error getting live sessions for course ${courseId}:`, error);
      return [];
    }
  };

  const isEnrolled = (courseId: string): boolean => {
    return enrolledCourses.some(enrollment => enrollment.courseId === courseId);
  };

  // Alias for enrollInCourse to match the CourseDetail needs
  const enrollCourse = enrollInCourse;

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
        getCourse,
        getCourseVideos,
        getCoursePDFs,
        getCourseLiveSessions,
        isEnrolled,
        enrollCourse,
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
