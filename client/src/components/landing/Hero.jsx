import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 opacity-50"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
               style={{ 
                 background: 'var(--bg-secondary)',
                 borderColor: 'var(--border)'
               }}>
            <Sparkles size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              AI-Powered Placement Management
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              style={{ color: 'var(--text-primary)' }}>
            Empowering Campus Placements with{' '}
            <span style={{ color: 'var(--accent)' }}>
              AI-Driven Solutions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
             style={{ color: 'var(--text-secondary)' }}>
            Streamline recruitment, automate workflows, and achieve 
            better placement outcomes with intelligent automation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
              style={{ 
                background: 'var(--accent)',
                color: 'white'
              }}
            >
              Get Started
              <ArrowRight size={20} />
            </Link>
            
            <Link 
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg border transition-all hover:scale-105"
              style={{ 
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Floating Animation Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-20 h-20 rounded-full opacity-20"
          style={{ background: 'var(--accent)' }}
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-10 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'var(--accent)' }}
        />
      </div>
    </section>
  );
};

export default Hero;
