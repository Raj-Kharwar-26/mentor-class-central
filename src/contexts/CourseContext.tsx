
import React, { createContext, useState, useContext } from 'react';

// Define types for subjects
type SubjectType = 'mathematics' | 'physics' | 'chemistry' | 'biology';

// Define types for classes (grades)
type ClassGrade = '9' | '10' | '11' | '12';

// Define course content type
export type ContentType = 'video' | 'pdf' | 'live';

// Define course interface
export interface Course {
  id: string;
  title: string;
  description: string;
  subject: SubjectType;
  classGrade: ClassGrade;
  thumbnail: string;
  price: number;
  instructor: {
    id: string;
    name: string;
    profileImage?: string;
  };
  contentCount: {
    videos: number;
    pdfs: number;
    liveClasses: number;
  };
  enrolledStudentCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Define video lecture interface
export interface VideoLecture {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  createdAt: string;
}

// Define PDF material interface
export interface PDFMaterial {
  id: string;
  courseId: string;
  title: string;
  description: string;
  fileSize: string;
  fileUrl: string;
  createdAt: string;
}

// Define live session interface
export interface LiveSession {
  id: string;
  courseId: string;
  title: string;
  description: string;
  startTime: string;
  duration: number;
  status: 'scheduled' | 'live' | 'completed';
  meetingUrl?: string;
}

// Define enrolled course interface with access status
export interface EnrolledCourse {
  courseId: string;
  enrolledAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'pending';
}

// Define course context type
interface CourseContextType {
  courses: Course[];
  enrolledCourses: EnrolledCourse[];
  videoLectures: VideoLecture[];
  pdfMaterials: PDFMaterial[];
  liveSessions: LiveSession[];
  getCourse: (id: string) => Course | undefined;
  getCourseVideos: (courseId: string) => VideoLecture[];
  getCoursePDFs: (courseId: string) => PDFMaterial[];
  getCourseLiveSessions: (courseId: string) => LiveSession[];
  isEnrolled: (courseId: string) => boolean;
  enrollCourse: (courseId: string) => void;
}

// Create context with default values
const CourseContext = createContext<CourseContextType>({
  courses: [],
  enrolledCourses: [],
  videoLectures: [],
  pdfMaterials: [],
  liveSessions: [],
  getCourse: () => undefined,
  getCourseVideos: () => [],
  getCoursePDFs: () => [],
  getCourseLiveSessions: () => [],
  isEnrolled: () => false,
  enrollCourse: () => {},
});

// Generate mock data for our demonstration
const generateMockCourses = (): Course[] => [
  {
    id: '1',
    title: 'Complete Physics Course for Class 12',
    description: 'Master all Physics concepts for Class 12 board exams and competitive exams like JEE, NEET.',
    subject: 'physics',
    classGrade: '12',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=500',
    price: 5999,
    instructor: {
      id: '101',
      name: 'Dr. Rajiv Kumar',
      profileImage: 'https://i.pravatar.cc/150?u=rajiv',
    },
    contentCount: {
      videos: 45,
      pdfs: 18,
      liveClasses: 8,
    },
    enrolledStudentCount: 1287,
    rating: 4.8,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-05-20T14:30:00Z',
  },
  {
    id: '2',
    title: 'Mathematics Foundation for Class 10',
    description: 'Build a strong foundation in Mathematics for Class 10 board exams and beyond.',
    subject: 'mathematics',
    classGrade: '10',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500',
    price: 3999,
    instructor: {
      id: '102',
      name: 'Priya Sharma',
      profileImage: 'https://i.pravatar.cc/150?u=priya',
    },
    contentCount: {
      videos: 35,
      pdfs: 15,
      liveClasses: 6,
    },
    enrolledStudentCount: 1560,
    rating: 4.7,
    createdAt: '2023-02-10T09:00:00Z',
    updatedAt: '2023-06-15T11:45:00Z',
  },
  {
    id: '3',
    title: 'Organic Chemistry Mastery for Class 11',
    description: 'Comprehensive coverage of Organic Chemistry for Class 11 students preparing for board and competitive exams.',
    subject: 'chemistry',
    classGrade: '11',
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=500',
    price: 4999,
    instructor: {
      id: '103',
      name: 'Dr. Anand Verma',
      profileImage: 'https://i.pravatar.cc/150?u=anand',
    },
    contentCount: {
      videos: 40,
      pdfs: 20,
      liveClasses: 7,
    },
    enrolledStudentCount: 980,
    rating: 4.9,
    createdAt: '2023-03-05T08:30:00Z',
    updatedAt: '2023-07-10T13:15:00Z',
  },
  {
    id: '4',
    title: 'Biology Complete Course for Class 9',
    description: 'A comprehensive course covering all aspects of Biology syllabus for Class 9 students.',
    subject: 'biology',
    classGrade: '9',
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=500',
    price: 3499,
    instructor: {
      id: '104',
      name: 'Dr. Meera Patel',
      profileImage: 'https://i.pravatar.cc/150?u=meera',
    },
    contentCount: {
      videos: 30,
      pdfs: 12,
      liveClasses: 5,
    },
    enrolledStudentCount: 875,
    rating: 4.6,
    createdAt: '2023-04-20T11:00:00Z',
    updatedAt: '2023-08-05T09:30:00Z',
  },
];

// Generate mock video lectures
const generateMockVideos = (): VideoLecture[] => [
  {
    id: 'vid1',
    courseId: '1',
    title: 'Introduction to Mechanics',
    description: 'Fundamental concepts of mechanics for Class 12 Physics',
    duration: 2820, // 47 minutes
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=500',
    videoUrl: 'https://example.com/videos/physics-mechanics',
    createdAt: '2023-01-20T10:00:00Z',
  },
  {
    id: 'vid2',
    courseId: '1',
    title: 'Wave Optics Part 1',
    description: 'Understanding the wave nature of light',
    duration: 3540, // 59 minutes
    thumbnail: 'https://images.unsplash.com/photo-1608408843596-b3119736057c?q=80&w=500',
    videoUrl: 'https://example.com/videos/physics-waves',
    createdAt: '2023-01-25T10:00:00Z',
  },
  {
    id: 'vid3',
    courseId: '2',
    title: 'Trigonometric Functions',
    description: 'Understanding sine, cosine and other trigonometric functions',
    duration: 3120, // 52 minutes
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500',
    videoUrl: 'https://example.com/videos/math-trigonometry',
    createdAt: '2023-02-15T09:00:00Z',
  },
  {
    id: 'vid4',
    courseId: '3',
    title: 'Introduction to Organic Chemistry',
    description: 'Basic concepts and nomenclature in organic chemistry',
    duration: 3300, // 55 minutes
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=500',
    videoUrl: 'https://example.com/videos/chemistry-intro',
    createdAt: '2023-03-10T08:30:00Z',
  },
];

// Generate mock PDF materials
const generateMockPDFs = (): PDFMaterial[] => [
  {
    id: 'pdf1',
    courseId: '1',
    title: 'Mechanics Formula Sheet',
    description: 'Comprehensive formula sheet for Mechanics chapter',
    fileSize: '2.4 MB',
    fileUrl: 'https://example.com/pdfs/mechanics-formulas',
    createdAt: '2023-01-22T10:00:00Z',
  },
  {
    id: 'pdf2',
    courseId: '1',
    title: 'Wave Optics Notes',
    description: 'Detailed notes on Wave Optics concepts',
    fileSize: '3.1 MB',
    fileUrl: 'https://example.com/pdfs/wave-optics-notes',
    createdAt: '2023-01-27T10:00:00Z',
  },
  {
    id: 'pdf3',
    courseId: '2',
    title: 'Trigonometry Practice Problems',
    description: 'Collection of practice problems for trigonometric functions',
    fileSize: '1.8 MB',
    fileUrl: 'https://example.com/pdfs/trig-problems',
    createdAt: '2023-02-18T09:00:00Z',
  },
];

// Generate mock live sessions
const generateMockLiveSessions = (): LiveSession[] => [
  {
    id: 'live1',
    courseId: '1',
    title: 'Solving Advanced Mechanics Problems',
    description: 'Live problem-solving session for mechanics concepts',
    startTime: '2025-06-25T15:00:00Z',
    duration: 90, // 1.5 hours
    status: 'scheduled',
  },
  {
    id: 'live2',
    courseId: '2',
    title: 'Trigonometry Doubt Clearing Session',
    description: 'Interactive session to clear doubts on trigonometry',
    startTime: '2025-06-26T14:00:00Z',
    duration: 60, // 1 hour
    status: 'scheduled',
  },
  {
    id: 'live3',
    courseId: '3',
    title: 'Organic Chemistry Reactions Walkthrough',
    description: 'Detailed explanation of important organic chemistry reactions',
    startTime: '2025-06-27T16:00:00Z',
    duration: 120, // 2 hours
    status: 'scheduled',
  },
];

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Generate mock data
  const [courses] = useState<Course[]>(generateMockCourses());
  const [videoLectures] = useState<VideoLecture[]>(generateMockVideos());
  const [pdfMaterials] = useState<PDFMaterial[]>(generateMockPDFs());
  const [liveSessions] = useState<LiveSession[]>(generateMockLiveSessions());

