import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Calendar, Award, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

const DashboardHome = ({ stats }) => {
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [drivesRes, appsRes, notifRes] = await Promise.all([
        api.get('/api/students/drives?limit=3'),
        api.get('/api/students/applications?limit=5'),
        api.get('/api/students/notifications?limit=5')
      ]);

      setUpcomingDrives(drivesRes.data.drives || []);
      setRecentApplications(appsRes.data.applications || []);
      setNotifications(notifRes.data.notifications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'selected': 'var(--success)',
      'rejected': 'var(--error)',
      'hod-pending': 'var(--warning)',
      'hod-approved': 'var(--accent)',
      'shortlisted': 'var(--accent)'
    };
    return colors[status] || 'var(--text-secondary)';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Welcome Back! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here's what's happening with your placement journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} style={{ color: 'var(--accent)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.activeApplications}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Active Applications
          </p>
        </div>

        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <Calendar size={24} style={{ color: 'var(--warning)' }} />
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
            <Award size={24} style={{ color: 'var(--success)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.completedRounds}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Selections
          </p>
        </div>

        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-2">
            <AlertCircle size={24} style={{ color: 'var(--accent)' }} />
            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stats.profileCompletion}%
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Profile Complete
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Drives */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Upcoming Drives
            </h3>
            <Link to="/student/drives" className="text-sm" style={{ color: 'var(--accent)' }}>
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingDrives.length > 0 ? (
              upcomingDrives.map((drive) => (
                <div key={drive._id} className="p-4 rounded-lg border"
                     style={{ 
                       background: 'var(--bg-primary)',
                       borderColor: 'var(--border)'
                     }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        {drive.companyName}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {drive.role}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>
                        Package: ₹{(drive.package.ctc / 100000).toFixed(2)} LPA
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded" 
                          style={{ 
                            background: 'var(--accent)',
                            color: 'white'
                          }}>
                      {formatDistanceToNow(new Date(drive.applicationDeadline), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                No upcoming drives available
              </p>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Recent Applications
            </h3>
            <Link to="/student/applications" className="text-sm" style={{ color: 'var(--accent)' }}>
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app._id} className="p-4 rounded-lg border flex items-center justify-between"
                     style={{ 
                       background: 'var(--bg-primary)',
                       borderColor: 'var(--border)'
                     }}>
                  <div>
                    <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {app.driveId?.companyName}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {app.driveId?.role}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ 
                          background: getStatusColor(app.status) + '20',
                          color: getStatusColor(app.status)
                        }}>
                    {app.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                No applications yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Recent Notifications
          </h3>
          <Link to="/student/notifications" className="text-sm" style={{ color: 'var(--accent)' }}>
            View All →
          </Link>
        </div>

        <div className="space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif._id} className="p-4 rounded-lg border flex items-start gap-3"
                   style={{ 
                     background: notif.isRead ? 'var(--bg-primary)' : 'var(--accent)' + '10',
                     borderColor: 'var(--border)'
                   }}>
                <div className="flex-1">
                  <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {notif.title}
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {notif.message}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                )}
              </div>
            ))
          ) : (
            <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              No notifications
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
