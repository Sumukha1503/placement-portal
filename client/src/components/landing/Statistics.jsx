import { useState, useEffect } from 'react';
import { Users, Briefcase, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Statistics = () => {
  const [counts, setCounts] = useState({
    students: 0,
    companies: 0,
    avgPackage: 0,
    highestPackage: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targets = {
      students: 850,
      companies: 120,
      avgPackage: 7.5,
      highestPackage: 45
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounts(prev => {
        const newCounts = {};
        let allReached = true;

        Object.keys(targets).forEach(key => {
          const target = targets[key];
          const current = prev[key];
          const increment = target / steps;

          if (current < target) {
            newCounts[key] = Math.min(current + increment, target);
            allReached = false;
          } else {
            newCounts[key] = target;
          }
        });

        if (allReached) clearInterval(timer);
        return newCounts;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: <Users size={40} />,
      value: `${Math.round(counts.students)}+`,
      label: 'Students Placed',
      color: '#3B82F6'
    },
    {
      icon: <Briefcase size={40} />,
      value: `${Math.round(counts.companies)}+`,
      label: 'Partner Companies',
      color: '#10B981'
    },
    {
      icon: <TrendingUp size={40} />,
      value: `₹${counts.avgPackage.toFixed(1)} LPA`,
      label: 'Average Package',
      color: '#F59E0B'
    },
    {
      icon: <Award size={40} />,
      value: `₹${Math.round(counts.highestPackage)} LPA`,
      label: 'Highest Package',
      color: '#EF4444'
    }
  ];

  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Our Success in Numbers
          </h2>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Real results from our placement management platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl text-center transition-all hover:scale-105 shadow-lg"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div className="inline-flex p-4 rounded-full mb-4"
                   style={{ background: stat.color, color: 'white' }}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {stat.value}
              </div>
              <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highest Package Achiever Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto p-8 rounded-2xl shadow-2xl"
          style={{ 
            background: 'linear-gradient(135deg, var(--accent) 0%, #6366F1 100%)',
            color: 'white'
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img 
                src="https://ui-avatars.com/api/?name=Rahul+Sharma&size=128&background=random" 
                alt="Top achiever"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm font-semibold mb-2 opacity-90">
                🏆 HIGHEST PACKAGE ACHIEVER 2025
              </div>
              <h3 className="text-3xl font-bold mb-2">Rahul Sharma</h3>
              <p className="text-lg opacity-90 mb-4">
                Computer Science Engineering | Batch 2025
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://logo.clearbit.com/google.com" 
                    alt="Google"
                    className="w-8 h-8 rounded bg-white p-1"
                  />
                  <span className="font-semibold">Google</span>
                </div>
                <div className="text-2xl font-bold">₹45 LPA</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;
