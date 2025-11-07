import { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/students/applications');
      setApplications(res.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'selected': <CheckCircle size={20} style={{ color: 'var(--success)' }} />,
      'rejected': <XCircle size={20} style={{ color: 'var(--error)' }} />,
      'hod-pending': <Clock size={20} style={{ color: 'var(--warning)' }} />,
      'hod-approved': <CheckCircle size={20} style={{ color: 'var(--accent)' }} />,
      'shortlisted': <AlertCircle size={20} style={{ color: 'var(--accent)' }} />
    };
    return icons[status] || <Clock size={20} style={{ color: 'var(--text-secondary)' }} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'selected': 'var(--success)',
      'rejected': 'var(--error)',
      'hod-pending': 'var(--warning)',
      'hod-approved': 'var(--accent)',
      'hod-rejected': 'var(--error)',
      'shortlisted': 'var(--accent)'
    };
    return colors[status] || 'var(--text-secondary)';
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
             style={{ borderColor: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Application Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track the status of all your placement applications
          </p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="all">All Applications</option>
          <option value="hod-pending">Pending Approval</option>
          <option value="hod-approved">Approved</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div key={app._id} className="p-6 rounded-xl border"
                 style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {app.driveId?.companyLogo ? (
                    <img src={app.driveId.companyLogo} alt={app.driveId.companyName}
                         className="w-12 h-12 rounded" />
                  ) : (
                    <div className="w-12 h-12 rounded flex items-center justify-center"
                         style={{ background: 'var(--accent)' }}>
                      <span className="text-white font-bold">
                        {app.driveId?.companyName?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {app.driveId?.companyName}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {app.driveId?.role}
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        background: getStatusColor(app.status) + '20',
                        color: getStatusColor(app.status)
                      }}>
                  {getStatusIcon(app.status)}
                  {app.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* Timeline */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Application Timeline
                </p>
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: 'var(--border)' }} />
                  
                  {/* Applied */}
                  <div className="relative">
                    <div className="absolute -left-[26px] w-3 h-3 rounded-full"
                         style={{ background: 'var(--success)' }} />
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                      Application Submitted
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* HOD Approval */}
                  {['hod-approved', 'shortlisted', 'round1', 'round2', 'round3', 'selected'].includes(app.status) && (
                    <div className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full"
                           style={{ background: 'var(--success)' }} />
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        HOD Approved
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Approved for recruitment process
                      </p>
                    </div>
                  )}

                  {/* Shortlisted */}
                  {['shortlisted', 'round1', 'round2', 'round3', 'selected'].includes(app.status) && (
                    <div className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full"
                           style={{ background: 'var(--success)' }} />
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        Shortlisted
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Selected for interview rounds
                      </p>
                    </div>
                  )}

                  {/* Selected */}
                  {app.status === 'selected' && (
                    <div className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full"
                           style={{ background: 'var(--success)' }} />
                      <p className="font-medium text-sm" style={{ color: 'var(--success)' }}>
                        🎉 Selected!
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Congratulations on your placement
                      </p>
                    </div>
                  )}

                  {/* Rejected */}
                  {app.status === 'rejected' && (
                    <div className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full"
                           style={{ background: 'var(--error)' }} />
                      <p className="font-medium text-sm" style={{ color: 'var(--error)' }}>
                        Not Selected
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Better opportunities ahead
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Offer Letter Download */}
              {app.status === 'selected' && app.offerLetterUrl && (
                <a
                  href={app.offerLetterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium transition-all"
                  style={{ background: 'var(--success)', color: 'white' }}
                >
                  <Download size={18} />
                  Download Offer Letter
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
            No applications found
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            Start applying to placement drives to track your progress here
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
