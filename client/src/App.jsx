import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ThemeToggle from './components/common/ThemeToggle';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './components/student/Dashboard';
import HODDashboard from './components/hod/Dashboard';
import TPODashboard from './components/tpo/Dashboard';
import CompanyDashboard from './components/company/Dashboard';
import CompanyPages from './pages/CompanyPages';

function App() {
  const location = useLocation();
  
  // Don't show navbar on dashboard routes since they have their own navigation
  const hideNavbar = location.pathname.startsWith('/student') || 
                    location.pathname.startsWith('/hod') || 
                    location.pathname.startsWith('/tpo') || 
                    location.pathname.startsWith('/company');

  return (
    <AuthProvider>
      <div className="min-h-screen transition-colors duration-300">
        {!hideNavbar && <Navbar />}
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/hod/*" 
            element={
              <ProtectedRoute allowedRoles={['hod']}>
                <HODDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/tpo/*" 
            element={
              <ProtectedRoute allowedRoles={['tpo']}>
                <TPODashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/company/*" 
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/companies/*" 
            element={
              <ProtectedRoute>
                <CompanyPages />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;