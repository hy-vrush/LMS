/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { UserDashboard } from './components/User/UserDashboard';
import { CoursePlayer } from './components/User/CoursePlayer';
import { Course } from './types';
import { Storage } from './lib/storage';

export default function App() {
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setCourses(Storage.getCourses());
  }, []);

  const handleAddCourse = (course: Course) => {
    Storage.saveCourse(course);
    setCourses(prev => [...prev, course]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage onSelectRole={setUserRole} />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            userRole === 'admin' ? (
              <Layout role="admin" onLogout={() => setUserRole(null)}>
                <Routes>
                  <Route index element={<AdminDashboard courses={courses} onAddCourse={handleAddCourse} />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          } 
        />

        {/* User Routes */}
        <Route 
          path="/user/*" 
          element={
            userRole === 'user' ? (
              <Layout role="user" onLogout={() => setUserRole(null)}>
                <Routes>
                  <Route index element={<UserDashboard courses={courses} />} />
                  <Route path="course/:courseId" element={<CoursePlayer courses={courses} />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/" />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