  // For demo, let's assume the user is enrolled in the first course
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([
    {
      courseId: '1',
      enrolledAt: '2023-05-01T10:00:00Z',
      expiresAt: '2024-05-01T10:00:00Z',
      status: 'active',
    },
  ]);

  const getCourse = (id: string) => courses.find(course => course.id === id);
  
  const getCourseVideos = (courseId: string) => 
    videoLectures.filter(video => video.courseId === courseId);
  
  const getCoursePDFs = (courseId: string) => 
    pdfMaterials.filter(pdf => pdf.courseId === courseId);
  
  const getCourseLiveSessions = (courseId: string) => 
    liveSessions.filter(session => session.courseId === courseId);
  
  const isEnrolled = (courseId: string) => 
    enrolledCourses.some(course => 
      course.courseId === courseId && course.status === 'active'
    );
  
  const enrollCourse = (courseId: string) => {
    if (isEnrolled(courseId)) return;
    
    // In a real app, this would involve payment processing
    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 1);
    
    const newEnrollment: EnrolledCourse = {
      courseId,
      enrolledAt: now.toISOString(),
      expiresAt: nextYear.toISOString(),
      status: 'active',
    };
    
    setEnrolledCourses([...enrolledCourses, newEnrollment]);
  };

  const value = {
    courses,
    enrolledCourses,
    videoLectures,
    pdfMaterials,
    liveSessions,
    getCourse,
    getCourseVideos,
    getCoursePDFs,
    getCourseLiveSessions,
    isEnrolled,
    enrollCourse,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourses = () => useContext(CourseContext);
