
import React, { useRef, useState, useEffect } from 'react';
import useVibration from '../hooks/useVibration';

interface ScrollingPearlProps {
  onIncrement: () => void;
  disabled?: boolean;
  color?: string;
}

const ScrollingPearl: React.FC<ScrollingPearlProps> = ({ 
  onIncrement, 
  disabled = false,
  color = '#FFD15C' // Default yellow pearl color
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pearlRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [hasIncremented, setHasIncremented] = useState(false);
  const { vibrate } = useVibration({ pattern: [15] });
  
  // Threshold for how far the pearl needs to be dragged to trigger an increment
  const incrementThreshold = 50;
  
  // Reset the pearl position with animation
  const resetPearlPosition = () => {
    if (pearlRef.current) {
      pearlRef.current.style.transition = 'transform 0.3s ease-out';
      pearlRef.current.style.transform = 'translateX(0)';
      setTimeout(() => {
        if (pearlRef.current) {
          pearlRef.current.style.transition = '';
        }
      }, 300);
    }
  };

  // Play a soft click sound
  const playClickSound = () => {
    const audio = new Audio('/tick.mp3');
    audio.volume = 0.2;
    try {
      audio.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Handle mouse/touch down
  const handleStart = (clientX: number) => {
    if (disabled) return;
    setIsDragging(true);
    setStartX(clientX);
    setHasIncremented(false);
    
    // Apply a slight scale-up effect when starting to drag
    if (pearlRef.current) {
      pearlRef.current.style.transform = 'scale(1.05)';
    }
  };

  // Handle mouse/touch move
  const handleMove = (clientX: number) => {
    if (!isDragging || disabled) return;
    
    const deltaX = clientX - startX;
    setOffsetX(deltaX);
    
    if (pearlRef.current) {
      // Apply some resistance to the movement for a more tactile feel
      const resistance = 0.7;
      const movement = deltaX * resistance;
      
      // Add a slight vertical arc to the movement
      const verticalMovement = Math.sin(Math.abs(movement) * 0.01) * -5; // Small arc
      
      pearlRef.current.style.transform = `translateX(${movement}px) translateY(${verticalMovement}px)`;
      
      // Check if we've moved enough to increment and haven't already incremented in this gesture
      if (deltaX > incrementThreshold && !hasIncremented) {
        onIncrement();
        vibrate();
        playClickSound();
        setHasIncremented(true);
        
        // Give some feedback by briefly changing the scale
        if (pearlRef.current) {
          pearlRef.current.style.transform = `translateX(${movement}px) translateY(${verticalMovement}px) scale(1.1)`;
          setTimeout(() => {
            if (pearlRef.current && isDragging) {
              pearlRef.current.style.transform = `translateX(${movement}px) translateY(${verticalMovement}px) scale(1)`;
            }
          }, 100);
        }
      }
    }
  };

  // Handle mouse/touch end
  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    resetPearlPosition();
    setOffsetX(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Set up global mouse/touch event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging]);

  // Handle simple tap/click
  const handleClick = () => {
    if (disabled || isDragging || Math.abs(offsetX) > 5) return;
    
    onIncrement();
    vibrate();
    playClickSound();
    
    // Give some feedback with a quick scale animation
    if (pearlRef.current) {
      pearlRef.current.style.transition = 'transform 0.15s ease-out';
      pearlRef.current.style.transform = 'scale(1.1)';
      setTimeout(() => {
        if (pearlRef.current) {
          pearlRef.current.style.transform = 'scale(1)';
          setTimeout(() => {
            if (pearlRef.current) {
              pearlRef.current.style.transition = '';
            }
          }, 150);
        }
      }, 150);
    }
  };

  // Create visual beads in the track
  const renderBeads = () => {
    const beads = [];
    const beadColors = ['#E0A872', '#D88C5A', '#E0A872', '#D88C5A', '#E0A872'];
    
    for (let i = 0; i < 5; i++) {
      const isCenter = i === 2;
      beads.push(
        <div 
          key={i}
          className={`absolute rounded-full ${isCenter ? 'w-12 h-12 bg-amber-400' : 'w-10 h-10'}`}
          style={{
            left: `${i * 25}%`,
            backgroundColor: isCenter ? color : beadColors[i],
            transform: isCenter ? 'translateX(-50%)' : 'translateX(-50%)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
            display: isCenter ? 'block' : 'none', // Only show center bead initially
            zIndex: isCenter ? 2 : 1
          }}
        />
      );
    }
    
    return beads;
  };

  return (
    <div 
      className="w-full pt-8 pb-10"
      aria-label="Swipe the yellow pearl right to increment counter"
    >
      <div className="flex items-center justify-center h-24">
        <div 
          ref={containerRef}
          className="relative w-full max-w-xs h-16 flex items-center justify-center"
        >
          {/* Track string */}
          <div 
            ref={trackRef}
            className="absolute h-0.5 w-4/5 bg-amber-800/20 rounded-full"
            style={{
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          ></div>
          
          {/* Render other beads in track */}
          {renderBeads()}
          
          {/* Interactive Pearl */}
          <div 
            ref={pearlRef}
            className={`absolute w-14 h-14 rounded-full shadow-lg cursor-pointer 
                      ${isDragging ? '' : 'hover:scale-105 transition-transform duration-200'}`}
            style={{ 
              backgroundColor: color,
              backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 -4px 6px rgba(0, 0, 0, 0.1), inset 0 4px 6px rgba(255, 255, 255, 0.4)',
              zIndex: 10
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleClick}
          />
          
          {/* Visual guide arrows */}
          <div className="absolute flex justify-between w-56 px-2 text-amber-700/40 pointer-events-none">
            <div className="transform -translate-x-2">←</div>
            <div className="transform translate-x-2">→</div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs text-dhikr-text/50 mt-2">
        Swipe or tap the pearl to count
      </div>
    </div>
  );
};

export default ScrollingPearl;
