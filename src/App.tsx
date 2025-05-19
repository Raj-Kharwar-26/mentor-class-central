
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { ContentProvider } from "@/contexts/ContentContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import CoursesPage from "./pages/courses/CoursesPage";
import CourseDetail from "./pages/courses/CourseDetail";

// Dashboard Pages
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import TutorDashboard from "./pages/dashboard/tutor/TutorDashboard";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CourseProvider>
        <ContentProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                
                {/* Protected route for profile */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Role-based dashboard routes */}
                <Route 
                  path="/student/*" 
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <Routes>
                        <Route path="/" element={<StudentDashboard />} />
                        <Route path="*" element={<Navigate to="/student" replace />} />
                      </Routes>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/tutor/*" 
                  element={
                    <ProtectedRoute allowedRoles={['tutor']}>
                      <Routes>
                        <Route path="/" element={<TutorDashboard />} />
                        <Route path="*" element={<Navigate to="/tutor" replace />} />
                      </Routes>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                      </Routes>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ContentProvider>
      </CourseProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
