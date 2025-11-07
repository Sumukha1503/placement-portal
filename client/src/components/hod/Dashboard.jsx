import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  BarChart3, 
  FileText,
  LogOut
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Import child components
import DashboardHome from './DashboardHome';
import StudentsList from './StudentsList';
import PendingApprovals from './PendingApprovals';
import Analytics from './Analytics';
import Reports from './Reports';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    pendingApprovals: 0,
    avgPackage: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [studentsRes, approvalsRes] = await Promise.all([
        api.get('/api/hod/students'),
        api.get('/api/hod/applications/pending')
      ]);

      const students = studentsRes.data.students;
      const placed = students.filter(s => s.placementStatus === 'placed');

      setStats({
        totalStudents: students.length,
        placedStudents: placed.length,
        pendingApprovals: approvalsRes.data.applications.length,
        avgPackage: 7.5 // Calculate from actual data
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
    { path: '/hod', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/hod/students', icon: <Users size={20} />, label: 'Students' },
    { path: '/hod/approvals', icon: <CheckSquare size={20} />, label: 'Approvals' },
    { path: '/hod/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/hod/reports', icon: <FileText size={20} />, label: 'Reports' }
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
            HOD Portal
          </h2>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                {stats.totalStudents}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Students
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                {stats.placedStudents}
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
          <Route path="students" element={<StudentsList />} />
          <Route path="approvals" element={<PendingApprovals />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;