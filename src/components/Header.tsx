
import React, { useState } from 'react';
import { Settings, Moon, Sun, Info, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const { theme, toggleTheme } = useTheme();
  const [infoOpen, setInfoOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 px-6 py-4 bg-white/80 dark:bg-dhikr-text/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-50 animate-fade-in">
      <div className="max-w-screen-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-dhikr-primary dark:text-dhikr-accent">
            Virtual Tasbih
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            className="control-button text-dhikr-text/70 dark:text-white/70 hover:text-dhikr-primary dark:hover:text-dhikr-accent transition-colors"
            onClick={() => setInfoOpen(true)}
            aria-label="Information"
          >
            <Info size={20} />
          </button>
          
          <button
            className="control-button text-dhikr-text/70 dark:text-white/70 hover:text-dhikr-primary dark:hover:text-dhikr-accent transition-colors"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            className="control-button text-dhikr-text/70 dark:text-white/70 hover:text-dhikr-primary dark:hover:text-dhikr-accent transition-colors"
            onClick={onOpenSettings}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
      
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>About Virtual Tasbih</DialogTitle>
            <DialogDescription>
              Your digital companion for dhikr and spiritual practice
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <h3 className="font-medium text-dhikr-primary dark:text-dhikr-accent">How to Use</h3>
            <p className="text-sm text-muted-foreground">
              Click the main counter button to count your dhikr. The beads will visually move as you progress.
            </p>
            
            <h3 className="font-medium text-dhikr-primary dark:text-dhikr-accent">Features</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
              <li>Track your dhikr with visual and audio feedback</li>
              <li>Customize bead appearance and counter settings</li> 
              <li>Choose from various pre-set dhikr phrases</li>
              <li>Haptic feedback on compatible devices</li>
              <li>Dark mode for comfortable use at night</li>
            </ul>
            
            <h3 className="font-medium text-dhikr-primary dark:text-dhikr-accent">Islamic Guidance</h3>
            <p className="text-sm text-muted-foreground">
              Regular dhikr (remembrance of Allah) is encouraged in Islam as a means to attain tranquility of the heart and spiritual elevation.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
