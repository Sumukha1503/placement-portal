import { useEffect, useState } from 'react';
import { Briefcase, Users, TrendingUp, Award, Calendar, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';

const CompanyDashboardHome = ({ stats }) => {
  const [recentDrives, setRecentDrives] = useState([]);
  const [conversionFunnel, setConversionFunnel] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API
    setRecentDrives([
      { id: 1, company: 'TechCorp', role: 'Software Engineer', applications: 45, status: 'active' },
      { id: 2, company: 'InnovateX', role: 'Data Analyst', applications: 32, status: 'active' },
      { id: 3, company: 'FutureTech', role: 'Product Manager', applications: 28, status: 'completed' }
    ]);

    setConversionFunnel([
      { stage: 'Applied', count: 450 },
      { stage: 'Shortlisted', count: 220 },
      { stage: 'Interview', count: 150 },
      { stage: 'Offer', count: 80 },
      { stage: 'Joined', count: 68 }
    ]);

    setMonthlyTrend([
      { month: 'Jan', placed: 12, drives: 3 },
      { month: 'Feb', placed: 18, drives: 4 },
      { month: 'Mar', placed: 25, drives: 5 },
      { month: 'Apr', placed: 30, drives: 6 },
      { month: 'May', placed: 35, drives: 7 }
    ]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Company Dashboard 🏢
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your placement drives and connect with students
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} style={{ color: 'var(--success)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              ₹{stats.avgPackage} LPA
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Avg. Package
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Application Funnel
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
          <Link to="create-drive" className="text-sm" style={{ color: 'var(--accent)' }}>
            Create New Drive →
          </Link>
        </div>

        <div className="space-y-3">
          {recentDrives.length > 0 ? (
            recentDrives.map((drive) => (
              <div key={drive.id} className="p-4 rounded-lg border flex items-center justify-between"
                   style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    {drive.role}
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {drive.company} • {drive.applications} applications
                  </p>
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
        <Link to="create-drive"
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

        <Link to="emails"
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

        <Link to="analytics"
              className="p-6 rounded-xl border transition-all hover:scale-105 text-center"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <TrendingUp size={32} className="mx-auto mb-3" style={{ color: 'var(--warning)' }} />
          <h4 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            View Analytics
          </h4>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Track performance metrics
          </p>
        </Link>
      </div>
    </div>
  );
};

export default CompanyDashboardHome;