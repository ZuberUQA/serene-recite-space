
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
  isOpen?: boolean;
  onClose?: () => void;
  selectedStyle?: 'beads' | 'digital';
  onStyleChange?: (style: 'beads' | 'digital') => void;
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

const TasbihStyleSelector: React.FC<TasbihStyleSelectorProps> = ({ 
  selectedColor, 
  onChange, 
  isOpen = false,
  onClose = () => {},
  selectedStyle = 'beads',
  onStyleChange
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleSelectColor = (colorId: string) => {
    onChange(colorId);
    setDialogOpen(false);
    if (onClose) onClose();
  };
  
  const selectedColorData = BEAD_COLORS.find(c => c.id === selectedColor) || BEAD_COLORS[0];

  // If isOpen is provided, use it, otherwise use internal state
  const isDialogOpen = isOpen !== undefined ? isOpen : dialogOpen;
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open && onClose) onClose();
  };

  return (
    <div className="mt-2">
      {!isOpen && (
        <button 
          onClick={() => setDialogOpen(true)}
          className="flex items-center text-xs text-dhikr-text/60 hover:text-dhikr-primary transition-colors"
        >
          <div 
            className="w-4 h-4 rounded-full mr-1 border border-white/30 shadow-inner" 
            style={{ backgroundColor: selectedColorData.color }}
          />
          <span>Change style</span>
        </button>
      )}
      
      <Dialog 
        open={isDialogOpen} 
        onOpenChange={onClose ? (open) => !open && onClose() : handleDialogOpenChange}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Tasbih Style</DialogTitle>
          </DialogHeader>
          
          {onStyleChange && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  selectedStyle === 'beads' 
                    ? 'bg-dhikr-primary/10 ring-2 ring-dhikr-primary' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onStyleChange('beads')}
              >
                <span className="text-sm">Beads</span>
              </button>
              <button
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  selectedStyle === 'digital' 
                    ? 'bg-dhikr-primary/10 ring-2 ring-dhikr-primary' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onStyleChange('digital')}
              >
                <span className="text-sm">Digital</span>
              </button>
            </div>
          )}
          
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
