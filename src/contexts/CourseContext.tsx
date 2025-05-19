
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Types for database entities
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  subject: string;
  class_grade: string | null;
  price: number;
  duration: string;
  tutor_id: string;
  is_published: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  instructor?: {
    name: string;
    profileImage?: string;
  };
  rating?: number;
  enrolledStudentCount?: number;
}

export interface Enrollment {
  id: string;
  course_id: string;
  user_id: string;
  progress: number;
  status: 'active' | 'completed' | 'cancelled';
  enrollment_date: string;
  completion_date: string | null;
}

export interface Video {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  duration: number;
  thumbnail: string | null;
  video_url: string;
  position: number;
  is_published: boolean;
  created_at: string;
}

export interface PDF {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_size: string;
  position: number;
  is_published: boolean;
  created_at: string;
}

export interface LiveSession {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  start_time: string;
  duration: number;
  tutor_id: string;
  room_id: string | null;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  recording_url: string | null;
  created_at: string;
}

interface CourseContextType {
  courses: Course[];
  enrolledCourses: Course[];
  enrollments: Enrollment[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  fetchEnrolledCourses: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<boolean>;
  getCourseById: (id: string) => Promise<Course | null>;
  getCourseVideos: (courseId: string) => Promise<Video[]>;
  getCoursePDFs: (courseId: string) => Promise<PDF[]>;
  getCourseLiveSessions: (courseId: string) => Promise<LiveSession[]>;
  isEnrolled: (courseId: string) => boolean;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
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
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:tutor_id (
            full_name,
            avatar_url
          )
        `)
        .eq('is_published', true)
        .eq('is_approved', true);
      
      if (error) throw error;
      
      // Transform data to match Course interface with instructor data
      const formattedCourses = data.map(course => ({
        ...course,
        instructor: {
          name: course.profiles?.full_name || 'Unknown Instructor',
          profileImage: course.profiles?.avatar_url || undefined
        },
        rating: 4.5, // Placeholder for now, will implement actual ratings later
        enrolledStudentCount: 10 // Placeholder, will implement actual count later
      }));
      
      setCourses(formattedCourses);
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
    if (!isAuthenticated || !user) return;
    
    try {
      setIsLoading(true);
      
      // Get enrollments for current user
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id);
      
      if (enrollmentError) throw enrollmentError;
      setEnrollments(enrollmentData);
      
      if (enrollmentData.length === 0) {
        setEnrolledCourses([]);
        return;
      }
      
      // Get courses for these enrollments
      const courseIds = enrollmentData.map(e => e.course_id);
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:tutor_id (
            full_name,
            avatar_url
          )
        `)
        .in('id', courseIds);
      
      if (coursesError) throw coursesError;
      
      // Format courses
      const formattedCourses = coursesData.map(course => ({
        ...course,
        instructor: {
          name: course.profiles?.full_name || 'Unknown Instructor',
          profileImage: course.profiles?.avatar_url || undefined
        },
        rating: 4.5, // Placeholder
        enrolledStudentCount: 10 // Placeholder
      }));
      
      setEnrolledCourses(formattedCourses);
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
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to enroll in courses.',
        variant: 'destructive',
      });
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingEnrollment) {
        toast({
          title: 'Already Enrolled',
          description: 'You are already enrolled in this course.',
        });
        return true;
      }
      
      // Create enrollment
      const { error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          progress: 0,
          status: 'active'
        });
      
      if (error) throw error;
      
      toast({
        title: 'Enrolled successfully',
        description: 'You have successfully enrolled in this course.',
      });
      
      // Refresh enrolled courses
      await fetchEnrolledCourses();
      
      return true;
    } catch (error: any) {
      console.error('Error enrolling in course:', error);
      toast({
        title: 'Enrollment failed',
        description: error.message || 'Failed to enroll in this course.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseById = async (id: string): Promise<Course | null> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:tutor_id (
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        instructor: {
          name: data.profiles?.full_name || 'Unknown Instructor',
          profileImage: data.profiles?.avatar_url || undefined
        },
        rating: 4.5, // Placeholder
        enrolledStudentCount: 10 // Placeholder
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      return null;
    }
  };

  const getCourseVideos = async (courseId: string): Promise<Video[]> => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('course_id', courseId)
        .order('position', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error getting videos for course ${courseId}:`, error);
      return [];
    }
  };

  const getCoursePDFs = async (courseId: string): Promise<PDF[]> => {
    try {
      const { data, error } = await supabase
        .from('pdfs')
        .select('*')
        .eq('course_id', courseId)
        .order('position', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error getting PDFs for course ${courseId}:`, error);
      return [];
    }
  };

  const getCourseLiveSessions = async (courseId: string): Promise<LiveSession[]> => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('course_id', courseId)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error(`Error getting live sessions for course ${courseId}:`, error);
      return [];
    }
  };

  const isEnrolled = (courseId: string): boolean => {
    return enrollments.some(enrollment => enrollment.course_id === courseId);
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        enrolledCourses,
        enrollments,
        isLoading,
        error,
        fetchCourses,
        fetchEnrolledCourses,
        enrollInCourse,
        getCourseById,
        getCourseVideos,
        getCoursePDFs,
        getCourseLiveSessions,
        isEnrolled,
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
