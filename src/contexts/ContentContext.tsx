
import React, { createContext, useContext, useState } from 'react';
import contentService, { Video, PDFDocument, LiveSession } from '@/services/contentService';
import { toast } from '@/components/ui/toast';

interface ContentContextType {
  videos: Record<string, Video[]>; // courseId -> videos
  pdfs: Record<string, PDFDocument[]>; // courseId -> pdfs
  liveSessions: Record<string, LiveSession[]>; // courseId -> sessions
  upcomingSessions: LiveSession[];
  isLoading: boolean;
  
  // Videos
  fetchVideosForCourse: (courseId: string) => Promise<Video[]>;
  uploadVideo: (courseId: string, formData: FormData) => Promise<boolean>;
  
  // PDFs
  fetchPDFsForCourse: (courseId: string) => Promise<PDFDocument[]>;
  uploadPDF: (courseId: string, formData: FormData) => Promise<boolean>;
  downloadPDF: (pdfId: string, filename: string) => Promise<void>;
  
  // Live Sessions
  fetchLiveSessionsForCourse: (courseId: string) => Promise<LiveSession[]>;
  fetchUpcomingSessions: () => Promise<LiveSession[]>;
  scheduleLiveSession: (sessionData: Omit<LiveSession, 'id' | 'status'>) => Promise<LiveSession | null>;
  startLiveSession: (sessionId: string) => Promise<{ sessionId: string, roomToken: string } | null>;
  joinLiveSession: (sessionId: string) => Promise<{ sessionId: string, roomToken: string } | null>;
  endLiveSession: (sessionId: string) => Promise<boolean>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Record<string, Video[]>>({});
  const [pdfs, setPdfs] = useState<Record<string, PDFDocument[]>>({});
  const [liveSessions, setLiveSessions] = useState<Record<string, LiveSession[]>>({});
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Videos
  const fetchVideosForCourse = async (courseId: string): Promise<Video[]> => {
    try {
      setIsLoading(true);
      const data = await contentService.getVideosForCourse(courseId);
      setVideos(prev => ({
        ...prev,
        [courseId]: data
      }));
      return data;
    } catch (error: any) {
      console.error(`Error fetching videos for course ${courseId}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to load videos for this course.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const uploadVideo = async (courseId: string, formData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const video = await contentService.uploadVideo(courseId, formData);
      
      // Update videos state
      setVideos(prev => {
        const courseVideos = prev[courseId] || [];
        return {
          ...prev,
          [courseId]: [...courseVideos, video]
        };
      });
      
      toast({
        title: 'Success',
        description: 'Video uploaded successfully.',
        variant: 'default',
      });
      return true;
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'Failed to upload video.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // PDFs
  const fetchPDFsForCourse = async (courseId: string): Promise<PDFDocument[]> => {
    try {
      setIsLoading(true);
      const data = await contentService.getPDFsForCourse(courseId);
      setPdfs(prev => ({
        ...prev,
        [courseId]: data
      }));
      return data;
    } catch (error: any) {
      console.error(`Error fetching PDFs for course ${courseId}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to load PDF materials for this course.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPDF = async (courseId: string, formData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const pdf = await contentService.uploadPDF(courseId, formData);
      
      // Update PDFs state
      setPdfs(prev => {
        const coursePdfs = prev[courseId] || [];
        return {
          ...prev,
          [courseId]: [...coursePdfs, pdf]
        };
      });
      
      toast({
        title: 'Success',
        description: 'PDF uploaded successfully.',
        variant: 'default',
      });
      return true;
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'Failed to upload PDF.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async (pdfId: string, filename: string): Promise<void> => {
    try {
      setIsLoading(true);
      const blob = await contentService.downloadPDF(pdfId);
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Download started',
        description: `Downloading ${filename}...`,
        variant: 'default',
      });
    } catch (error: any) {
      console.error(`Error downloading PDF ${pdfId}:`, error);
      toast({
        title: 'Download failed',
        description: 'Failed to download the PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Live Sessions
  const fetchLiveSessionsForCourse = async (courseId: string): Promise<LiveSession[]> => {
    try {
      setIsLoading(true);
      const data = await contentService.getLiveSessionsForCourse(courseId);
      setLiveSessions(prev => ({
        ...prev,
        [courseId]: data
      }));
      return data;
    } catch (error: any) {
      console.error(`Error fetching live sessions for course ${courseId}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to load live sessions for this course.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcomingSessions = async (): Promise<LiveSession[]> => {
    try {
      setIsLoading(true);
      const data = await contentService.getAllUpcomingSessions();
      setUpcomingSessions(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching upcoming sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load upcoming live sessions.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleLiveSession = async (sessionData: Omit<LiveSession, 'id' | 'status'>): Promise<LiveSession | null> => {
    try {
      setIsLoading(true);
      const session = await contentService.scheduleLiveSession(sessionData);
      
      // Update liveSessions state
      setLiveSessions(prev => {
        const courseSessions = prev[session.courseId] || [];
        return {
          ...prev,
          [session.courseId]: [...courseSessions, session]
        };
      });
      
      // Update upcoming sessions if applicable
      if (new Date(session.date) > new Date()) {
        setUpcomingSessions(prev => [...prev, session]);
      }
      
      toast({
        title: 'Success',
        description: 'Live session scheduled successfully.',
        variant: 'default',
      });
      return session;
    } catch (error: any) {
      console.error('Error scheduling live session:', error);
      toast({
        title: 'Scheduling failed',
        description: error.response?.data?.message || 'Failed to schedule live session.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const startLiveSession = async (sessionId: string): Promise<{ sessionId: string, roomToken: string } | null> => {
    try {
      setIsLoading(true);
      const data = await contentService.startLiveSession(sessionId);
      
      // Update session status in state
      setLiveSessions(prev => {
        const updatedSessions: Record<string, LiveSession[]> = {};
        
        Object.keys(prev).forEach(courseId => {
          updatedSessions[courseId] = prev[courseId].map(session => {
            if (session.id === sessionId) {
              return { ...session, status: 'live' };
            }
            return session;
          });
        });
        
        return updatedSessions;
      });
      
      toast({
        title: 'Live session started',
        description: 'Your live session has been started successfully.',
        variant: 'default',
      });
      return data;
    } catch (error: any) {
      console.error(`Error starting live session ${sessionId}:`, error);
      toast({
        title: 'Failed to start session',
        description: error.response?.data?.message || 'Could not start the live session.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const joinLiveSession = async (sessionId: string): Promise<{ sessionId: string, roomToken: string } | null> => {
    try {
      setIsLoading(true);
      const data = await contentService.joinLiveSession(sessionId);
      toast({
        title: 'Joining live session',
        description: 'Connecting to the live session...',
        variant: 'default',
      });
      return data;
    } catch (error: any) {
      console.error(`Error joining live session ${sessionId}:`, error);
      toast({
        title: 'Failed to join session',
        description: error.response?.data?.message || 'Could not join the live session.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const endLiveSession = async (sessionId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await contentService.endLiveSession(sessionId);
      
      // Update session status in state
      setLiveSessions(prev => {
        const updatedSessions: Record<string, LiveSession[]> = {};
        
        Object.keys(prev).forEach(courseId => {
          updatedSessions[courseId] = prev[courseId].map(session => {
            if (session.id === sessionId) {
              return { ...session, status: 'completed' };
            }
            return session;
          });
        });
        
        return updatedSessions;
      });
      
      // Remove from upcoming sessions if it was there
      setUpcomingSessions(prev => 
        prev.filter(session => session.id !== sessionId)
      );
      
      toast({
        title: 'Live session ended',
        description: 'The live session has been ended successfully.',
        variant: 'default',
      });
      return true;
    } catch (error: any) {
      console.error(`Error ending live session ${sessionId}:`, error);
      toast({
        title: 'Failed to end session',
        description: error.response?.data?.message || 'Could not end the live session.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentContext.Provider
      value={{
        videos,
        pdfs,
        liveSessions,
        upcomingSessions,
        isLoading,
        fetchVideosForCourse,
        uploadVideo,
        fetchPDFsForCourse,
        uploadPDF,
        downloadPDF,
        fetchLiveSessionsForCourse,
        fetchUpcomingSessions,
        scheduleLiveSession,
        startLiveSession,
        joinLiveSession,
        endLiveSession,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
