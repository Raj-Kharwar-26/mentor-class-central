
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Course } from '@/contexts/CourseContext';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Get subject badge color
  const getSubjectColor = (subject: string) => {
    const lowerSubject = subject.toLowerCase();
    switch(lowerSubject) {
      case 'mathematics':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'physics':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'chemistry':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'biology':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={course.thumbnail || 'https://placehold.co/600x400?text=Course'} 
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Badge className={getSubjectColor(course.subject)}>
              {course.subject.charAt(0).toUpperCase() + course.subject.slice(1)}
            </Badge>
          </div>
          {course.class_grade && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="outline" className="bg-black/70 text-white border-0">
                Class {course.class_grade}
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="pt-4 flex-grow">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1">{course.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {course.description}
          </p>
          
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <img 
                src={course.instructor?.profileImage || 'https://i.pravatar.cc/150'} 
                alt={course.instructor?.name}
                className="w-5 h-5 rounded-full mr-1.5"
              />
              <span>{course.instructor?.name}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex items-center justify-between border-t mt-auto">
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{course.rating || 4.5}</span>
            <span className="text-xs text-muted-foreground ml-1">
              ({course.enrolledStudentCount || 0})
            </span>
          </div>
          
          <div className="font-semibold">
            {formatPrice(course.price)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
