
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import TasbihBeads from './TasbihBeads';

interface ColorOption {
  id: string;
  name: string;
  color: string;
}

const BEAD_COLORS: ColorOption[] = [
  { id: 'gold', name: 'Gold', color: '#D4AF37' },
  { id: 'silver', name: 'Silver', color: '#C0C0C0' },
  { id: 'emerald', name: 'Emerald', color: '#50C878' },
  { id: 'ruby', name: 'Ruby', color: '#E0115F' },
  { id: 'sapphire', name: 'Sapphire', color: '#0F52BA' },
  { id: 'amber', name: 'Amber', color: '#FFBF00' },
  { id: 'pearl', name: 'Pearl', color: '#F5F7F8' },
  { id: 'obsidian', name: 'Obsidian', color: '#3D3635' }
];

const SOUND_OPTIONS = [
  { id: 'soft', name: 'Soft Click' },
  { id: 'wooden', name: 'Wooden' },
  { id: 'crystal', name: 'Crystal' }
];

interface TasbihStyleSelectorProps {
  selectedColor: string;
  onChange: (colorId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  selectedStyle?: 'beads' | 'digital';
  onStyleChange?: (style: 'beads' | 'digital') => void;
  soundType?: string;
  onSoundTypeChange?: (soundType: any) => void;
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
}

const TasbihStyleSelector: React.FC<TasbihStyleSelectorProps> = ({
  selectedColor = 'gold',
  onChange,
  isOpen = false,
  onClose,
  selectedStyle = 'beads',
  onStyleChange,
  soundType = 'soft',
  onSoundTypeChange,
  soundEnabled = false,
  onSoundToggle
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewColor, setPreviewColor] = useState(selectedColor);
  
  // Sync internal state with props
  useEffect(() => {
    setDialogOpen(isOpen);
  }, [isOpen]);
  
  // If dialog is closed externally
  useEffect(() => {
    if (!dialogOpen && onClose) {
      onClose();
    }
  }, [dialogOpen, onClose]);
  
  const handleColorSelect = (colorId: string) => {
    setPreviewColor(colorId);
    onChange(colorId);
  };
  
  const selectedColorData = BEAD_COLORS.find(c => c.id === selectedColor) || BEAD_COLORS[0];
  
  const handleStyleChange = (style: 'beads' | 'digital') => {
    if (onStyleChange) {
      onStyleChange(style);
    }
  };
  
  const handleSoundTypeChange = (type: string) => {
    if (onSoundTypeChange) {
      onSoundTypeChange(type);
    }
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
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
      >
        <DialogContent className="max-w-md bg-white p-6 rounded-xl">
          <DialogTitle className="text-xl text-dhikr-primary font-medium">
            Customize Tasbih
          </DialogTitle>
          
          <div className="space-y-6 my-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Display Style</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStyleChange('beads')}
                  className={`px-4 py-2 rounded-md ${
                    selectedStyle === 'beads' 
                      ? 'bg-dhikr-primary text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Beads
                </button>
                <button
                  onClick={() => handleStyleChange('digital')}
                  className={`px-4 py-2 rounded-md ${
                    selectedStyle === 'digital' 
                      ? 'bg-dhikr-primary text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Digital Only
                </button>
              </div>
            </div>
            
            {selectedStyle === 'beads' && (
              <div>
                <h3 className="text-sm font-medium mb-3">Bead Color</h3>
                <div className="grid grid-cols-4 gap-2">
                  {BEAD_COLORS.map(color => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color.id)}
                      className={`flex flex-col items-center p-2 rounded-md ${
                        previewColor === color.id ? 'bg-gray-100 ring-2 ring-dhikr-primary' : ''
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-full shadow-md" 
                        style={{ backgroundColor: color.color }}
                      />
                      <span className="text-xs mt-1">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-3">Sound Options</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                  <span>Sounds</span>
                  <button
                    onClick={onSoundToggle}
                    className={`p-2 rounded-full ${
                      soundEnabled ? 'bg-dhikr-accent/20 text-dhikr-primary' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>
                </div>
                
                {soundEnabled && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {SOUND_OPTIONS.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleSoundTypeChange(option.id)}
                        className={`px-3 py-2 text-sm rounded-md ${
                          soundType === option.id 
                            ? 'bg-dhikr-accent/20 text-dhikr-primary' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasbihStyleSelector;
