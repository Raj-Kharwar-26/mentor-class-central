
import { supabase } from '@/integrations/supabase/client';

export interface LiveStreamSession {
  id: string;
  courseId: string;
  tutorId: string;
  title: string;
  description: string;
  startTime: string;
  duration: number;
  status: 'scheduled' | 'live' | 'ended' | 'recording';
  roomId?: string;
  recordingUrl?: string;
  participantCount: number;
}

export interface StreamParticipant {
  id: string;
  userId: string;
  userName: string;
  role: 'tutor' | 'student';
  isHandRaised: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  joinedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'system' | 'hand_raise';
}

class LiveStreamService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStreams: Map<string, MediaStream> = new Map();
  private dataChannel: RTCDataChannel | null = null;
  private isScreenSharing = false;

  // WebRTC Configuration
  private rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  async initializeStream(sessionId: string, isHost: boolean = false): Promise<boolean> {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Create peer connection
      this.peerConnection = new RTCPeerConnection(this.rtcConfig);

      // Add local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        if (this.peerConnection && this.localStream) {
          this.peerConnection.addTrack(track, this.localStream);
        }
      });

      // Set up data channel for chat
      if (isHost) {
        this.dataChannel = this.peerConnection.createDataChannel('chat', {
          ordered: true
        });
        this.setupDataChannelHandlers();
      } else {
        this.peerConnection.ondatachannel = (event) => {
          this.dataChannel = event.channel;
          this.setupDataChannelHandlers();
        };
      }

      // Handle remote streams
      this.peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        const senderId = event.transceiver.sender.track?.id || 'unknown';
        this.remoteStreams.set(senderId, remoteStream);
        this.onRemoteStreamAdded?.(senderId, remoteStream);
      };

      // Handle ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.onIceCandidateGenerated?.(event.candidate);
        }
      };

      return true;
    } catch (error) {
      console.error('Error initializing stream:', error);
      return false;
    }
  }

  private setupDataChannelHandlers() {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };

    this.dataChannel.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.onChatMessage?.(data);
    };
  }

  async startScreenShare(): Promise<boolean> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          cursor: 'always',
          frameRate: { ideal: 30 }
        },
        audio: true
      });

      if (this.peerConnection && this.localStream) {
        // Replace video track with screen share
        const videoSender = this.peerConnection.getSenders().find(
          sender => sender.track && sender.track.kind === 'video'
        );

        if (videoSender) {
          await videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
        }

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          this.stopScreenShare();
        };

        this.isScreenSharing = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error starting screen share:', error);
      return false;
    }
  }

  async stopScreenShare(): Promise<boolean> {
    try {
      if (this.peerConnection && this.localStream) {
        // Replace screen share with camera
        const videoSender = this.peerConnection.getSenders().find(
          sender => sender.track && sender.track.kind === 'video'
        );

        if (videoSender && this.localStream.getVideoTracks()[0]) {
          await videoSender.replaceTrack(this.localStream.getVideoTracks()[0]);
        }

        this.isScreenSharing = false;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error stopping screen share:', error);
      return false;
    }
  }

  sendChatMessage(message: string, sessionId: string) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      const chatMessage = {
        type: 'chat',
        message,
        sessionId,
        timestamp: new Date().toISOString()
      };
      this.dataChannel.send(JSON.stringify(chatMessage));
    }
  }

  raiseHand(sessionId: string) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      const handRaise = {
        type: 'hand_raise',
        sessionId,
        timestamp: new Date().toISOString()
      };
      this.dataChannel.send(JSON.stringify(handRaise));
    }
  }

  toggleMute(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled;
      }
    }
    return false;
  }

  toggleVideo(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return !videoTrack.enabled;
      }
    }
    return false;
  }

  async startRecording(sessionId: string): Promise<boolean> {
    try {
      if (!this.localStream) return false;

      const mediaRecorder = new MediaRecorder(this.localStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        await this.uploadRecording(sessionId, blob);
      };

      mediaRecorder.start(1000); // Collect data every second
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  private async uploadRecording(sessionId: string, blob: Blob) {
    try {
      const fileName = `recording-${sessionId}-${Date.now()}.webm`;
      
      const { data, error } = await supabase.storage
        .from('recordings')
        .upload(fileName, blob);

      if (error) throw error;

      // Update session with recording URL
      await supabase
        .from('live_sessions')
        .update({ 
          recording_url: data.path,
          status: 'ended'
        })
        .eq('id', sessionId);

    } catch (error) {
      console.error('Error uploading recording:', error);
    }
  }

  disconnect() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    this.remoteStreams.clear();
    this.isScreenSharing = false;
  }

  // API methods for live sessions
  async createLiveSession(sessionData: Omit<LiveStreamSession, 'id' | 'status' | 'participantCount'>): Promise<LiveStreamSession | null> {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .insert({
          course_id: sessionData.courseId,
          tutor_id: sessionData.tutorId,
          title: sessionData.title,
          description: sessionData.description,
          start_time: sessionData.startTime,
          duration: sessionData.duration,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        courseId: data.course_id,
        tutorId: data.tutor_id,
        title: data.title,
        description: data.description,
        startTime: data.start_time,
        duration: data.duration,
        status: data.status,
        roomId: data.room_id,
        recordingUrl: data.recording_url,
        participantCount: 0
      };
    } catch (error) {
      console.error('Error creating live session:', error);
      return null;
    }
  }

  async joinLiveSession(sessionId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error || !data) return false;

      // Initialize streaming for this session
      return await this.initializeStream(sessionId, false);
    } catch (error) {
      console.error('Error joining live session:', error);
      return false;
    }
  }

  async getLiveSessions(courseId?: string): Promise<LiveStreamSession[]> {
    try {
      let query = supabase
        .from('live_sessions')
        .select('*')
        .order('start_time', { ascending: true });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(session => ({
        id: session.id,
        courseId: session.course_id,
        tutorId: session.tutor_id,
        title: session.title,
        description: session.description,
        startTime: session.start_time,
        duration: session.duration,
        status: session.status,
        roomId: session.room_id,
        recordingUrl: session.recording_url,
        participantCount: 0 // This would come from real-time participant tracking
      }));
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      return [];
    }
  }

  // Event handlers (to be overridden by components)
  onRemoteStreamAdded?: (participantId: string, stream: MediaStream) => void;
  onIceCandidateGenerated?: (candidate: RTCIceCandidate) => void;
  onChatMessage?: (message: any) => void;
}

export const liveStreamService = new LiveStreamService();
export default liveStreamService;
