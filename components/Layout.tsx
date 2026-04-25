import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Users, Search, MessageCircle, ShoppingBag, Compass,
  Briefcase, Globe, Menu, X, ArrowRight, Play, Calendar,
  BookOpen, LogIn, User as UserIcon, ChevronLeft, ChevronRight,
  Camera, Briefcase as BrandIcon, Sparkles, Info, Mail, PlusCircle, BrainCircuit, MoreHorizontal
} from 'lucide-react';
import { BRAND_SOCIALS } from '../constants';
import { Logo } from './icons/Logo';
import { ContentStudio } from './ContentStudio';
import { SettingsOverlay } from './SettingsOverlay';
import { MobileBottomNav } from './MobileBottomNav';
import { NotificationCenter } from './NotificationCenter';
import { MagneticButton } from './MagneticButton';
import { Newspaper, Command } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { GlobalSearchOverlay } from './GlobalSearchOverlay';

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
  const activeTab = location.pathname.substring(1).split('/')?.[0] || 'discover';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  if (location.pathname.substring(1) === 'login' || location.pathname.substring(1) === 'register-professional') {
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
    { id: 'collabs', icon: Users, label: 'Collabs' },
    { id: 'press', icon: Newspaper, label: 'Press Room' },
    { id: 'inbox', icon: MessageCircle, label: 'Inbox' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { id: 'agency-dashboard', icon: Briefcase, label: 'Agency Hub', role: 'AGENCY' },
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
      <m.aside
        initial="expanded"
        animate={isSidebarCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className={`hidden lg:flex flex-col h-screen fixed left-0 top-0 border-r z-[100] transition-colors duration-500 ${isDarkMode ? 'bg-[#121212]/95 border-white/5 backdrop-blur-3xl' : 'bg-white/95 border-gray-100 backdrop-blur-3xl'}`}
      >
        <div className={`flex flex-col h-full ${isSidebarCollapsed ? 'p-4' : 'p-8'}`}>
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center space-x-4 cursor-pointer overflow-hidden" onClick={() => navigate('/')}>
              <m.div whileHover={{ rotate: 360, scale: 1.1 }} className={`drop-shadow-lg flex-none ${isDarkMode ? 'text-white' : 'text-ffn-black'}`} aria-hidden="true">
                <Logo />
              </m.div>
              {!isSidebarCollapsed && (
                <m.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col leading-none">
                  <span className={`font-serif font-bold text-2xl tracking-tighter ${isDarkMode ? 'text-white' : 'text-ffn-black'}`}>ffn</span>
                  <span className={`text-[6px] uppercase tracking-[0.4em] mt-1 font-black whitespace-nowrap ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Identity Hub</span>
                </m.div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                title="Collapse Sidebar"
                className={`p-2 rounded-xl transition-colors focus:outline-none ${isDarkMode ? 'text-white/20 hover:text-white' : 'text-gray-400 hover:text-ffn-black'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

          </div>

          {currentUser && (
            <MagneticButton strength={0.2} className="w-full">
              <m.button
                onClick={() => setIsCreateModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mb-8 flex items-center shadow-xl hover:bg-ffn-primary transition-all overflow-hidden w-full ${isDarkMode ? 'bg-white text-black border border-white/10' : 'bg-ffn-black text-white'} ${isSidebarCollapsed ? 'p-3 justify-center' : 'p-4 space-x-4'}`}
              >
                <PlusCircle className="w-5 h-5 flex-none" />
                {!isSidebarCollapsed && <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">Create Mastery</span>}
              </m.button>
            </MagneticButton>
          )}

          <div className="mb-8">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search the network"
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group focus:outline-none ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 hover:text-ffn-black'}`}
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-4'}`}>
                <Search className="w-5 h-5 group-hover:text-ffn-primary transition-colors" />
                {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Global Search</span>}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-black/10 border border-white/5">
                  <Command className="w-3 h-3" />
                  <span className="text-[10px] font-black">K</span>
                </div>
              )}
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pr-2 pb-6">
            {navItems
              .filter(item => !item.role || (currentUser?.user_metadata?.role === item.role))
              .map((item) => (
                <MagneticButton key={item.id} strength={0.15} className="w-full">
                  <button
                    onClick={() => navigate('/' + item.id)}
                    className={`flex items-center w-full text-left p-3 rounded-2xl transition-all relative group focus:outline-none
                    ${isSidebarCollapsed ? 'justify-center' : 'space-x-4'}
                    ${activeTab === item.id
                        ? (isDarkMode ? 'text-white font-bold shadow-xl' : 'bg-ffn-black text-white font-bold shadow-xl')
                        : (isDarkMode ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-ffn-black')}`}
                  >
                    {activeTab === item.id && (
                      <m.div layoutId="activeTab" className={`absolute inset-0 rounded-2xl -z-10 ${isDarkMode ? 'bg-white/10' : 'bg-ffn-black'}`} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                    <item.icon className={`w-4 h-4 transition-all duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:text-ffn-primary'}`} />
                    {!isSidebarCollapsed && <span className="text-[8px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">{item.label}</span>}
                  </button>
                </MagneticButton>
              ))}
          </nav>

          {/* Notification bell */}
          {currentUser && (
            <div className="mb-3">
              <NotificationCenter isDarkMode={isDarkMode} isSidebarCollapsed={isSidebarCollapsed} />
            </div>
          )}

          <div className={`mt-4 space-y-3 pt-6 border-t overflow-hidden ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="More options"
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
                      {currentUser.user_metadata?.full_name || currentUser.email?.split('@')?.[0]}
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
      </m.aside>

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
          <ContentStudio
            onClose={() => setIsCreateModalOpen(false)}
            onPublished={(content) => {
              setIsCreateModalOpen(false);
              navigate('/feed');
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <m.main
          animate={{ marginLeft: isSidebarCollapsed ? '80px' : '260px', paddingTop: '160px' }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 min-h-screen relative lg:block hidden overflow-y-auto no-scrollbar pb-10"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <AnimatePresence mode="wait">
              <m.div key={activeTab} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }}>
                {children}
              </m.div>
            </AnimatePresence>

            <footer className={`mt-64 pb-20 border-t pt-32 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10"><Logo /></div>
                    <span className={`font-serif font-bold text-2xl tracking-tighter ${isDarkMode ? 'text-white' : 'text-ffn-black'}`}>ffn</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-light italic">
                    The global identity infrastructure for the modern fashion professional. Elevating talent through visual sovereignty.
                  </p>
                  <p className="text-gray-500 text-[10px] leading-relaxed max-w-xs font-medium uppercase tracking-wider">
                    Managed by Kalantara Productions India Private Limited
                  </p>
                  <p className="text-gray-500 text-[9px] leading-relaxed max-w-xs font-light">
                    D-64, MB Block, Bhagya Vihar, Rani Khera, Delhi-110081
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
        </m.main>
      </div>

      <header className={`lg:hidden w-full h-24 border-b flex items-center justify-between px-8 fixed top-0 backdrop-blur-[40px] z-[200] transition-colors duration-500 bg-[#050505]/90 border-white/5 shadow-2xl`}>

        <div onClick={() => navigate('/')} className="flex items-center space-x-4"><div className="w-10 h-10 drop-shadow-md"><Logo /></div><div className="flex flex-col leading-none"><span className={`font-serif font-bold text-2xl tracking-tighter ${isDarkMode ? 'text-white' : 'text-ffn-black'}`}>ffn</span><span className={`text-[6px] uppercase tracking-[0.6em] font-black ${isDarkMode ? 'text-white/40' : 'text-ffn-steel'}`}>Identity Lab</span></div></div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <GlobalSearch isDarkMode={isDarkMode} />
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Open System Protocol"
            className={`p-2 transition-colors ${isDarkMode ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-ffn-primary'}`}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title={isMobileMenuOpen ? "Close Network Menu" : "Open Network Menu"}
            className={`p-3.5 rounded-[1.2rem] transition-all duration-500 focus:outline-none ${isDarkMode ? 'text-white bg-white/5 border border-white/10' : 'text-ffn-black bg-gray-50 border border-black/5'}`}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className={`fixed inset-0 z-[150] lg:hidden flex flex-col bg-[#050505]/60`}
          >
            <div className="flex-1 overflow-y-auto no-scrollbar pt-32 pb-40 px-8">
              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">Network Navigation</h2>
                  <h1 className="text-5xl font-serif italic text-white leading-none">Global Pulse</h1>
                </div>

                {currentUser && (
                  <m.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => { setIsCreateModalOpen(true); setIsMobileMenuOpen(false); }}
                    className="w-full py-6 rounded-[2rem] flex items-center justify-center space-x-3 bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span className="font-black uppercase tracking-[0.2em] text-[10px]">Initialize Mastery</span>
                  </m.button>
                )}

                <nav className="space-y-1">
                  {navItems.map((item, idx) => (
                    <m.button
                      key={item.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      onClick={() => { navigate('/' + item.id); setIsMobileMenuOpen(false); }}
                      className={`flex items-center w-full p-5 rounded-2xl transition-all border border-transparent
                        ${activeTab === item.id
                          ? 'bg-white/10 text-white font-bold border-white/5 shadow-xl'
                          : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <item.icon className={`w-5 h-5 mr-6 ${activeTab === item.id ? 'text-ffn-primary' : ''}`} />
                      <span className="text-[11px] font-black uppercase tracking-[0.3em]">{item.label}</span>
                    </m.button>
                  ))}
                </nav>

                <div className="pt-12 border-t border-white/5 space-y-6">
                  {currentUser ? (
                    <m.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      onClick={() => { navigate('/my-profile'); setIsMobileMenuOpen(false); }}
                      className="flex items-center justify-between w-full p-6 rounded-[2.5rem] bg-white/5 border border-white/5 text-white"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden mr-5 border-2 border-white/10">
                          {currentUser.user_metadata?.avatar_url ? (
                            <img src={currentUser.user_metadata.avatar_url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full bg-ffn-primary flex items-center justify-center text-white font-black">
                              {currentUser.email?.[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90">{currentUser.user_metadata?.full_name || currentUser.email?.split('@')?.[0]}</p>
                          <div className="text-[9px] uppercase font-black text-ffn-primary mt-1 tracking-widest">Protocol Identified</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/20" />
                    </m.button>
                  ) : (
                    <m.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                      className="flex items-center justify-center w-full p-6 rounded-[2.5rem] bg-white text-black border border-white/20 shadow-xl"
                    >
                      <LogIn className="w-5 h-5 mr-3" />
                      <span className="font-black uppercase tracking-[0.4em] text-[10px]">Secure Access</span>
                    </m.button>
                  )}
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>


      <main className="lg:hidden flex-1 min-h-screen relative pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <m.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {children}
            </m.div>
          </AnimatePresence>
        </div>
      </main>

      <GlobalSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        isDarkMode={isDarkMode}
        onCreatePost={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
};
