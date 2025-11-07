import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Building, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    rollNumber: '',
    batch: '',
    cgpa: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(formData);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8 p-8 rounded-xl shadow-lg" 
           style={{ background: 'var(--bg-secondary)' }}>
        <div>
          <h2 className="text-3xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
            Create Account
          </h2>
          <p className="mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>
            Join the placement portal
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg" 
               style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ 
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ 
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ 
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{ 
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="student">Student</option>
                <option value="hod">HOD</option>
                <option value="tpo">TPO</option>
              </select>
            </div>

            {formData.role !== 'tpo' && (
              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required={formData.role !== 'tpo'}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{ 
                    background: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            )}

            {formData.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ 
                      background: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Batch (Year)</label>
                  <input
                    type="number"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ 
                      background: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ 
                      background: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ 
                      background: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
