
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { user, profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Route links based on user role
  const getDashboardLink = () => {
    if (!profile) return '/login';
    
    switch (profile.role) {
      case 'student':
        return '/student';
      case 'tutor':
        return '/tutor';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo and brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-xl hidden md:inline-block">EduCoach</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/courses" 
            className={`nav-link ${location.pathname.includes('/courses') ? 'text-primary font-medium' : ''}`}
          >
            Courses
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'text-primary font-medium' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${location.pathname === '/contact' ? 'text-primary font-medium' : ''}`}
          >
            Contact
          </Link>
        </nav>

        {/* Auth buttons or user menu */}
        <div className="flex items-center gap-2">
          {isAuthenticated && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="cursor-pointer border border-gray-200 hover:border-primary transition-colors">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'User'} />
                  <AvatarFallback>{profile.full_name ? getInitials(profile.full_name) : 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600" 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
