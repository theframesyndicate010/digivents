import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fetchAllClients } from '../data/clientsApi';
import ClientModal from './ClientModal';

const BrandPartners = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clientsScroller = useRef(null);
  const resumeAutoScroll = useRef(null);

  useEffect(() => {
    fetchAllClients()
      .then((data) => setClients(data))
      .catch((err) => console.error('Failed to fetch clients:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || clients.length < 2) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const scroller = clientsScroller.current;
    if (!scroller) return undefined;

    const interval = window.setInterval(() => {
      if (scroller.dataset.userInteracting || scroller.matches(':hover') || scroller.contains(document.activeElement)) return;
      const loopPoint = scroller.scrollWidth / 2;
      if (loopPoint > 0 && scroller.scrollLeft >= loopPoint) {
        scroller.scrollLeft = 0;
      } else {
        scroller.scrollLeft += 0.6;
      }
    }, 16);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(resumeAutoScroll.current);
    };
  }, [clients, loading]);

  const pauseAutoScroll = () => {
    const scroller = clientsScroller.current;
    if (scroller) scroller.dataset.userInteracting = 'true';
    window.clearTimeout(resumeAutoScroll.current);
    resumeAutoScroll.current = window.setTimeout(() => {
      if (scroller) delete scroller.dataset.userInteracting;
    }, 2500);
  };

  const slideClients = (direction) => {
    pauseAutoScroll();
    clientsScroller.current?.scrollBy({ left: direction * 280, behavior: 'smooth' });
  };

  return (
    <section className="py-16 border-y border-white/10 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="whitespace-nowrap text-center text-white/40 text-sm uppercase tracking-widest mb-10"
        >
          Trusted by Our Valued Clients
        </motion.p>

        <div className="relative" aria-label="Our clients" role="region">
          {loading ? (
            <div className="flex w-max animate-pulse items-center gap-12 whitespace-nowrap">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex shrink-0 items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/10" />
                  <div className="h-3 w-20 rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : clients.length > 0 ? (
            <div
              ref={clientsScroller}
              className="flex snap-x snap-mandatory overflow-x-auto touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onTouchStart={pauseAutoScroll}
              onPointerDown={pauseAutoScroll}
              onWheel={pauseAutoScroll}
              onMouseEnter={pauseAutoScroll}
              onMouseLeave={() => {
                window.clearTimeout(resumeAutoScroll.current);
                if (clientsScroller.current) delete clientsScroller.current.dataset.userInteracting;
              }}
            >
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex shrink-0 snap-start items-center gap-12 pr-12 md:gap-16 md:pr-16"
                  aria-hidden={copy === 1}
                >
                  {clients.map((client) => (
                    <motion.button
                      type="button"
                      key={`${copy}-${client.id}`}
                      whileHover={{ opacity: 1, scale: 1.1, y: -3 }}
                      onClick={() => {
                        setSelectedClient(client);
                        setIsModalOpen(true);
                      }}
                      tabIndex={copy === 1 ? -1 : 0}
                      className="group flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap border-0 bg-transparent opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-accent2"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 transition-colors group-hover:bg-white/20">
                        {client.logo ? (
                          <img src={client.logo} alt="" className="h-5 w-5 object-contain" />
                        ) : (
                          <span className="text-sm font-bold text-white">{client.name.charAt(0)}</span>
                        )}
                      </span>
                      <span className="text-sm font-medium text-white">{client.name}</span>
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
          {!loading && clients.length > 0 && (
            <div className="absolute -top-12 right-0 hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => slideClients(-1)}
                aria-label="Previous clients"
                className="rounded-full border border-white/20 p-2 text-white/70 transition hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => slideClients(1)}
                aria-label="Next clients"
                className="rounded-full border border-white/20 p-2 text-white/70 transition hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent2"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
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
