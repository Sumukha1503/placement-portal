import { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import api from '../../services/api';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    placementByDepartment: [],
    packageDistribution: [],
    yearlyTrend: [],
    topCompanies: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Mock data - replace with actual API
      setAnalyticsData({
        placementByDepartment: [
          { dept: 'CSE', placed: 85, total: 100 },
          { dept: 'ECE', placed: 70, total: 90 },
          { dept: 'ME', placed: 60, total: 85 },
          { dept: 'EEE', placed: 65, total: 80 }
        ],
        packageDistribution: [
          { range: '0-5 LPA', count: 20 },
          { range: '5-10 LPA', count: 45 },
          { range: '10-15 LPA', count: 25 },
          { range: '15-20 LPA', count: 15 },
          { range: '20+ LPA', count: 8 }
        ],
        yearlyTrend: [
          { year: '2021', placed: 180, avgPackage: 6.2 },
          { year: '2022', placed: 220, avgPackage: 6.8 },
          { year: '2023', placed: 260, avgPackage: 7.2 },
          { year: '2024', placed: 290, avgPackage: 7.5 },
          { year: '2025', placed: 320, avgPackage: 7.8 }
        ],
        topCompanies: [
          { name: 'Google', students: 12, avgPackage: 35 },
          { name: 'Microsoft', students: 10, avgPackage: 32 },
          { name: 'Amazon', students: 15, avgPackage: 28 },
          { name: 'Adobe', students: 8, avgPackage: 25 },
          { name: 'Salesforce', students: 7, avgPackage: 22 }
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Overall Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          College-wide placement statistics and insights
        </p>
      </div>

      {/* Placement by Department */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Department-wise Placement Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.placementByDepartment}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="dept" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip 
              contentStyle={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="placed" fill="var(--success)" name="Placed" radius={[8, 8, 0, 0]} />
            <Bar dataKey="total" fill="var(--text-secondary)" name="Total" radius={[8, 8, 0, 0]} opacity={0.3} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Distribution */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Package Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.packageDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {analyticsData.packageDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-primary)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Trend */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Year-over-Year Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.yearlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" stroke="var(--text-secondary)" />
              <YAxis yAxisId="left" stroke="var(--text-secondary)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-primary)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="placed" stroke="var(--accent)" strokeWidth={2} name="Students Placed" />
              <Line yAxisId="right" type="monotone" dataKey="avgPackage" stroke="var(--success)" strokeWidth={2} name="Avg Package (LPA)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Recruiting Companies */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Top Recruiting Companies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.topCompanies.map((company, index) => (
            <div key={index} className="p-4 rounded-lg border"
                 style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {company.name}
                </h4>
                <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
                  #{index + 1}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>
                  {company.students} students
                </span>
                <span className="font-bold" style={{ color: 'var(--success)' }}>
                  ₹{company.avgPackage} LPA
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
