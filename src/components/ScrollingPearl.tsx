
import React, { useRef, useState, useEffect } from 'react';
import useVibration from '../hooks/useVibration';

interface ScrollingPearlProps {
  onIncrement: () => void;
  disabled?: boolean;
  color?: string;
  currentCount: number;
  loopSize: number;
  audioEnabled?: boolean;
}

const ScrollingPearl: React.FC<ScrollingPearlProps> = ({ 
  onIncrement, 
  disabled = false,
  color = '#FFD15C', // Default yellow pearl color
  currentCount,
  loopSize,
  audioEnabled = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pearlRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [hasIncremented, setHasIncremented] = useState(false);
  const { vibrate } = useVibration({ pattern: [15] });
  
  // Calculate the angle for positioning beads in a circle
  const getBeadPosition = (index: number, total: number, radius: number) => {
    // Start from the top (270 degrees) and go clockwise
    const angle = (index / total) * 2 * Math.PI + 1.5 * Math.PI;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    };
  };
  
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
    if (!audioEnabled) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio('/tick.mp3');
      audioRef.current.volume = 0.2;
    }
    
    try {
      // Create a clone to allow rapid succession of sounds
      const soundClone = audioRef.current.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.2;
      soundClone.play().catch(err => {
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

  // Initialize audio element
  useEffect(() => {
    if (audioEnabled) {
      audioRef.current = new Audio('/tick.mp3');
      audioRef.current.volume = 0.2;
      
      // Preload the audio
      try {
        audioRef.current.load();
      } catch (error) {
        console.error('Error loading audio:', error);
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, [audioEnabled]);

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

  // Render beads in the track
  const renderBeads = () => {
    const beads = [];
    const beadColors = ['#E0A872', '#D88C5A', '#E0A872', '#D88C5A', '#E0A872'];
    
    // Calculate progress percentage
    const progress = (currentCount / loopSize) * 100;
    
    // Number of beads to show (including main bead)
    const totalBeads = 9;
    const radius = 120; // Radius of the arc
    
    for (let i = 0; i < totalBeads; i++) {
      const isCenter = i === Math.floor(totalBeads / 2);
      const isActive = i <= Math.floor(totalBeads / 2);
      const position = getBeadPosition(i, totalBeads, radius);
      
      // Calculate if bead should be highlighted based on count progress
      const normalizedPosition = i / (totalBeads - 1);
      const isHighlighted = normalizedPosition <= progress / 100;
      
      const xOffset = isCenter ? 0 : position.x;
      const yOffset = isCenter ? 0 : position.y;
      
      beads.push(
        <div 
          key={i}
          className={`absolute rounded-full transition-all duration-300 ease-out
                     ${isCenter ? 'w-14 h-14 z-20' : 'w-10 h-10 z-10'}
                     ${isHighlighted ? 'opacity-100 scale-100' : 'opacity-60 scale-90'}`}
          style={{
            backgroundColor: isCenter ? color : beadColors[i % beadColors.length],
            transform: `translate(${xOffset}px, ${yOffset}px) ${isCenter && currentCount > 0 ? 'scale(1.1)' : ''}`,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
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
      <div className="flex items-center justify-center h-32">
        <div 
          ref={containerRef}
          className="relative w-full max-w-xs h-32 flex items-center justify-center"
        >
          {/* Track string - shown as a semi-circle */}
          <div 
            ref={trackRef}
            className="absolute h-0.5 w-full rounded-full"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(177, 122, 33, 0.1), rgba(177, 122, 33, 0.3) 50%, rgba(177, 122, 33, 0.1))',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              transform: 'translateY(60px)'
            }}
          ></div>
          
          {/* Render beads in track */}
          <div className="absolute inset-0 flex items-center justify-center">
            {renderBeads()}
          </div>
          
          {/* Interactive Pearl */}
          <div 
            ref={pearlRef}
            className={`absolute w-14 h-14 rounded-full shadow-lg cursor-pointer z-30 
                      ${isDragging ? '' : 'hover:scale-105 transition-transform duration-200'}`}
            style={{ 
              backgroundColor: color,
              backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 -4px 6px rgba(0, 0, 0, 0.1), inset 0 4px 6px rgba(255, 255, 255, 0.4)',
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
