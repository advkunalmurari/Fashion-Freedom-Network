
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Globe, MapPin, Building2, ExternalLink, Search, Filter, X } from 'lucide-react';
import { MOCK_BRANDS } from '../constants';

export const Brands: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  const industries = useMemo(() => {
    const unique = new Set(MOCK_BRANDS.map(b => b.industry).filter(Boolean));
    return ['All Industries', ...Array.from(unique)];
  }, []);

  const locations = useMemo(() => {
    const unique = new Set(MOCK_BRANDS.map(b => b.location).filter(Boolean));
    return ['All Locations', ...Array.from(unique)];
  }, []);

  const filteredBrands = useMemo(() => {
    return MOCK_BRANDS.filter(brand => {
      const matchesSearch = brand.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = industryFilter === 'All Industries' || brand.industry === industryFilter;
      const matchesLocation = locationFilter === 'All Locations' || brand.location === locationFilter;
      return matchesSearch && matchesIndustry && matchesLocation;
    });
  }, [searchQuery, industryFilter, locationFilter]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-3 text-ffn-primary">
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Industry Hiring Network</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-ffn-black">The Brands</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/brand-dashboard')} className="px-12 py-5 bg-ffn-black text-white rounded-[2rem] text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-ffn-primary transition-all">Brand Portal Login</button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white/50 backdrop-blur-md sticky top-24 z-30 p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands by name or vision..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-ffn-primary/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              title="Clear search"
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            title="Filter by Industry"
            aria-label="Filter by Industry"
            className="flex-1 md:flex-none appearance-none px-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[10px] font-bold uppercase tracking-wider focus:ring-2 focus:ring-ffn-primary/20 cursor-pointer"
          >
            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            title="Filter by Location"
            aria-label="Filter by Location"
            className="flex-1 md:flex-none appearance-none px-6 py-4 bg-gray-50/50 border-none rounded-2xl text-[10px] font-bold uppercase tracking-wider focus:ring-2 focus:ring-ffn-primary/20 cursor-pointer"
          >
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <AnimatePresence mode="popLayout">
          {filteredBrands.map((brand) => (
            <motion.div
              key={brand.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[3.5rem] p-12 border border-gray-50 shadow-xl group hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-ffn-primary/5 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-start gap-10 relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center p-6 shadow-inner shrink-0 ring-1 ring-gray-100 group-hover:ring-ffn-primary/20 transition-all">
                  <img src={brand.logo_url} className="w-full grayscale group-hover:grayscale-0 transition-all duration-500" alt={brand.brand_name} />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-4xl font-serif italic text-ffn-black group-hover:text-ffn-primary transition-colors">{brand.brand_name}</h3>
                      <button title="Visit Website" className="text-gray-300 hover:text-ffn-primary transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest font-black text-ffn-primary/60 bg-ffn-primary/5 px-3 py-1 rounded-full">
                        {brand.industry}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {brand.location}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-3">{brand.description}</p>
                  <div className="pt-6 flex gap-4">
                    <button
                      onClick={() => navigate(`/brands/${brand.id}`)}
                      className="flex-1 px-8 py-5 bg-ffn-black text-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.4em] shadow-lg hover:bg-ffn-primary transition-all active:scale-95"
                    >
                      View Brand Profile
                    </button>
                    <button title="View Global Presence" className="p-5 border border-gray-100 rounded-2xl text-gray-400 hover:text-ffn-black hover:bg-gray-50 transition-all">
                      <Globe className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredBrands.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-32 text-center space-y-4"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-2xl font-serif italic text-gray-400">No brands found matching your criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setIndustryFilter('All Industries');
                setLocationFilter('All Locations');
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-ffn-primary hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>

      <section className="bg-ffn-black text-white rounded-[5rem] p-24 text-center space-y-12 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-tr from-ffn-primary/10 via-transparent to-ffn-accent/10"></div>
        <h2 className="text-6xl md:text-8xl font-serif italic tracking-tighter relative z-10 leading-none">Global <br /> <span className="text-gradient-vibrant font-bold not-italic">Scouting Hub.</span></h2>
        <p className="max-w-xl mx-auto text-white/40 font-light text-xl italic relative z-10">Our ecosystem connects elite talent directly with casting directors from Paris to New York.</p>
        <div className="pt-10 relative z-10"><button className="px-16 py-8 bg-white text-ffn-black rounded-[2.5rem] text-xs font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-ffn-primary hover:text-white transition-all">Partnership Protocol</button></div>
      </section>
    </div>
  );
};
