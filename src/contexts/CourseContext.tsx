
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
  getCourse: (id: string) => Course | undefined;
  getCourseVideos: (courseId: string) => Video[];
  getCoursePDFs: (courseId: string) => PDFDocument[];
  getCourseLiveSessions: (courseId: string) => LiveSession[];
  isEnrolled: (courseId: string) => boolean;
  enrollCourse: (courseId: string) => Promise<boolean>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>([]);
  const [videos, setVideos] = useState<Record<string, Video[]>>({});
  const [pdfs, setPdfs] = useState<Record<string, PDFDocument[]>>({});
  const [liveSessions, setLiveSessions] = useState<Record<string, LiveSession[]>>({});
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

  // Modified to return actual course data, not a Promise
  const getCourse = (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  };

  // Modified to fetch video data and store it in state
  const getCourseVideos = (courseId: string): Video[] => {
    if (!videos[courseId]) {
      // Fetch videos if not already in state
      contentService.getVideosForCourse(courseId).then(data => {
        setVideos(prev => ({ ...prev, [courseId]: data }));
      }).catch(error => {
        console.error(`Error getting videos for course ${courseId}:`, error);
      });
      return [];
    }
    return videos[courseId];
  };

  // Modified to fetch PDF data and store it in state
  const getCoursePDFs = (courseId: string): PDFDocument[] => {
    if (!pdfs[courseId]) {
      // Fetch PDFs if not already in state
      contentService.getPDFsForCourse(courseId).then(data => {
        setPdfs(prev => ({ ...prev, [courseId]: data }));
      }).catch(error => {
        console.error(`Error getting PDFs for course ${courseId}:`, error);
      });
      return [];
    }
    return pdfs[courseId];
  };

  // Modified to fetch live sessions data and store it in state
  const getCourseLiveSessions = (courseId: string): LiveSession[] => {
    if (!liveSessions[courseId]) {
      // Fetch live sessions if not already in state
      contentService.getLiveSessionsForCourse(courseId).then(data => {
        setLiveSessions(prev => ({ ...prev, [courseId]: data }));
      }).catch(error => {
        console.error(`Error getting live sessions for course ${courseId}:`, error);
      });
      return [];
    }
    return liveSessions[courseId];
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
