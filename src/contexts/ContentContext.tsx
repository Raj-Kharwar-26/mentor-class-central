
import React, { createContext, useContext, useState } from 'react';
import contentService, { Video, PDFDocument, LiveSession } from '@/services/contentService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ContentContextType {
  videos: Video[];
  pdfs: PDFDocument[];
  liveSessions: LiveSession[];
  isLoading: boolean;
  fetchCourseContent: (courseId: string) => Promise<void>;
  uploadVideo: (courseId: string, formData: FormData) => Promise<boolean>;
  uploadPDF: (courseId: string, formData: FormData) => Promise<boolean>;
  scheduleLiveSession: (sessionData: Omit<LiveSession, 'id' | 'status'>) => Promise<boolean>;
  startLiveSession: (sessionId: string) => Promise<{ sessionId: string, roomToken: string } | null>;
  joinLiveSession: (sessionId: string) => Promise<{ sessionId: string, roomToken: string } | null>;
  downloadPDF: (pdfId: string) => Promise<Blob | null>;
  fetchUpcomingSessions: () => Promise<LiveSession[]>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [pdfs, setPdfs] = useState<PDFDocument[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCourseContent = async (courseId: string) => {
    try {
      setIsLoading(true);
      const [videosData, pdfsData, liveSessionsData] = await Promise.all([
        contentService.getVideosForCourse(courseId),
        contentService.getPDFsForCourse(courseId),
        contentService.getLiveSessionsForCourse(courseId)
      ]);

      setVideos(videosData);
      setPdfs(pdfsData);
      setLiveSessions(liveSessionsData);
    } catch (error: any) {
      console.error('Error fetching course content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load course content.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadVideo = async (courseId: string, formData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const newVideo = await contentService.uploadVideo(courseId, formData);
      setVideos(prev => [...prev, newVideo]);
      toast({
        title: 'Video uploaded',
        description: 'Your video has been successfully uploaded.',
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

  const uploadPDF = async (courseId: string, formData: FormData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const newPDF = await contentService.uploadPDF(courseId, formData);
      setPdfs(prev => [...prev, newPDF]);
      toast({
        title: 'PDF uploaded',
        description: 'Your PDF has been successfully uploaded.',
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

  const scheduleLiveSession = async (sessionData: Omit<LiveSession, 'id' | 'status'>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const newSession = await contentService.scheduleLiveSession(sessionData);
      setLiveSessions(prev => [...prev, newSession]);
      toast({
        title: 'Session scheduled',
        description: 'Your live session has been successfully scheduled.',
      });
      return true;
    } catch (error: any) {
      console.error('Error scheduling live session:', error);
      toast({
        title: 'Scheduling failed',
        description: error.response?.data?.message || 'Failed to schedule live session.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const startLiveSession = async (sessionId: string): Promise<{ sessionId: string, roomToken: string } | null> => {
    try {
      setIsLoading(true);
      const data = await contentService.startLiveSession(sessionId);
      
      // Update live session status
      setLiveSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, status: 'live' as const } : session
      ));
      
      toast({
        title: 'Live session started',
        description: 'Your live session has started successfully.',
      });
      return data;
    } catch (error: any) {
      console.error('Error starting live session:', error);
      toast({
        title: 'Failed to start session',
        description: error.response?.data?.message || 'Could not start live session.',
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
      });
      return data;
    } catch (error: any) {
      console.error('Error joining live session:', error);
      toast({
        title: 'Failed to join session',
        description: error.response?.data?.message || 'Could not join live session.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async (pdfId: string): Promise<Blob | null> => {
    try {
      setIsLoading(true);
      const blob = await contentService.downloadPDF(pdfId);
      return blob;
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Download failed',
        description: 'Could not download the PDF file.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcomingSessions = async (): Promise<LiveSession[]> => {
    try {
      setIsLoading(true);
      const sessions = await contentService.getAllUpcomingSessions();
      return sessions;
    } catch (error: any) {
      console.error('Error fetching upcoming sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load upcoming sessions.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContentContext.Provider value={{
      videos,
      pdfs,
      liveSessions,
      isLoading,
      fetchCourseContent,
      uploadVideo,
      uploadPDF,
      scheduleLiveSession,
      startLiveSession,
      joinLiveSession,
      downloadPDF,
      fetchUpcomingSessions,
    }}>
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
