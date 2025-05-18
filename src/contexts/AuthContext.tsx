
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Define user roles
export type UserRole = 'student' | 'tutor' | 'admin';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Mock user data (In production, this would come from your backend)
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Student Demo',
    email: 'student@example.com',
    role: 'student',
    profileImage: 'https://i.pravatar.cc/150?u=student',
  },
  {
    id: '2',
    name: 'Tutor Demo',
    email: 'tutor@example.com',
    role: 'tutor',
    profileImage: 'https://i.pravatar.cc/150?u=tutor',
  },
  {
    id: '3',
    name: 'Admin Demo',
    email: 'admin@example.com',
    role: 'admin',
    profileImage: 'https://i.pravatar.cc/150?u=admin',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would validate a token with the server
        const storedUser = localStorage.getItem('edtech_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem('edtech_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data (In production, this would be a real API call)
      const foundUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && password === 'password'
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      // Store user in localStorage (In production, you'd store a JWT token)
      localStorage.setItem('edtech_user', JSON.stringify(foundUser));
      setUser(foundUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already in use');
      }
      
      // Create new user (In production, this would be a real API call)
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        role,
        profileImage: `https://i.pravatar.cc/150?u=${email}`,
      };
      
      // In a real app, you would push this to your database
      // For demo purposes, we'll just set the current user
      localStorage.setItem('edtech_user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast({
        title: "Registration successful",
        description: `Welcome to our platform, ${name}!`,
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('edtech_user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
