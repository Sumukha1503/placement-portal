import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 border-b" style={{ 
      background: 'var(--bg-primary)',
      borderColor: 'var(--border)'
    }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
          Placement Portal
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                to={`/${user.role}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <User size={18} />
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{ background: 'var(--error)', color: 'white' }}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="px-4 py-2 rounded-lg transition-colors"
                style={{ background: 'var(--bg-secondary)' }}
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="px-4 py-2 rounded-lg transition-colors"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
