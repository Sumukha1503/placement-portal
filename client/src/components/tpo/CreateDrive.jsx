import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, X } from 'lucide-react';
import api from '../../services/api';

const CreateDrive = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyLogo: '',
    role: '',
    jobDescription: '',
    package: {
      ctc: '',
      fixed: '',
      variable: '',
      joiningBonus: ''
    },
    eligibility: {
      minCGPA: '',
      allowedBranches: [],
      maxBacklogs: '',
      allowedBatches: []
    },
    applicationDeadline: '',
    rounds: [{ roundNumber: 1, roundName: '', date: '', venue: '' }],
    status: 'active'
  });

  const [newBranch, setNewBranch] = useState('');
  const [newBatch, setNewBatch] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddBranch = () => {
    if (newBranch && !formData.eligibility.allowedBranches.includes(newBranch)) {
      setFormData({
        ...formData,
        eligibility: {
          ...formData.eligibility,
          allowedBranches: [...formData.eligibility.allowedBranches, newBranch]
        }
      });
      setNewBranch('');
    }
  };

  const handleRemoveBranch = (branch) => {
    setFormData({
      ...formData,
      eligibility: {
        ...formData.eligibility,
        allowedBranches: formData.eligibility.allowedBranches.filter(b => b !== branch)
      }
    });
  };

  const handleAddBatch = () => {
    const batch = parseInt(newBatch);
    if (batch && !formData.eligibility.allowedBatches.includes(batch)) {
      setFormData({
        ...formData,
        eligibility: {
          ...formData.eligibility,
          allowedBatches: [...formData.eligibility.allowedBatches, batch]
        }
      });
      setNewBatch('');
    }
  };

  const handleRemoveBatch = (batch) => {
    setFormData({
      ...formData,
      eligibility: {
        ...formData.eligibility,
        allowedBatches: formData.eligibility.allowedBatches.filter(b => b !== batch)
      }
    });
  };

  const handleAddRound = () => {
    setFormData({
      ...formData,
      rounds: [...formData.rounds, { 
        roundNumber: formData.rounds.length + 1, 
        roundName: '', 
        date: '', 
        venue: '' 
      }]
    });
  };

  const handleRoundChange = (index, field, value) => {
    const newRounds = [...formData.rounds];
    newRounds[index][field] = value;
    setFormData({ ...formData, rounds: newRounds });
  };

  const handleRemoveRound = (index) => {
    setFormData({
      ...formData,
      rounds: formData.rounds.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert string values to numbers
      const submitData = {
        ...formData,
        package: {
          ctc: parseFloat(formData.package.ctc) * 100000, // Convert LPA to actual amount
          fixed: parseFloat(formData.package.fixed) * 100000,
          variable: parseFloat(formData.package.variable) * 100000,
          joiningBonus: parseFloat(formData.package.joiningBonus) * 100000
        },
        eligibility: {
          ...formData.eligibility,
          minCGPA: parseFloat(formData.eligibility.minCGPA),
          maxBacklogs: parseInt(formData.eligibility.maxBacklogs)
        }
      };

      await api.post('/api/tpo/drives', submitData);
      alert('Placement drive created successfully!');
      navigate('/tpo/drives');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Create Placement Drive
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Add a new placement opportunity for students
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Details */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Company Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
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
                Company Logo URL
              </label>
              <input
                type="url"
                name="companyLogo"
                value={formData.companyLogo}
                onChange={handleChange}
                placeholder="https://logo.clearbit.com/company.com"
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Role/Position *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Job Description *
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Package Details (in LPA)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                CTC *
              </label>
              <input
                type="number"
                step="0.01"
                name="package.ctc"
                value={formData.package.ctc}
                onChange={handleChange}
                required
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
                Fixed Component
              </label>
              <input
                type="number"
                step="0.01"
                name="package.fixed"
                value={formData.package.fixed}
                onChange={handleChange}
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
                Variable Component
              </label>
              <input
                type="number"
                step="0.01"
                name="package.variable"
                value={formData.package.variable}
                onChange={handleChange}
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
                Joining Bonus
              </label>
              <input
                type="number"
                step="0.01"
                name="package.joiningBonus"
                value={formData.package.joiningBonus}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Eligibility Criteria
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Minimum CGPA *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="eligibility.minCGPA"
                  value={formData.eligibility.minCGPA}
                  onChange={handleChange}
                  required
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
                  Max Backlogs *
                </label>
                <input
                  type="number"
                  name="eligibility.maxBacklogs"
                  value={formData.eligibility.maxBacklogs}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{
                    background: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            {/* Allowed Branches */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Allowed Branches
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  placeholder="e.g., CSE, ECE, ME"
                  className="flex-1 px-4 py-2 rounded-lg border"
                  style={{
                    background: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddBranch}
                  className="px-4 py-2 rounded-lg"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.eligibility.allowedBranches.map((branch) => (
                  <span key={branch} className="flex items-center gap-2 px-3 py-1 rounded-full"
                        style={{ background: 'var(--accent)', color: 'white' }}>
                    {branch}
                    <X size={14} className="cursor-pointer" onClick={() => handleRemoveBranch(branch)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Allowed Batches */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Allowed Batches (Year)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  value={newBatch}
                  onChange={(e) => setNewBatch(e.target.value)}
                  placeholder="e.g., 2025"
                  className="flex-1 px-4 py-2 rounded-lg border"
                  style={{
                    background: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddBatch}
                  className="px-4 py-2 rounded-lg"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.eligibility.allowedBatches.map((batch) => (
                  <span key={batch} className="flex items-center gap-2 px-3 py-1 rounded-full"
                        style={{ background: 'var(--success)', color: 'white' }}>
                    {batch}
                    <X size={14} className="cursor-pointer" onClick={() => handleRemoveBatch(batch)} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application Deadline */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Timeline
          </h3>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Application Deadline *
            </label>
            <input
              type="datetime-local"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Recruitment Rounds */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Recruitment Rounds
            </h3>
            <button
              type="button"
              onClick={handleAddRound}
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              <Plus size={18} />
              Add Round
            </button>
          </div>

          <div className="space-y-4">
            {formData.rounds.map((round, index) => (
              <div key={index} className="p-4 rounded-lg border relative"
                   style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                {formData.rounds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRound(index)}
                    className="absolute top-2 right-2 p-1 rounded"
                    style={{ background: 'var(--error)', color: 'white' }}
                  >
                    <X size={16} />
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Round Name
                    </label>
                    <input
                      type="text"
                      value={round.roundName}
                      onChange={(e) => handleRoundChange(index, 'roundName', e.target.value)}
                      placeholder="e.g., Aptitude Test"
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{
                        background: 'var(--bg-secondary)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Date
                    </label>
                    <input
                      type="date"
                      value={round.date}
                      onChange={(e) => handleRoundChange(index, 'date', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{
                        background: 'var(--bg-secondary)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Venue
                    </label>
                    <input
                      type="text"
                      value={round.venue}
                      onChange={(e) => handleRoundChange(index, 'venue', e.target.value)}
                      placeholder="e.g., Lab 101"
                      className="w-full px-3 py-2 rounded-lg border text-sm"
                      style={{
                        background: 'var(--bg-secondary)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-lg font-medium text-lg transition-all disabled:opacity-50"
          style={{ background: 'var(--success)', color: 'white' }}
        >
          <Save size={20} />
          {loading ? 'Creating Drive...' : 'Create Placement Drive'}
        </button>
      </form>
    </div>
  );
};

export default CreateDrive;
