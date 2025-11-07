import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Mehta',
      role: 'Student - CSE Batch 2024',
      image: 'https://ui-avatars.com/api/?name=Priya+Mehta&size=128&background=random',
      text: 'The portal made my placement journey so smooth! AI resume parsing helped me optimize my profile, and I got placed at Amazon with a ₹28 LPA package.',
      rating: 5
    },
    {
      name: 'Dr. Rajesh Kumar',
      role: 'HOD - Computer Science',
      image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&size=128&background=random',
      text: 'Managing department approvals became effortless. Real-time analytics help us track placement progress and make data-driven decisions.',
      rating: 5
    },
    {
      name: 'Anita Sharma',
      role: 'Training & Placement Officer',
      image: 'https://ui-avatars.com/api/?name=Anita+Sharma&size=128&background=random',
      text: 'This platform revolutionized our placement process. Automated emails, bulk operations, and comprehensive reports saved us countless hours.',
      rating: 5
    }
  ];

  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            What Our Users Say
          </h2>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Success stories from students, faculty, and placement officers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl transition-all hover:scale-105 shadow-lg"
              style={{ background: 'var(--bg-primary)' }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    {testimonial.name}
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--accent)" stroke="var(--accent)" />
                ))}
              </div>

              <p className="italic" style={{ color: 'var(--text-secondary)' }}>
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
