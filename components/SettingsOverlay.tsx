
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Activity, Bookmark, Moon, Sun, AlertCircle,
  ChevronRight, X, UserCircle, LogOut
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
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'activity', icon: Activity, label: 'Your activity' },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
    { id: 'appearance', icon: isDarkMode ? Sun : Moon, label: 'Switch appearance', action: onToggleDarkMode },
    { id: 'report', icon: AlertCircle, label: 'Report a problem' },
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
            className="fixed inset-0 z-[1000] bg-black/20 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 left-6 lg:left-10 w-[300px] bg-[#262626] rounded-[2rem] shadow-2xl z-[1001] overflow-hidden border border-white/10"
          >
            <div className="py-2">
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
                  className="w-full flex items-center space-x-4 px-6 py-4 text-white hover:bg-white/10 transition-colors text-left"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}

              <div className="h-[1px] bg-white/10 my-1" />

              <button
                onClick={() => { onNavigate('switch-accounts'); onClose(); }}
                className="w-full flex items-center space-x-4 px-6 py-4 text-white hover:bg-white/10 transition-colors text-left"
              >
                <span className="text-sm font-medium">Switch accounts</span>
              </button>

              <div className="h-[1px] bg-white/10 my-1" />

              <button
                onClick={() => { onLogout(); onClose(); }}
                className="w-full flex items-center space-x-4 px-6 py-4 text-white hover:bg-white/10 transition-colors text-left"
              >
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
