
import React, { useEffect, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import useCounter from '../hooks/useCounter';
import useVibration from '../hooks/useVibration';
import TasbihBeads from './TasbihBeads';
import TasbihStyleSelector from './TasbihStyleSelector';

interface CounterProps {
  loopSize: number;
  onCountChange?: (count: number, loop: number, total: number) => void;
}

const Counter: React.FC<CounterProps> = ({ loopSize, onCountChange }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [beadColor, setBeadColor] = useState('gold');
  const [countStyle, setCountStyle] = useState<'beads' | 'digital'>('beads');
  const [styleDialogOpen, setStyleDialogOpen] = useState(false);
  
  const { 
    count, 
    loop,
    total,
    paused,
    increment,
    decrement,
    reset,
    togglePause 
  } = useCounter({ 
    loopSize,
    onLoopComplete: () => {
      // Could play sound or show notification
    }
  });
  
  const { vibrate } = useVibration({ enabled: true });
  
  // Sound effect
  const playTickSound = () => {
    if (!soundEnabled) return;
    
    const audio = new Audio('/tick.mp3');
    audio.volume = 0.5;
    try {
      audio.play().catch(err => {
        // Browsers may block autoplay
        console.log('Audio play failed:', err);
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  // Notify parent about count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(count, loop, total);
    }
  }, [count, loop, total, onCountChange]);

  const handleIncrement = () => {
    increment();
    vibrate();
    playTickSound();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-center w-full max-w-xs mb-5">
        <button
          onClick={decrement}
          className="control-button bg-white/80 text-dhikr-text/70 hover:bg-white hover:text-dhikr-primary shadow"
          aria-label="Previous"
        >
          <SkipBack size={24} />
        </button>
        
        <button
          onClick={togglePause}
          className={`count-button ${paused ? 'bg-white text-dhikr-secondary' : 'bg-dhikr-secondary text-white'} ${!paused && 'pulse-ring'}`}
          aria-label={paused ? "Resume" : "Pause counter"}
        >
          {paused ? (
            <Play size={32} className="ml-1" />
          ) : (
            <Pause size={32} />
          )}
        </button>
        
        <button
          onClick={handleIncrement}
          className="control-button bg-white/80 text-dhikr-text/70 hover:bg-white hover:text-dhikr-primary shadow"
          aria-label="Next"
        >
          <SkipForward size={24} />
        </button>
      </div>
      
      <div className="text-center">
        <div className="text-5xl font-semibold text-dhikr-primary mb-2">
          {count}<span className="text-dhikr-text/40">/{loopSize}</span>
        </div>
        
        <div className="text-sm text-dhikr-text/60">
          Loop {loop} / Total: <span className="text-dhikr-primary">{total}</span>
        </div>
      </div>
      
      {countStyle === 'beads' && (
        <div className="mt-6 w-full">
          <TasbihBeads 
            count={count}
            loopSize={loopSize}
            color={beadColor}
            onBeadClick={handleIncrement}
          />
          <div className="flex justify-center">
            <TasbihStyleSelector 
              selectedColor={beadColor} 
              onChange={setBeadColor}
            />
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-6 space-x-5">
        <button
          onClick={reset}
          className="control-button bg-white/80 text-dhikr-text/60 hover:text-dhikr-primary hover:bg-white shadow-sm"
          aria-label="Reset counter"
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="control-button bg-white/80 text-dhikr-text/60 hover:text-dhikr-primary hover:bg-white shadow-sm"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        
        <button
          onClick={() => setStyleDialogOpen(true)}
          className="control-button bg-white/80 text-dhikr-text/60 hover:text-dhikr-primary hover:bg-white shadow-sm"
          aria-label="Change counter style"
        >
          <span className="text-xs">Style</span>
        </button>
      </div>
      
      {/* Style selector dialog */}
      <TasbihStyleSelector
        selectedColor={beadColor}
        onChange={setBeadColor}
        isOpen={styleDialogOpen}
        onClose={() => setStyleDialogOpen(false)}
        selectedStyle={countStyle}
        onStyleChange={setCountStyle}
      />
    </div>
  );
};

export default Counter;
