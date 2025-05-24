
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoAccessButton: React.FC = () => {
  return (
    <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-center text-blue-900 flex items-center justify-center gap-2">
          <BookOpen className="h-5 w-5" />
          Demo Course Available
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-blue-700">
          Test the complete live class system with our sample Mathematics course!
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-sm font-medium">For Students</p>
            <p className="text-xs text-gray-600">Enroll & Join Live Classes</p>
          </div>
          <div className="text-center">
            <Play className="h-8 w-8 mx-auto text-red-600 mb-2" />
            <p className="text-sm font-medium">For Tutors</p>
            <p className="text-xs text-gray-600">Start Live Classes</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Link to="/courses/f47ac10b-58cc-4372-a567-0e02b2c3d479">
            <Button className="w-full mb-2">
              View Demo Course
            </Button>
          </Link>
          <Link to="/tutor/quick-start">
            <Button variant="outline" className="w-full">
              Start Live Class (Tutor)
            </Button>
          </Link>
        </div>
        
        <p className="text-xs text-gray-500">
          Course ID: f47ac10b-58cc-4372-a567-0e02b2c3d479
        </p>
      </CardContent>
    </Card>
  );
};

export default DemoAccessButton;
