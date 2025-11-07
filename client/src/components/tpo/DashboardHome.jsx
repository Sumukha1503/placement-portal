import { useEffect, useState } from 'react';
import { Briefcase, Users, TrendingUp, Award, Calendar, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const DashboardHome = ({ stats }) => {
  const [recentDrives, setRecentDrives] = useState([]);
  const [conversionFunnel, setConversionFunnel] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const drivesRes = await api.get('/api/tpo/drives?limit=5');
      setRecentDrives(drivesRes.data.drives || []);

      // Mock data - replace with actual API
      setConversionFunnel([
        { stage: 'Applied', count: 450 },
        { stage: 'Approved', count: 380 },
        { stage: 'Shortlisted', count: 220 },
        { stage: 'Round 1', count: 150 },
        { stage: 'Round 2', count: 80 },
        { stage: 'Selected', count: 45 }
      ]);

      setMonthlyTrend([
        { month: 'Aug', placed: 28, drives: 8 },
        { month: 'Sep', placed: 35, drives: 10 },
        { month: 'Oct', placed: 42, drives: 12 },
        { month: 'Nov', placed: 38, drives: 9 },
        { month: 'Dec', placed: 52, drives: 15 }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Placement Management Dashboard 🎯
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Complete overview of campus recruitment activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <Briefcase size={24} style={{ color: 'var(--accent)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.totalDrives}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Total Drives
          </p>
        </div>

        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <Calendar size={24} style={{ color: 'var(--success)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.activeDrives}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Active Drives
          </p>
        </div>

        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <Users size={24} style={{ color: 'var(--warning)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.totalApplications}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Applications
          </p>
        </div>

        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <Award size={24} style={{ color: 'var(--accent)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.studentsPlaced}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Students Placed
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Recruitment Funnel
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionFunnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--text-secondary)" />
              <YAxis dataKey="stage" type="category" stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-primary)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="var(--accent)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Monthly Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-primary)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="placed" stroke="var(--success)" strokeWidth={2} name="Students Placed" />
              <Line type="monotone" dataKey="drives" stroke="var(--accent)" strokeWidth={2} name="Drives Conducted" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Drives */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Recent Drives
          </h3>
          <Link to="/tpo/drives" className="text-sm" style={{ color: 'var(--accent)' }}>
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {recentDrives.length > 0 ? (
            recentDrives.map((drive) => (
              <div key={drive._id} className="p-4 rounded-lg border flex items-center justify-between"
                   style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-4">
                  {drive.companyLogo ? (
                    <img src={drive.companyLogo} alt={drive.companyName} className="w-12 h-12 rounded" />
                  ) : (
                    <div className="w-12 h-12 rounded flex items-center justify-center"
                         style={{ background: 'var(--accent)' }}>
                      <span className="text-white font-bold">{drive.companyName?.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {drive.companyName}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {drive.role} • ₹{(drive.package?.ctc / 100000).toFixed(2)} LPA
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        background: drive.status === 'active' ? 'var(--success)' + '20' : 'var(--text-secondary)' + '20',
                        color: drive.status === 'active' ? 'var(--success)' : 'var(--text-secondary)'
                      }}>
                  {drive.status?.toUpperCase()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              No recent drives
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/tpo/create-drive"
              className="p-6 rounded-xl border transition-all hover:scale-105 text-center"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <Briefcase size={32} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
          <h4 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Create New Drive
          </h4>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Add a new placement opportunity
          </p>
        </Link>

        <Link to="/tpo/emails"
              className="p-6 rounded-xl border transition-all hover:scale-105 text-center"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <Mail size={32} className="mx-auto mb-3" style={{ color: 'var(--success)' }} />
          <h4 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Send Emails
          </h4>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Communicate with students
          </p>
        </Link>

        <Link to="/tpo/resume-filter"
              className="p-6 rounded-xl border transition-all hover:scale-105 text-center"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <TrendingUp size={32} className="mx-auto mb-3" style={{ color: 'var(--warning)' }} />
          <h4 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Filter Resumes
          </h4>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            AI-powered candidate screening
          </p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;
