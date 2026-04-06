
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Activity, Bookmark, Moon, Sun, AlertCircle,
  X, UserCircle, LogOut, Shield, Zap, LayoutGrid, Terminal
} from 'lucide-react';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({
  isOpen, onClose, onNavigate, onLogout, isDarkMode, onToggleDarkMode
}) => {
  const menuItems = [
    { id: 'settings', icon: Settings, label: 'Infrastructure Configuration', sub: 'System core settings' },
    { id: 'activity', icon: Zap, label: 'Your Digital Pulse', sub: 'Engagement & activity logs' },
    { id: 'saved', icon: Bookmark, label: 'Secured Archives', sub: 'Saved professional assets' },
    { id: 'appearance', icon: isDarkMode ? Sun : Moon, label: 'Neural Appearance', sub: 'Toggle dark mode protocol', action: onToggleDarkMode },
    { id: 'report', icon: AlertCircle, label: 'Report Disruption', sub: 'Submit system issue' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1000] bg-ffn-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20, rotate: -1 }}
            className="fixed bottom-24 left-6 lg:left-10 w-[380px] bg-[#1a1a1a]/95 backdrop-blur-3xl rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[1001] overflow-hidden border border-white/10"
          >
            {/* Scanner Line Animation */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ffn-primary to-transparent animate-scan-horizontal opacity-30" />

            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-ffn-primary/10 flex items-center justify-center border border-ffn-primary/20">
                    <Terminal className="w-4 h-4 text-ffn-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Protocol Access</span>
                </div>
                <button onClick={onClose} className="text-white/20 hover:text-white transition-colors" title="Deactivate Protocol Access">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        onNavigate(item.id);
                        onClose();
                      }
                    }}
                    className="group w-full flex items-center space-x-5 px-6 py-5 rounded-[2rem] hover:bg-white/5 transition-all text-left border border-transparent hover:border-white/5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-ffn-primary group-hover:bg-ffn-primary/10 transition-all border border-white/5">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/90">{item.label}</p>
                      <p className="text-[8px] font-medium uppercase tracking-widest text-white/20 mt-1">{item.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-ffn-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <button
                  onClick={() => { onNavigate('switch-accounts'); onClose(); }}
                  className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Switch Nodes</span>
                  <LayoutGrid className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { onLogout(); onClose(); }}
                  className="w-full flex items-center justify-between px-6 py-6 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Terminate Protocol</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
