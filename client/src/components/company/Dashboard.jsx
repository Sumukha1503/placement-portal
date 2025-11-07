import { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import CompanyDashboardHome from './DashboardHome';
import CreateDrive from '../tpo/CreateDrive';
import ManageDrives from '../tpo/ManageDrives';
import EmailComposer from '../tpo/EmailComposer';
import Reports from '../tpo/Reports';
import Analytics from '../tpo/Analytics';

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock stats data
  const [stats, setStats] = useState({
    totalDrives: 12,
    activeDrives: 3,
    totalApplications: 450,
    studentsPlaced: 68,
    avgPackage: 18.5
  });

  useEffect(() => {
    // In a real app, this would fetch from an API
    // fetchStats();
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '', icon: '📊' },
    { name: 'Create Drive', path: 'create-drive', icon: '➕' },
    { name: 'Manage Drives', path: 'manage-drives', icon: '📋' },
    { name: 'Send Emails', path: 'emails', icon: '✉️' },
    { name: 'Analytics', path: 'analytics', icon: '📈' },
    { name: 'Reports', path: 'reports', icon: '📝' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h1 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
            Company Portal
          </h1>
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        
        {/* User Profile Section */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.name}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
            style={{ 
              background: 'var(--error)', 
              color: 'white' 
            }}
          >
            <LogOut className="mr-3" size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Visible on mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md"
            style={{ background: 'var(--bg-secondary)' }}
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>
            Company Portal
          </h1>
        </div>
        
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route index element={<CompanyDashboardHome stats={stats} />} />
            <Route path="create-drive" element={<CreateDrive />} />
            <Route path="manage-drives" element={<ManageDrives />} />
            <Route path="emails" element={<EmailComposer />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;