import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Briefcase, 
  Bell, 
  CheckCircle,
  Clock,
  TrendingUp,
  LogOut
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Import child components
import DashboardHome from './DashboardHome';
import Profile from './Profile';
import ResumeUpload from './ResumeUpload';
import DrivesListing from './DrivesListing';
import ApplicationTracker from './ApplicationTracker';
import Notifications from './Notifications';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    activeApplications: 0,
    pendingApprovals: 0,
    completedRounds: 0,
    profileCompletion: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [applicationsRes, profileRes] = await Promise.all([
        api.get('/api/students/applications'),
        api.get('/api/students/profile')
      ]);

      const applications = applicationsRes.data.applications;
      setStats({
        activeApplications: applications.filter(a => 
          !['selected', 'rejected'].includes(a.status)
        ).length,
        pendingApprovals: applications.filter(a => 
          a.status === 'hod-pending'
        ).length,
        completedRounds: applications.filter(a => 
          a.status === 'selected'
        ).length,
        profileCompletion: profileRes.data.profile?.profileCompleteness || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/student', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/student/profile', icon: <User size={20} />, label: 'Profile' },
    { path: '/student/resume', icon: <FileText size={20} />, label: 'Resume' },
    { path: '/student/drives', icon: <Briefcase size={20} />, label: 'Drives' },
    { path: '/student/applications', icon: <TrendingUp size={20} />, label: 'Applications' },
    { path: '/student/notifications', icon: <Bell size={20} />, label: 'Notifications' }
  ];

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className="w-64 border-r" style={{ 
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)'
      }}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
            Student Portal
          </h2>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                {stats.activeApplications}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Active Apps
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                {stats.profileCompletion}%
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Profile
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                  style={{
                    background: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-red-500 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Routes>
          <Route index element={<DashboardHome stats={stats} />} />
          <Route path="profile" element={<Profile />} />
          <Route path="resume" element={<ResumeUpload />} />
          <Route path="drives" element={<DrivesListing />} />
          <Route path="applications" element={<ApplicationTracker />} />
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;