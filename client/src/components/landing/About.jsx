import { Target, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const pillars = [
    {
      icon: <Target size={32} />,
      title: 'Automation',
      description: 'Reduce manual effort with intelligent automation of placement workflows and notifications.'
    },
    {
      icon: <Users size={32} />,
      title: 'Transparency',
      description: 'Real-time tracking and updates ensure complete visibility for all stakeholders.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Analytics',
      description: 'Data-driven insights to optimize placement strategies and improve outcomes.'
    }
  ];

  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            About Our Platform
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A comprehensive solution designed to revolutionize campus recruitment through 
            automation, transparency, and intelligent analytics.
          </p>
        </div>

        {/* Quote */}
        <div className="max-w-4xl mx-auto mb-16 p-8 rounded-xl border-l-4"
             style={{ 
               background: 'var(--bg-primary)',
               borderColor: 'var(--accent)'
             }}>
          <blockquote className="text-2xl italic" style={{ color: 'var(--text-primary)' }}>
            "Success in placements isn't just about opportunities—it's about the right tools, 
            the right insights, and the right support at the right time."
          </blockquote>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl text-center transition-all hover:scale-105"
              style={{ background: 'var(--bg-primary)' }}
            >
              <div className="inline-flex p-4 rounded-full mb-4"
                   style={{ background: 'var(--accent)', color: 'white' }}>
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                {pillar.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
