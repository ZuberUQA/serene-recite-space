
import React, { useEffect, useRef, useState } from 'react';
import { beadColors } from '../utils/dhikrData';

interface ScrollingPearlProps {
  count: number;
  loopSize: number;
  selectedColor: string;
  onIncrement?: () => void;
  animationEnabled?: boolean;
}

const ScrollingPearl: React.FC<ScrollingPearlProps> = ({
  count,
  loopSize,
  selectedColor,
  onIncrement,
  animationEnabled = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [beadPositions, setBeadPositions] = useState<{x: number, y: number}[]>([]);
  
  // Calculate positions for beads in a semi-circle
  useEffect(() => {
    if (!containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = 150; // Height of the arc
    const numBeads = loopSize;
    const radius = width / 2;
    
    const positions = [];
    
    // Calculate positions along a semi-circle
    for (let i = 0; i < numBeads; i++) {
      const angle = (Math.PI * i) / (numBeads - 1);
      const x = radius * Math.cos(angle);
      const y = height * Math.sin(angle);
      
      // Normalize coordinates to container
      const normalizedX = radius + x;
      const normalizedY = height - y;
      
      positions.push({ x: normalizedX, y: normalizedY });
    }
    
    setBeadPositions(positions);
  }, [loopSize, containerRef]);
  
  const getBeadColor = (index: number) => {
    // Active beads get the selected color
    if (index < count) {
      return beadColors.find(c => c.id === selectedColor)?.color || '#D4AF37';
    }
    // Inactive beads are gray
    return '#E0E0E0';
  };
  
  const handleContainerClick = () => {
    if (onIncrement) {
      onIncrement();
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-40 relative mt-8 mb-4 cursor-pointer"
      onClick={handleContainerClick}
    >
      {/* Thin line connecting beads */}
      <div className="absolute h-px w-full bg-gray-300 z-0" style={{ top: '50%' }}></div>
      
      {/* Beads */}
      {beadPositions.map((position, index) => (
        <div
          key={`bead-${index}`}
          className={`absolute transition-all duration-300 ease-out z-10
                    ${index === count - 1 ? 'animate-pulse-soft scale-125' : ''}
                    ${index < count ? 'opacity-100' : 'opacity-70'}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Highlight for current bead */}
          {index === count - 1 && count > 0 && (
            <div className="absolute w-8 h-8 rounded-full border-2 border-dhikr-primary/70 animate-pulse"></div>
          )}
          
          {/* The bead itself */}
          <div
            className={`w-6 h-6 rounded-full shadow-md transition-transform duration-200
                      ${index < count ? 'scale-110' : 'scale-100'}
                      ${index === count - 1 && count > 0 ? 'scale-125' : ''}`}
            style={{
              backgroundColor: getBeadColor(index),
              boxShadow: index < count ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
              backgroundImage: `radial-gradient(circle at 30% 30%, ${getBeadColor(index)}, ${index < count ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'} 120%)`,
            }}
          ></div>
        </div>
      ))}
      
      {/* "Tap to start" text when count is 0 */}
      {count === 0 && (
        <div className="absolute bottom-0 left-0 right-0 text-center text-dhikr-text/60 pt-5">
          Tap to start tasbih
        </div>
      )}
    </div>
  );
};

export default ScrollingPearl;
