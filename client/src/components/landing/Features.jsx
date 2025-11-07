import { Brain, Mail, Activity, BarChart3, Users, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: <Brain size={32} />,
      title: 'AI-Powered Resume Parsing',
      description: 'Automatically extract skills, experience, and qualifications with advanced NLP and ATS scoring.',
      color: '#8B5CF6'
    },
    {
      icon: <Mail size={32} />,
      title: 'Automated Email Notifications',
      description: 'Smart email workflows with AI-generated templates for every stage of recruitment.',
      color: '#3B82F6'
    },
    {
      icon: <Activity size={32} />,
      title: 'Real-Time Tracking',
      description: 'Live status updates and application tracking for students, HODs, and TPO.',
      color: '#10B981'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Comprehensive Analytics',
      description: 'Detailed reports and insights on placements, packages, and company statistics.',
      color: '#F59E0B'
    },
    {
      icon: <Users size={32} />,
      title: 'Role-Based Dashboards',
      description: 'Customized interfaces for students, HODs, and TPO with role-specific features.',
      color: '#EF4444'
    },
    {
      icon: <FileCheck size={32} />,
      title: 'Job-Fit Analysis',
      description: 'AI-driven matching between student profiles and job descriptions for better placements.',
      color: '#EC4899'
    }
  ];

  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Powerful Features
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to manage campus placements efficiently and effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl"
              style={{ background: 'var(--bg-primary)' }}
            >
              <div 
                className="inline-flex p-3 rounded-lg mb-4"
                style={{ background: feature.color, color: 'white' }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
