
import api from './api';

export interface Video {
  id: string;
  title: string;
  description: string;
  courseId: string;
  duration: number; // in seconds
  thumbnail: string;
  url: string;
  createdAt: string;
  viewCount: number;
  isPublished: boolean;
}

export interface PDFDocument {
  id: string;
  title: string;
  description: string;
  courseId: string;
  url: string;
  createdAt: string;
  downloadCount: number;
  isPublished: boolean;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle: string;
  tutorId: string;
  date: string;
  duration: number; // in minutes
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  studentsEnrolled: number;
  recordingUrl?: string;
}

const contentService = {
  // Videos
  getVideosForCourse: async (courseId: string): Promise<Video[]> => {
    try {
      const response = await api.get(`/courses/${courseId}/videos`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching videos for course ${courseId}:`, error);
      throw error;
    }
  },
  
  getVideoById: async (videoId: string): Promise<Video> => {
    try {
      const response = await api.get(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching video ${videoId}:`, error);
      throw error;
    }
  },
  
  uploadVideo: async (courseId: string, formData: FormData): Promise<Video> => {
    try {
      const response = await api.post(`/courses/${courseId}/videos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },
  
  // PDFs
  getPDFsForCourse: async (courseId: string): Promise<PDFDocument[]> => {
    try {
      const response = await api.get(`/courses/${courseId}/pdfs`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching PDFs for course ${courseId}:`, error);
      throw error;
    }
  },
  
  uploadPDF: async (courseId: string, formData: FormData): Promise<PDFDocument> => {
    try {
      const response = await api.post(`/courses/${courseId}/pdfs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  },
  
  downloadPDF: async (pdfId: string): Promise<Blob> => {
    try {
      const response = await api.get(`/pdfs/${pdfId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading PDF ${pdfId}:`, error);
      throw error;
    }
  },
  
  // Live Sessions
  getLiveSessionsForCourse: async (courseId: string): Promise<LiveSession[]> => {
    try {
      const response = await api.get(`/courses/${courseId}/live-sessions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching live sessions for course ${courseId}:`, error);
      throw error;
    }
  },
  
  getAllUpcomingSessions: async (): Promise<LiveSession[]> => {
    try {
      const response = await api.get('/live-sessions/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      throw error;
    }
  },
  
  scheduleLiveSession: async (sessionData: Omit<LiveSession, 'id' | 'status'>): Promise<LiveSession> => {
    try {
      const response = await api.post('/live-sessions', sessionData);
      return response.data;
    } catch (error) {
      console.error('Error scheduling live session:', error);
      throw error;
    }
  },
  
  startLiveSession: async (sessionId: string): Promise<{ sessionId: string, roomToken: string }> => {
    try {
      const response = await api.post(`/live-sessions/${sessionId}/start`);
      return response.data;
    } catch (error) {
      console.error(`Error starting live session ${sessionId}:`, error);
      throw error;
    }
  },
  
  joinLiveSession: async (sessionId: string): Promise<{ sessionId: string, roomToken: string }> => {
    try {
      const response = await api.post(`/live-sessions/${sessionId}/join`);
      return response.data;
    } catch (error) {
      console.error(`Error joining live session ${sessionId}:`, error);
      throw error;
    }
  },
  
  endLiveSession: async (sessionId: string): Promise<void> => {
    try {
      await api.post(`/live-sessions/${sessionId}/end`);
    } catch (error) {
      console.error(`Error ending live session ${sessionId}:`, error);
      throw error;
    }
  }
};

export default contentService;
