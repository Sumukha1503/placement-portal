import { useState, useEffect } from 'react';
import { Search, Edit2, Eye, Download } from 'lucide-react';
import api from '../../services/api';

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, filter, students]);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/api/hod/students');
      setStudents(res.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(student => student.placementStatus === filter);
    }

    setFilteredStudents(filtered);
  };

  const handleEdit = async (studentId, updatedData) => {
    try {
      await api.put(`/api/hod/students/${studentId}`, updatedData);
      alert('Student profile updated successfully');
      fetchStudents();
      setEditingStudent(null);
    } catch (error) {
      alert('Error updating student profile');
    }
  };

  const handleExportData = async () => {
    try {
      // Call the API to generate and download the export
      const response = await api.get('/api/hod/students/export', { 
        responseType: 'blob' // Important for downloading files
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students-export.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
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
          Department Students
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          View and manage student profiles
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
            placeholder="Search by name or roll number..."
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

        {/* Status Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 rounded-lg border"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="all">All Students</option>
          <option value="unplaced">Unplaced</option>
          <option value="placed">Placed</option>
          <option value="opted-out">Opted Out</option>
        </select>

        {/* Export Button */}
        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          <Download size={18} />
          Export Data
        </button>
      </div>

      {/* Students Table */}
      <div className="rounded-xl overflow-hidden border" 
           style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Roll Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  CGPA
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Batch
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student._id} 
                    className="border-t"
                    style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {student.userId?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                    {student.cgpa}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {student.batch}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: student.placementStatus === 'placed' ? 'var(--success)' + '20' :
                                       student.placementStatus === 'unplaced' ? 'var(--warning)' + '20' :
                                       'var(--text-secondary)' + '20',
                            color: student.placementStatus === 'placed' ? 'var(--success)' :
                                  student.placementStatus === 'unplaced' ? 'var(--warning)' :
                                  'var(--text-secondary)'
                          }}>
                      {student.placementStatus?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded transition-all hover:scale-110"
                        style={{ background: 'var(--accent)' + '20', color: 'var(--accent)' }}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="p-2 rounded transition-all hover:scale-110"
                        style={{ background: 'var(--warning)' + '20', color: 'var(--warning)' }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text-secondary)' }}>
              No students found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full p-6 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Edit Student Profile
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue={editingStudent.cgpa}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{
                    background: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                  id="edit-cgpa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Placement Status
                </label>
                <select
                  defaultValue={editingStudent.placementStatus}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{
                    background: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                  id="edit-status"
                >
                  <option value="unplaced">Unplaced</option>
                  <option value="placed">Placed</option>
                  <option value="opted-out">Opted Out</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const cgpa = parseFloat(document.getElementById('edit-cgpa').value);
                    const status = document.getElementById('edit-status').value;
                    handleEdit(editingStudent._id, { cgpa, placementStatus: status });
                  }}
                  className="flex-1 py-2 rounded-lg font-medium"
                  style={{ background: 'var(--success)', color: 'white' }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="flex-1 py-2 rounded-lg font-medium"
                  style={{ background: 'var(--error)', color: 'white' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;