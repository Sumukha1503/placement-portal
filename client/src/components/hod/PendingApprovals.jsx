import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';

const PendingApprovals = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      const res = await api.get('/api/hod/applications/pending');
      setApplications(res.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    setProcessing(applicationId);
    try {
      await api.patch(`/api/hod/applications/${applicationId}/approve`);
      alert('Application approved successfully');
      fetchPendingApplications();
    } catch (error) {
      alert('Error approving application');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (applicationId) => {
    if (!window.confirm('Are you sure you want to reject this application?')) return;
    
    setProcessing(applicationId);
    try {
      await api.patch(`/api/hod/applications/${applicationId}/reject`);
      alert('Application rejected');
      fetchPendingApplications();
    } catch (error) {
      alert('Error rejecting application');
    } finally {
      setProcessing(null);
    }
  };

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
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Pending Approvals
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review and approve student placement applications
        </p>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="p-6 rounded-xl border"
                 style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <div className="w-16 h-16 rounded flex items-center justify-center"
                       style={{ background: 'var(--accent)' }}>
                    {app.driveId?.companyLogo ? (
                      <img src={app.driveId.companyLogo} alt="Company" className="w-full h-full rounded" />
                    ) : (
                      <span className="text-white font-bold text-xl">
                        {app.driveId?.companyName?.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Application Details */}
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {app.studentId?.userId?.name || 'Unknown Student'}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Roll: {app.studentId?.rollNumber} • CGPA: {app.studentId?.cgpa}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded text-xs font-medium"
                            style={{ background: 'var(--accent)' + '20', color: 'var(--accent)' }}>
                        {app.driveId?.companyName}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium"
                            style={{ background: 'var(--bg-primary)' }}>
                        {app.driveId?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'var(--warning)' + '20', color: 'var(--warning)' }}>
                  <Clock size={14} />
                  Pending
                </span>
              </div>

              {/* Package & Eligibility Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-lg"
                   style={{ background: 'var(--bg-primary)' }}>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Package Offered
                  </p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                    ₹{(app.driveId?.package?.ctc / 100000).toFixed(2)} LPA
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Applied
                  </p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(app._id)}
                  disabled={processing === app._id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                  style={{ background: 'var(--success)', color: 'white' }}
                >
                  <CheckCircle size={18} />
                  {processing === app._id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(app._id)}
                  disabled={processing === app._id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                  style={{ background: 'var(--error)', color: 'white' }}
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--success)' }} />
          <p className="text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
            All Caught Up! ✅
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            No pending applications to review at this time
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
