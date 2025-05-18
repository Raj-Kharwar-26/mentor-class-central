import api from './api';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subject: string;
  classGrade: string;
  instructor: {
    id: string;
    name: string;
    profileImage?: string;
  };
  price: number;
  duration: string;
  enrolledStudentCount: number;
  rating: number;
  contentCount: {
    videos: number;
    pdfs: number;
    liveClasses: number;
  };
  updatedAt: string;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
}

const courseService = {
  getAllCourses: async (): Promise<Course[]> => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },
  
  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },
  
  getEnrolledCourses: async (): Promise<CourseEnrollment[]> => {
    try {
      const response = await api.get('/courses/enrolled');
      return response.data;
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      throw error;
    }
  },
  
  enrollInCourse: async (courseId: string): Promise<CourseEnrollment> => {
    try {
      const response = await api.post('/courses/enroll', { courseId });
      return response.data;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  },
  
  updateCourseProgress: async (courseId: string, progress: number): Promise<void> => {
    try {
      await api.put(`/courses/${courseId}/progress`, { progress });
    } catch (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  },
  
  // For tutors/admins
  createCourse: async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },
  
  updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw error;
    }
  },
  
  deleteCourse: async (id: string): Promise<void> => {
    try {
      await api.delete(`/courses/${id}`);
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw error;
    }
  }
};

export default courseService;
