import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchAllClients } from '../data/clientsApi';
import ClientModal from './ClientModal';

const BrandPartners = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllClients()
      .then((data) => setClients(data))
      .catch((err) => console.error('Failed to fetch clients:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 border-y border-white/10 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-white/40 text-sm uppercase tracking-widest mb-10"
        >
          Trusted by Our Valued Clients
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 animate-pulse">
                  <div className="w-8 h-8 bg-white/10 rounded-lg" />
                  <div className="h-3 w-20 bg-white/10 rounded" />
                </div>
              ))
            : clients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 0.4, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    opacity: 1,
                    scale: 1.1,
                    y: -5,
                    transition: { duration: 0.3 },
                  }}
                  onClick={() => {
                    setSelectedClient(client);
                    setIsModalOpen(true);
                  }}
                  className="group flex items-center gap-2 cursor-pointer"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors"
                  >
                    {client.logo ? (
                      <img src={client.logo} alt={client.name} className="w-5 h-5 object-contain" />
                    ) : (
                      <span className="text-white font-bold text-sm">{client.name.charAt(0)}</span>
                    )}
                  </motion.div>
                  <span className="text-white font-medium text-sm">{client.name}</span>
                </motion.div>
              ))}
        </div>
      </div>
      
      <ClientModal 
        client={selectedClient} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default BrandPartners;
