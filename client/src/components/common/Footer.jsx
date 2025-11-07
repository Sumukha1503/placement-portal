import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t" 
            style={{ 
              background: 'var(--bg-primary)',
              borderColor: 'var(--border)'
            }}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>
              Placement Portal
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Empowering campus placements with AI-driven solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Home</Link></li>
              <li><Link to="/about" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>About</Link></li>
              <li><Link to="/features" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Features</Link></li>
              <li><Link to="/contact" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Contact</Link></li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              For Students
            </h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Register</Link></li>
              <li><Link to="/login" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Login</Link></li>
              <li><Link to="/drives" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>Active Drives</Link></li>
              <li><Link to="/faq" className="hover:underline" style={{ color: 'var(--text-secondary)' }}>FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Connect With Us
            </h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full transition-all hover:scale-110"
                 style={{ background: 'var(--bg-secondary)' }}>
                <Github size={20} style={{ color: 'var(--text-primary)' }} />
              </a>
              <a href="#" className="p-2 rounded-full transition-all hover:scale-110"
                 style={{ background: 'var(--bg-secondary)' }}>
                <Linkedin size={20} style={{ color: 'var(--text-primary)' }} />
              </a>
              <a href="#" className="p-2 rounded-full transition-all hover:scale-110"
                 style={{ background: 'var(--bg-secondary)' }}>
                <Twitter size={20} style={{ color: 'var(--text-primary)' }} />
              </a>
              <a href="#" className="p-2 rounded-full transition-all hover:scale-110"
                 style={{ background: 'var(--bg-secondary)' }}>
                <Mail size={20} style={{ color: 'var(--text-primary)' }} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t text-center" style={{ borderColor: 'var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            © 2025 College Placement Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
