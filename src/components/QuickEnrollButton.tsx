
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Loader2 } from 'lucide-react';

interface QuickEnrollButtonProps {
  courseId: string;
  courseName: string;
}

const QuickEnrollButton: React.FC<QuickEnrollButtonProps> = ({ courseId, courseName }) => {
  const [enrolling, setEnrolling] = useState(false);
  const { enrollInCourse, isEnrolled } = useCourses();
  const { isAuthenticated } = useAuth();

  const handleQuickEnroll = async () => {
    if (!isAuthenticated) {
      return;
    }
    
    setEnrolling(true);
    try {
      await enrollInCourse(courseId);
    } finally {
      setEnrolling(false);
    }
  };

  if (isEnrolled(courseId)) {
    return (
      <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 p-3 rounded-md flex items-center">
        <CheckCircle className="h-5 w-5 mr-2" />
        <span>You are enrolled in this course</span>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleQuickEnroll}
      disabled={enrolling || !isAuthenticated}
      className="w-full"
      size="lg"
    >
      {enrolling ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Enrolling...
        </>
      ) : (
        'Enroll Now (Free for Testing)'
      )}
    </Button>
  );
};

export default QuickEnrollButton;
