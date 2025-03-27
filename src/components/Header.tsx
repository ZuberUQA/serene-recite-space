
import React from 'react';
import { Settings, Moon, Info } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="fixed top-0 left-0 right-0 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 animate-fade-in">
      <div className="max-w-screen-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-dhikr-primary">
            Virtual Tasbih
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            className="control-button text-dhikr-text/70 hover:text-dhikr-primary transition-colors"
            onClick={() => {}}
            aria-label="Information"
          >
            <Info size={20} />
          </button>
          
          <button
            className="control-button text-dhikr-text/70 hover:text-dhikr-primary transition-colors"
            onClick={() => {}}
            aria-label="Toggle dark mode"
          >
            <Moon size={20} />
          </button>
          
          <button
            className="control-button text-dhikr-text/70 hover:text-dhikr-primary transition-colors"
            onClick={onOpenSettings}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
