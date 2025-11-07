import { useEffect, useState } from 'react';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const DashboardHome = ({ stats }) => {
  const [topPerformers, setTopPerformers] = useState([]);
  const [placementTrend, setPlacementTrend] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      setTopPerformers([
        { name: 'Rahul Sharma', cgpa: 9.2, company: 'Google', package: 45 },
        { name: 'Priya Patel', cgpa: 9.0, company: 'Microsoft', package: 38 },
        { name: 'Amit Kumar', cgpa: 8.9, company: 'Amazon', package: 35 }
      ]);

      setPlacementTrend([
        { month: 'Jan', placed: 12 },
        { month: 'Feb', placed: 18 },
        { month: 'Mar', placed: 25 },
        { month: 'Apr', placed: 30 },
        { month: 'May', placed: 35 }
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
          Department Overview 📊
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Monitor student placements and manage approvals
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <Users size={24} style={{ color: 'var(--accent)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.totalStudents}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Total Students
          </p>
        </div>

        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <Award size={24} style={{ color: 'var(--success)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.placedStudents}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Placed Students
          </p>
        </div>

        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} style={{ color: 'var(--warning)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.pendingApprovals}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Pending Approvals
          </p>
        </div>

        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} style={{ color: 'var(--accent)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              ₹{stats.avgPackage} LPA
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Average Package
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Top Performers 🏆
          </h3>
          <div className="space-y-3">
            {topPerformers.map((student, index) => (
              <div key={index} className="p-4 rounded-lg border flex items-center justify-between"
                   style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                       style={{ background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {student.name}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      CGPA: {student.cgpa} • {student.company}
                    </p>
                  </div>
                </div>
                <span className="font-bold" style={{ color: 'var(--success)' }}>
                  ₹{student.package} LPA
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Placement Trend Chart */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Placement Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={placementTrend}>
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
              <Bar dataKey="placed" fill="var(--accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Placement Statistics */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Placement Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Placement Rate
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold" style={{ color: 'var(--success)' }}>
                {stats.totalStudents > 0 ? Math.round((stats.placedStudents / stats.totalStudents) * 100) : 0}%
              </span>
              <span className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                of students
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Highest Package
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                ₹45
              </span>
              <span className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                LPA
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              Companies Visited
            </p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>
                32
              </span>
              <span className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                this year
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
