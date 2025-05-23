
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { CourseProvider } from '@/contexts/CourseContext';
import { ContentProvider } from '@/contexts/ContentContext';

// Import components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import CoursesPage from '@/pages/courses/CoursesPage';
import CourseDetail from '@/pages/courses/CourseDetail';
import ProfilePage from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';

// Dashboard pages
import StudentDashboard from '@/pages/dashboard/student/StudentDashboard';
import TutorDashboard from '@/pages/dashboard/tutor/TutorDashboard';
import AdminDashboard from '@/pages/dashboard/admin/AdminDashboard';
import LiveClassManagement from '@/pages/dashboard/tutor/LiveClassManagement';
import QuickStartClass from '@/pages/dashboard/tutor/QuickStartClass';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <CourseProvider>
            <ContentProvider>
              <Router>
                <div className="min-h-screen bg-background flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/courses" element={<CoursesPage />} />
                      <Route path="/courses/:id" element={<CourseDetail />} />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Dashboard Routes */}
                      <Route 
                        path="/dashboard/student" 
                        element={
                          <ProtectedRoute allowedRoles={['student']}>
                            <StudentDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/dashboard/tutor" 
                        element={
                          <ProtectedRoute allowedRoles={['tutor']}>
                            <TutorDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/dashboard/admin" 
                        element={
                          <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Tutor Live Class Routes */}
                      <Route 
                        path="/tutor/live-classes" 
                        element={
                          <ProtectedRoute allowedRoles={['tutor']}>
                            <LiveClassManagement />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/tutor/quick-start" 
                        element={
                          <ProtectedRoute allowedRoles={['tutor']}>
                            <QuickStartClass />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Fallback route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
                <Toaster />
              </Router>
            </ContentProvider>
          </CourseProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
