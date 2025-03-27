
import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { beadColors } from '../utils/dhikrData';

interface BeadVisualizerProps {
  count: number;
  loopSize: number;
  selectedColor: string;
  onColorChange: (colorId: string) => void;
  onClose?: () => void;
}

const BeadVisualizer: React.FC<BeadVisualizerProps> = ({
  count,
  loopSize,
  selectedColor,
  onColorChange,
  onClose
}) => {
  const currentIndex = count - 1;
  
  // Generate beads based on loop size
  const beads = useMemo(() => {
    return Array.from({ length: loopSize }, (_, index) => ({
      id: `bead-${index}`,
      active: index <= currentIndex
    }));
  }, [loopSize, currentIndex]);
  
  // Calculate which beads to show (sliding window around current bead)
  const visibleBeads = useMemo(() => {
    const maxVisible = 7; // Show max 7 beads
    const startIndex = Math.max(0, currentIndex - Math.floor(maxVisible / 2));
    const endIndex = Math.min(loopSize - 1, startIndex + maxVisible - 1);
    
    return beads.slice(startIndex, endIndex + 1);
  }, [beads, currentIndex, loopSize]);

  return (
    <div className="relative w-full pb-8 pt-4 px-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm animate-slide-up">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-dhikr-secondary transition-colors"
          aria-label="Close bead visualizer"
        >
          <X size={16} />
        </button>
      )}

      <div className="flex justify-center items-center h-16 mb-3 overflow-hidden">
        <div className="relative w-full flex items-center justify-center">
          <div className="absolute h-px w-full bg-gray-300 z-0"></div>
          
          {visibleBeads.map((bead, index) => (
            <div 
              key={bead.id} 
              className="bead-container mx-1 z-10"
            >
              {bead.active && bead.id === `bead-${currentIndex}` && (
                <div className="bead-highlight animate-pulse-soft"></div>
              )}
              <div 
                className={`bead ${bead.active ? 'scale-100' : 'scale-90 opacity-50'}`}
                style={{ 
                  backgroundColor: bead.active 
                    ? beadColors.find(c => c.id === selectedColor)?.color || beadColors[0].color
                    : '#E0E0E0',
                  transform: bead.id === `bead-${currentIndex}` ? 'scale(1.2)' : ''
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-3 pt-2">
        {beadColors.map(color => (
          <button
            key={color.id}
            className={`w-8 h-8 rounded-full transition-all duration-200 ${
              selectedColor === color.id 
                ? 'ring-2 ring-offset-2 ring-dhikr-primary scale-110' 
                : 'opacity-80 hover:opacity-100 hover:scale-105'
            }`}
            style={{ backgroundColor: color.color }}
            onClick={() => onColorChange(color.id)}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
    </div>
  );
};

export default BeadVisualizer;
