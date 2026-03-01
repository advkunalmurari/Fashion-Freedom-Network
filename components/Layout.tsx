import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Users, Search, MessageCircle, ShoppingBag, Compass,
  Briefcase, Globe, Menu, X, ArrowRight, Play, Calendar,
  BookOpen, LogIn, User as UserIcon, ChevronLeft, ChevronRight,
  Camera, Briefcase as BrandIcon, Sparkles, Info, Mail, PlusCircle, BrainCircuit, MoreHorizontal
} from 'lucide-react';
import { LOGO_SVG, BRAND_SOCIALS } from '../constants';
import { CreatePostModal } from './CreatePostModal';
import { SettingsOverlay } from './SettingsOverlay';
import { MobileBottomNav } from './MobileBottomNav';

interface LayoutProps {
  children: React.ReactNode;
  currentUser?: any;
  onLogout?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children, currentUser, onLogout, isDarkMode = false, onToggleDarkMode
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Derive activeTab from pathname (e.g., /home -> home)
  const pathname = location.pathname.substring(1);
  const activeTab = pathname === '' ? 'home' : pathname.split('/')[0];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  if (pathname === 'login' || pathname === 'register-professional') {
    return <>{children}</>;
  }

  const navItems = [
    { id: 'home', icon: Home, label: 'Discover' },
    { id: 'feed', icon: Search, label: 'Feed' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'motion', icon: Play, label: 'Motion' },
    { id: 'trend-lab', icon: BrainCircuit, label: 'Trend Lab' },
    { id: 'directory', icon: Users, label: 'Talent' },
    { id: 'shoots', icon: Camera, label: 'Shoots' },
    { id: 'brands', icon: BrandIcon, label: 'Brands' },
    { id: 'castings', icon: Briefcase, label: 'Castings' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
  ];

  const sidebarVariants = {
    expanded: { width: '260px' },
    collapsed: { width: '80px' }
  };

  const footerLinks = [
    {
      label: 'Company', items: [
        { id: 'about', label: 'About FFN' },
        { id: 'contact', label: 'Contact Us' },
        { id: 'pricing', label: 'Pricing Hub' },
        { id: 'verification', label: 'Identity Verification' }
      ]
    },
    {
      label: 'Support', items: [
        { id: 'faq', label: 'Help & FAQ' },
        { id: 'community-guidelines', label: 'Guidelines' },
        { id: 'journal', label: 'Fashion Journal' }
      ]
    },
    {
      label: 'Legal', items: [
        { id: 'privacy-policy', label: 'Privacy Policy' },
        { id: 'terms-and-conditions', label: 'Terms of Use' },
        { id: 'refund-policy', label: 'Refund Policy' },
        { id: 'cookie-policy', label: 'Cookie Policy' }
      ]
    }
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-ffn-primary selection:text-white flex flex-col lg:flex-row overflow-x-hidden ${isDarkMode ? 'bg-[#0A0A0A] text-white' : 'bg-ffn-bg text-ffn-black'}`}>
      {/* Desktop Sidebar */}
      <motion.aside
        initial="expanded"
        animate={isSidebarCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={`hidden lg:flex flex-col h-screen fixed left-0 top-0 border-r z-[100] transition-colors duration-500 ${isDarkMode ? 'bg-[#121212]/95 border-white/5 backdrop-blur-3xl' : 'bg-white/95 border-gray-100 backdrop-blur-3xl'}`}
      >
        <div className={`flex flex-col h-full ${isSidebarCollapsed ? 'p-4' : 'p-8'}`}>
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center space-x-4 cursor-pointer overflow-hidden" onClick={() => navigate('/')}>
              <motion.div whileHover={{ rotate: 360, scale: 1.1 }} className={`drop-shadow-lg flex-none ${isDarkMode ? 'text-white' : 'text-ffn-black'}`}>{LOGO_SVG}</motion.div>
              {!isSidebarCollapsed && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col leading-none">
                  <span className={`font-serif font-bold text-2xl tracking-tighter ${isDarkMode ? 'text-white' : 'text-ffn-black'}`}>ffn</span>
                  <span className={`text-[6px] uppercase tracking-[0.4em] mt-1 font-black whitespace-nowrap ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Identity Hub</span>
                </motion.div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button onClick={() => setIsSidebarCollapsed(true)} className={`p-2 rounded-xl transition-colors focus:outline-none ${isDarkMode ? 'text-white/20 hover:text-white' : 'text-gray-400 hover:text-ffn-black'}`}><ChevronLeft className="w-5 h-5" /></button>
            )}
          </div>

