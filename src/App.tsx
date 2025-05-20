
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { CourseProvider } from "@/contexts/CourseContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/ProfilePage";
import CoursesPage from "@/pages/courses/CoursesPage";
import CourseDetail from "@/pages/courses/CourseDetail";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentDashboard from "@/pages/dashboard/student/StudentDashboard";
import TutorDashboard from "@/pages/dashboard/tutor/TutorDashboard";
import AdminDashboard from "@/pages/dashboard/admin/AdminDashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="educoach-theme">
      <AuthProvider>
        <CourseProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:courseId" element={<CourseDetail />} />

                  {/* Protected routes */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Dashboard routes */}
                  <Route 
                    path="/student" 
                    element={
                      <ProtectedRoute requiredRole="student">
                        <DashboardLayout>
                          <StudentDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/tutor" 
                    element={
                      <ProtectedRoute requiredRole="tutor">
                        <DashboardLayout>
                          <TutorDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <DashboardLayout>
                          <AdminDashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
          </Router>
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
