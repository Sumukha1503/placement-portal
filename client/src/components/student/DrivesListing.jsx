import { useState, useEffect } from 'react';
import { Search, Filter, Building2, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';

const DrivesListing = () => {
  const [drives, setDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPackage, setFilterPackage] = useState('all');
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  useEffect(() => {
    filterDrives();
  }, [searchTerm, filterPackage, drives]);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/api/students/drives');
      setDrives(res.data.drives);
      setFilteredDrives(res.data.drives);
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDrives = () => {
    let filtered = [...drives];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(drive =>
        drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Package filter
    if (filterPackage !== 'all') {
      const [min, max] = filterPackage.split('-').map(Number);
      filtered = filtered.filter(drive => {
        const ctc = drive.package.ctc / 100000;
        return max ? (ctc >= min && ctc <= max) : ctc >= min;
      });
    }

    setFilteredDrives(filtered);
  };

  const handleApply = async (driveId) => {
    if (!window.confirm('Are you sure you want to apply for this drive?')) return;

    setApplying(driveId);
    try {
      await api.post(`/api/students/apply/${driveId}`);
      alert('Application submitted successfully! Waiting for HOD approval.');
      fetchDrives();
    } catch (error) {
      alert(error.response?.data?.message || 'Error applying to drive');
    } finally {
      setApplying(null);
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
          Active Placement Drives
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse and apply to eligible placement opportunities
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
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

        {/* Package Filter */}
        <select
          value={filterPackage}
          onChange={(e) => setFilterPackage(e.target.value)}
          className="px-4 py-3 rounded-lg border"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="all">All Packages</option>
          <option value="0-5">0-5 LPA</option>
          <option value="5-10">5-10 LPA</option>
          <option value="10-15">10-15 LPA</option>
          <option value="15-20">15-20 LPA</option>
          <option value="20">20+ LPA</option>
        </select>
      </div>

      {/* Drives Grid */}
      {filteredDrives.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDrives.map((drive) => (
            <div key={drive._id} className="p-6 rounded-xl border transition-all hover:scale-105"
                 style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              
              {/* Company Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {drive.companyLogo ? (
                    <img src={drive.companyLogo} alt={drive.companyName}
                         className="w-12 h-12 rounded" />
                  ) : (
                    <div className="w-12 h-12 rounded flex items-center justify-center"
                         style={{ background: 'var(--accent)' }}>
                      <Building2 size={24} color="white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {drive.companyName}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {drive.role}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: 'var(--success)' + '20', color: 'var(--success)' }}>
                  Active
                </span>
              </div>

              {/* Package */}
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={18} style={{ color: 'var(--accent)' }} />
                <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                  ₹{(drive.package.ctc / 100000).toFixed(2)} LPA
                </span>
              </div>

              {/* Eligibility */}
              <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Eligibility Criteria:
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)' }}>
                    CGPA ≥ {drive.eligibility.minCGPA}
                  </span>
                  <span className="px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)' }}>
                    Backlogs ≤ {drive.eligibility.maxBacklogs}
                  </span>
                  {drive.eligibility.allowedBranches.length > 0 && (
                    <span className="px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)' }}>
                      {drive.eligibility.allowedBranches.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Calendar size={16} />
                <span>
                  Deadline: {formatDistanceToNow(new Date(drive.applicationDeadline), { addSuffix: true })}
                </span>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => handleApply(drive._id)}
                disabled={applying === drive._id}
                className="w-full py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                {applying === drive._id ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            No placement drives found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default DrivesListing;
