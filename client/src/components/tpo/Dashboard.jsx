import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Mail, 
  FileText, 
  BarChart3,
  Upload,
  Filter,
  LogOut
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Import child components
import DashboardHome from './DashboardHome';
import ManageDrives from './ManageDrives';
import CreateDrive from './CreateDrive';
import EmailComposer from './EmailComposer';
import ResumeFilter from './ResumeFilter';
import Analytics from './Analytics';
import Reports from './Reports';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalDrives: 0,
    activeDrives: 0,
    totalApplications: 0,
    studentsPlaced: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const drivesRes = await api.get('/api/tpo/drives');
      const drives = drivesRes.data.drives;
      
      setStats({
        totalDrives: drives.length,
        activeDrives: drives.filter(d => d.status === 'active').length,
        totalApplications: 0, // Fetch from applications endpoint
        studentsPlaced: 0 // Calculate from selections
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
    { path: '/tpo', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/tpo/drives', icon: <Briefcase size={20} />, label: 'Manage Drives' },
    { path: '/tpo/create-drive', icon: <Upload size={20} />, label: 'Create Drive' },
    { path: '/tpo/emails', icon: <Mail size={20} />, label: 'Email Center' },
    { path: '/tpo/resume-filter', icon: <Filter size={20} />, label: 'Resume Filter' },
    { path: '/tpo/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/tpo/reports', icon: <FileText size={20} />, label: 'Reports' }
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
            TPO Portal
          </h2>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                {stats.activeDrives}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Active
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                {stats.studentsPlaced}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Placed
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
          <Route path="drives" element={<ManageDrives />} />
          <Route path="create-drive" element={<CreateDrive />} />
          <Route path="emails" element={<EmailComposer />} />
          <Route path="resume-filter" element={<ResumeFilter />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;