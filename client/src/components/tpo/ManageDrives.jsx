import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Eye, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ManageDrives = () => {
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrives();
  }, []);

  useEffect(() => {
    filterDrives();
  }, [searchTerm, statusFilter, drives]);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/api/tpo/drives');
      setDrives(res.data.drives);
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDrives = () => {
    let filtered = [...drives];

    if (searchTerm) {
      filtered = filtered.filter(drive =>
        drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(drive => drive.status === statusFilter);
    }

    setFilteredDrives(filtered);
  };

  const handleDelete = async (driveId) => {
    if (!window.confirm('Are you sure you want to delete this drive?')) return;

    try {
      await api.delete(`/api/tpo/drives/${driveId}`);
      alert('Drive deleted successfully');
      fetchDrives();
    } catch (error) {
      alert('Error deleting drive');
    }
  };

  const handleStatusChange = async (driveId, newStatus) => {
    try {
      await api.put(`/api/tpo/drives/${driveId}`, { status: newStatus });
      alert('Drive status updated');
      fetchDrives();
    } catch (error) {
      alert('Error updating status');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Manage Placement Drives
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            View, edit, and manage all placement opportunities
          </p>
        </div>
        <Link
          to="/tpo/create-drive"
          className="px-6 py-3 rounded-lg font-medium transition-all"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          Create New Drive
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                  size={20} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-lg border"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Drives Grid */}
      {filteredDrives.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredDrives.map((drive) => (
            <div key={drive._id} className="p-6 rounded-xl border"
                 style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {drive.companyLogo ? (
                    <img src={drive.companyLogo} alt={drive.companyName}
                         className="w-16 h-16 rounded" />
                  ) : (
                    <div className="w-16 h-16 rounded flex items-center justify-center"
                         style={{ background: 'var(--accent)' }}>
                      <span className="text-white font-bold text-xl">
                        {drive.companyName?.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {drive.companyName}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {drive.role}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: 'var(--accent)' + '20', color: 'var(--accent)' }}>
                        ₹{(drive.package?.ctc / 100000).toFixed(2)} LPA
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              background: drive.status === 'active' ? 'var(--success)' + '20' : 
                                         drive.status === 'closed' ? 'var(--error)' + '20' : 'var(--text-secondary)' + '20',
                              color: drive.status === 'active' ? 'var(--success)' : 
                                    drive.status === 'closed' ? 'var(--error)' : 'var(--text-secondary)'
                            }}>
                        {drive.status?.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs"
                            style={{ background: 'var(--bg-primary)' }}>
                        Deadline: {formatDistanceToNow(new Date(drive.applicationDeadline), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/tpo/drives/${drive._id}/applications`}
                    className="p-2 rounded transition-all hover:scale-110"
                    style={{ background: 'var(--accent)' + '20', color: 'var(--accent)' }}
                    title="View Applications"
                  >
                    <Users size={18} />
                  </Link>
                  <button
                    className="p-2 rounded transition-all hover:scale-110"
                    style={{ background: 'var(--warning)' + '20', color: 'var(--warning)' }}
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(drive._id)}
                    className="p-2 rounded transition-all hover:scale-110"
                    style={{ background: 'var(--error)' + '20', color: 'var(--error)' }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Eligibility & Rounds */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg"
                   style={{ background: 'var(--bg-primary)' }}>
                <div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Eligibility
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)' }}>
                      CGPA ≥ {drive.eligibility?.minCGPA}
                    </span>
                    <span className="px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)' }}>
                      Backlogs ≤ {drive.eligibility?.maxBacklogs}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Recruitment Rounds
                  </p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {drive.rounds?.length || 0} rounds configured
                  </p>
                </div>
              </div>

              {/* Status Actions */}
              {drive.status === 'active' && (
                <button
                  onClick={() => handleStatusChange(drive._id, 'closed')}
                  className="w-full mt-4 py-2 rounded-lg font-medium"
                  style={{ background: 'var(--error)', color: 'white' }}
                >
                  Close Drive
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
            No drives found
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            Create your first placement drive to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageDrives;
