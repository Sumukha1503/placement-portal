import { useState, useEffect } from 'react';
import { Save, Edit2, X } from 'lucide-react';
import api from '../../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/students/profile');
      setProfile(res.data.profile);
      setFormData(res.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/api/students/profile', formData);
      setProfile(formData);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
             style={{ borderColor: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          My Profile
        </h1>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        ) : (
          <button
            onClick={() => {
              setEditing(false);
              setFormData(profile);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{ background: 'var(--error)', color: 'white' }}
          >
            <X size={18} />
            Cancel
          </button>
        )}
      </div>

      {/* Profile Completion Bar */}
      <div className="mb-6 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            Profile Completion
          </span>
          <span className="font-bold" style={{ color: 'var(--accent)' }}>
            {profile.profileCompleteness}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${profile.profileCompleteness}%`,
              background: 'var(--accent)'
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-xl space-y-6"
            style={{ background: 'var(--bg-secondary)' }}>
        
        {/* Personal Information */}
        <div>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                value={formData.rollNumber || ''}
                disabled
                className="w-full px-4 py-2 rounded-lg border"
                style={{ 
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Batch
              </label>
              <input
                type="number"
                name="batch"
                value={formData.batch || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2 rounded-lg border"
                style={{ 
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                CGPA
              </label>
              <input
                type="number"
                step="0.01"
                name="cgpa"
                value={formData.cgpa || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2 rounded-lg border"
                style={{ 
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Backlogs
              </label>
              <input
                type="number"
                name="backlogs"
                value={formData.backlogs || 0}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2 rounded-lg border"
                style={{ 
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2 rounded-lg border"
                style={{ 
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Placement Status
              </label>
              <input
                type="text"
                value={profile.placementStatus?.toUpperCase() || 'UNPLACED'}
                disabled
                className="w-full px-4 py-2 rounded-lg border"
                style={{ 
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        {profile.resumeParsedData?.skills && (
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.resumeParsedData.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    background: 'var(--accent)',
                    color: 'white'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {editing && (
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
            style={{ background: 'var(--success)', color: 'white' }}
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;