          {currentUser && (
            <motion.button
              onClick={() => setIsCreateModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`mb-8 flex items-center shadow-xl hover:bg-ffn-primary transition-all overflow-hidden ${isDarkMode ? 'bg-white text-black border border-white/10' : 'bg-ffn-black text-white'} ${isSidebarCollapsed ? 'p-3 justify-center' : 'p-4 space-x-4'}`}
            >
              <PlusCircle className="w-5 h-5 flex-none" />
              {!isSidebarCollapsed && <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">Create Mastery</span>}
            </motion.button>
          )}

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-2 pb-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate('/' + item.id)}
                className={`flex items-center w-full text-left p-3 rounded-2xl transition-all relative group focus:outline-none
                  ${isSidebarCollapsed ? 'justify-center' : 'space-x-4'}
                  ${activeTab === item.id
                    ? (isDarkMode ? 'text-white font-bold shadow-xl' : 'bg-ffn-black text-white font-bold shadow-xl')
                    : (isDarkMode ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-ffn-black')}`}
              >
                {activeTab === item.id && (
                  <motion.div layoutId="activeTab" className={`absolute inset-0 rounded-2xl -z-10 ${isDarkMode ? 'bg-white/10' : 'bg-ffn-black'}`} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                <item.icon className={`w-4 h-4 transition-all duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:text-ffn-primary'}`} />
                {!isSidebarCollapsed && <span className="text-[8px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className={`mt-4 space-y-3 pt-6 border-t overflow-hidden ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center w-full text-left p-3 rounded-2xl transition-all group focus:outline-none ${isDarkMode ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-ffn-black'} ${isSidebarCollapsed ? 'justify-center' : 'space-x-4'}`}
            >
              <MoreHorizontal className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              {!isSidebarCollapsed && <span className="text-[8px] font-bold uppercase tracking-[0.2em]">More</span>}
            </button>

            {currentUser ? (
              <button onClick={() => navigate('/my-profile')} className={`flex items-center w-full text-left rounded-2xl transition-all border focus:outline-none ${isSidebarCollapsed ? 'p-2 justify-center' : 'p-3 space-x-3'} ${activeTab === 'my-profile' ? (isDarkMode ? 'bg-white text-black border-white shadow-xl' : 'bg-ffn-black text-white border-ffn-black shadow-xl') : (isDarkMode ? 'bg-white/5 border-transparent text-white' : 'bg-gray-50 border-transparent text-ffn-black')}`}>
                <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-white/10 shadow-sm flex-none">
                  {currentUser.user_metadata?.avatar_url ? (
                    <img src={currentUser.user_metadata.avatar_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-ffn-primary flex items-center justify-center text-white text-[10px] font-bold">
                      {currentUser.email?.[0].toUpperCase()}
                    </div>
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex flex-col leading-tight overflow-hidden">
                    <span className={`text-[8px] font-bold uppercase tracking-widest truncate ${isDarkMode && activeTab !== 'my-profile' ? 'text-white' : ''}`}>
                      {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                    </span>
                    <span className={`text-[6px] uppercase font-black ${isDarkMode && activeTab !== 'my-profile' ? 'text-white/40' : 'text-gray-400'}`}>Identity Ready</span>
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className={`flex items-center w-full text-left rounded-2xl transition-all shadow-2xl group relative overflow-hidden focus:outline-none ${isDarkMode ? 'bg-white text-white border border-white/10' : 'bg-ffn-black text-white'} ${isSidebarCollapsed ? 'p-2 justify-center h-12' : 'p-4 space-x-3'}`}
              >
                <LogIn className="w-4 h-4 relative z-10" />
                {!isSidebarCollapsed && (
                  <div className="flex flex-col leading-tight relative z-10">
                    <span className="text-[9px] font-bold uppercase tracking-[0.1em]">Entry Protocol</span>
                    <span className="text-[6px] uppercase font-black opacity-40">Secure Login</span>
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      <SettingsOverlay
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onNavigate={(route) => navigate('/' + route)}
        onLogout={onLogout || (() => { })}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode || (() => { })}
      />

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreatePostModal
            onClose={() => setIsCreateModalOpen(false)}
            onPostCreated={(post) => {
              setIsCreateModalOpen(false);
              navigate('/feed');
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <motion.main
          animate={{ marginLeft: isSidebarCollapsed ? '80px' : '260px', paddingTop: '160px' }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 min-h-screen relative lg:block hidden overflow-y-auto no-scrollbar pb-10"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
                {children}
              </motion.div>
            </AnimatePresence>

            <footer className={`mt-64 pb-20 border-t pt-32 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10">{LOGO_SVG}</div>
                    <span className={`font-serif font-bold text-2xl tracking-tighter ${isDarkMode ? 'text-white' : 'text-ffn-black'}`}>ffn</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-light italic">
                    The global identity infrastructure for the modern fashion professional. Elevating talent through visual sovereignty.
                  </p>
                </div>
                {footerLinks.map((column) => (
                  <div key={column.label} className="space-y-8">
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-white/50' : 'text-ffn-black'}`}>{column.label}</h4>
                    <nav className="flex flex-col space-y-4">
                      {column.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { navigate('/' + item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="text-left text-[11px] font-bold text-gray-400 hover:text-ffn-primary uppercase tracking-widest transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            </footer>
          </div>
        </motion.main>
      </div>

      <header className={`lg:hidden w-full h-24 border-b flex items-center justify-between px-8 fixed top-0 backdrop-blur-3xl z-[200] shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-[#0A0A0A]/95 border-white/5' : 'bg-white/95 border-gray-50'}`}>
        <div onClick={() => navigate('/')} className="flex items-center space-x-4"><div className="w-10 h-10 drop-shadow-md">{LOGO_SVG}</div><div className="flex flex-col leading-none"><span className={`font-serif font-bold text-2xl tracking-tighter ${isDarkMode ? 'text-white' : 'text-ffn-black'}`}>ffn</span><span className={`text-[6px] uppercase tracking-[0.6em] font-black ${isDarkMode ? 'text-white/40' : 'text-ffn-steel'}`}>Identity Lab</span></div></div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsSettingsOpen(true)} className={`p-2 transition-colors ${isDarkMode ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-ffn-primary'}`}><MoreHorizontal className="w-5 h-5" /></button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-3.5 rounded-2xl transition-colors focus:outline-none ${isDarkMode ? 'text-white bg-white/5' : 'text-ffn-black bg-gray-50'}`}>{isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed inset-0 z-[150] pt-28 pb-32 overflow-y-auto lg:hidden ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-white'}`}
          >
            <div className="px-8 space-y-6">
              {currentUser && (
                <button
                  onClick={() => { setIsCreateModalOpen(true); setIsMobileMenuOpen(false); }}
                  className={`w-full py-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg ${isDarkMode ? 'bg-white text-black' : 'bg-ffn-black text-white'}`}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">Create Mastery</span>
                </button>
              )}

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { navigate('/' + item.id); setIsMobileMenuOpen(false); }}
                    className={`flex items-center w-full p-4 rounded-xl transition-all ${activeTab === item.id
                      ? (isDarkMode ? 'bg-white/10 text-white font-bold' : 'bg-gray-100 text-ffn-black font-bold')
                      : (isDarkMode ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-ffn-black')
                      }`}
                  >
                    <item.icon className={`w-5 h-5 mr-4 ${activeTab === item.id ? 'text-ffn-primary' : ''}`} />
                    <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className={`pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                {currentUser ? (
                  <button
                    onClick={() => { navigate('/my-profile'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between w-full p-4 rounded-xl ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-50 text-ffn-black'}`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                        {currentUser.user_metadata?.avatar_url ? (
                          <img src={currentUser.user_metadata.avatar_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full bg-ffn-primary flex items-center justify-center text-white font-bold">
                            {currentUser.email?.[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold uppercase tracking-widest truncate max-w-[150px]">{currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}</div>
                        <div className="text-[10px] uppercase font-black text-ffn-primary mt-1">View Profile</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50" />
                  </button>
                ) : (
                  <button
                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-center w-full p-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-white text-black' : 'bg-ffn-black text-white'}`}
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    <span className="font-bold uppercase tracking-widest text-xs">Login</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="lg:hidden flex-1 min-h-screen relative pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        isDarkMode={isDarkMode}
        onCreatePost={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
};
