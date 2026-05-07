import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ThemeProvider } from './ThemeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import { authService } from './services/authService';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const location = useLocation();

  useEffect(() => {
    // Update authentication state when location changes
    setIsAuthenticated(authService.isAuthenticated());
  }, [location]);

  return (
    <>
      <ScrollToTop />
      <div className="App">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <PrivateRoute>
                <Projects />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
