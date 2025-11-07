import { motion } from 'framer-motion';

const TopCompanies = () => {
  const companies = [
    { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
    { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com' },
    { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com' },
    { name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com' },
    { name: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com' },
    { name: 'Salesforce', logo: 'https://logo.clearbit.com/salesforce.com' },
    { name: 'Oracle', logo: 'https://logo.clearbit.com/oracle.com' },
    { name: 'IBM', logo: 'https://logo.clearbit.com/ibm.com' },
    { name: 'Intel', logo: 'https://logo.clearbit.com/intel.com' },
    { name: 'Cisco', logo: 'https://logo.clearbit.com/cisco.com' }
  ];

  return (
    <section className="py-20 px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Top Recruiting Companies
          </h2>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Trusted by leading organizations worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex items-center justify-center p-6 rounded-xl transition-all hover:scale-110 grayscale hover:grayscale-0"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <img 
                src={company.logo} 
                alt={company.name}
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${company.name}&size=80&background=random`;
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;
