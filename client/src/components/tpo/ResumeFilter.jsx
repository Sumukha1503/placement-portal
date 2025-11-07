import { useState } from 'react';
import { Filter, Download, Plus, X } from 'lucide-react';
import api from '../../services/api';

const ResumeFilter = () => {
  const [filters, setFilters] = useState({
    minCGPA: '',
    maxBacklogs: '',
    branch: '',
    graduationYear: '',
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !filters.skills.includes(newSkill.trim())) {
      setFilters({
        ...filters,
        skills: [...filters.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFilters({
      ...filters,
      skills: filters.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock results
      setResults([
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 234 567 8900',
          atsScore: 85,
          skills: ['JavaScript', 'React', 'Node.js', 'Python']
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1 234 567 8901',
          atsScore: 78,
          skills: ['Java', 'Spring', 'MySQL', 'AWS']
        },
        {
          name: 'Robert Johnson',
          email: 'robert@example.com',
          phone: '+1 234 567 8902',
          atsScore: 92,
          skills: ['Python', 'Django', 'PostgreSQL', 'Docker']
        }
      ]);
    } catch (error) {
      console.error('Error filtering resumes:', error);
      alert('Error filtering resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportList = async () => {
    try {
      // Call the API to generate and download the export
      const response = await api.get('/api/tpo/resumes/export', { 
        responseType: 'blob' // Important for downloading files
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'filtered-candidates.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting list:', error);
      alert('Error exporting list. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Resume Filter
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Filter candidates based on eligibility criteria
        </p>
      </div>

      {/* Filter Form */}
      <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CGPA Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Min CGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={filters.minCGPA}
                onChange={(e) => handleFilterChange('minCGPA', e.target.value)}
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
                Max Backlogs
              </label>
              <input
                type="number"
                min="0"
                value={filters.maxBacklogs}
                onChange={(e) => handleFilterChange('maxBacklogs', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Branch
            </label>
            <select
              value={filters.branch}
              onChange={(e) => handleFilterChange('branch', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="">All Branches</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Graduation Year
            </label>
            <select
              value={filters.graduationYear}
              onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <option value="">Any Year</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Required Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="e.g., JavaScript, React, Node.js"
                className="flex-1 px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
              <button
                onClick={handleAddSkill}
                className="px-6 py-2 rounded-lg font-medium"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  {skill}
                  <button 
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplyFilters}
          disabled={loading}
          className="mt-6 flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          <Filter size={20} />
          {loading ? 'Filtering Resumes...' : 'Apply Filters'}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Filtered Candidates ({results.length})
            </h3>
            <button
              onClick={handleExportList}
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'var(--success)', color: 'white' }}
            >
              <Download size={18} />
              Export List
            </button>
          </div>

          <div className="space-y-3">
            {results.map((candidate, index) => (
              <div key={index} className="p-4 rounded-lg border"
                   style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {candidate.name}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {candidate.email} • {candidate.phone}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {candidate.skills?.slice(0, 5).map((skill, i) => (
                        <span key={i} className="px-2 py-1 rounded text-xs"
                              style={{ background: 'var(--accent)' + '20', color: 'var(--accent)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold mb-1"
                         style={{ 
                           color: candidate.atsScore >= 70 ? 'var(--success)' : 
                                 candidate.atsScore >= 50 ? 'var(--warning)' : 'var(--error)'
                         }}>
                      {candidate.atsScore}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      ATS Score
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeFilter;