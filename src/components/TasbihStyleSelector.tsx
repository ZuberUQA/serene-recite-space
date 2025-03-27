
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle 
} from './ui/dialog';

interface TasbihStyleSelectorProps {
  selectedColor: string;
  onChange: (colorId: string) => void;
}

const BEAD_COLORS = [
  { id: 'gold', name: 'Gold', color: '#D4AF37' },
  { id: 'silver', name: 'Silver', color: '#C0C0C0' },
  { id: 'emerald', name: 'Emerald', color: '#50C878' },
  { id: 'ruby', name: 'Ruby', color: '#E0115F' },
  { id: 'sapphire', name: 'Sapphire', color: '#0F52BA' },
  { id: 'amber', name: 'Amber', color: '#FFBF00' },
  { id: 'pearl', name: 'Pearl', color: '#F5F7F8' },
  { id: 'obsidian', name: 'Obsidian', color: '#3D3635' }
];

const TasbihStyleSelector: React.FC<TasbihStyleSelectorProps> = ({ selectedColor, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelectColor = (colorId: string) => {
    onChange(colorId);
    setIsOpen(false);
  };
  
  const selectedColorData = BEAD_COLORS.find(c => c.id === selectedColor) || BEAD_COLORS[0];

  return (
    <div className="mt-2">
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center text-xs text-dhikr-text/60 hover:text-dhikr-primary transition-colors"
      >
        <div 
          className="w-4 h-4 rounded-full mr-1 border border-white/30 shadow-inner" 
          style={{ backgroundColor: selectedColorData.color }}
        />
        <span>Change style</span>
      </button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Tasbih Style</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-4 gap-3 mt-4">
            {BEAD_COLORS.map((color) => (
              <button
                key={color.id}
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  selectedColor === color.id 
                    ? 'bg-dhikr-primary/10 ring-2 ring-dhikr-primary' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSelectColor(color.id)}
              >
                <div 
                  className="w-10 h-10 rounded-full mb-2 shadow-lg" 
                  style={{ backgroundColor: color.color }}
                />
                <span className="text-xs">{color.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasbihStyleSelector;
