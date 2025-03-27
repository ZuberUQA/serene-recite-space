
import React, { useEffect, useRef } from 'react';
import { Pause, Play, SkipBack, SkipForward, RotateCcw, Volume2 } from 'lucide-react';
import useCounter from '../hooks/useCounter';
import useVibration from '../hooks/useVibration';
import ScrollingPearl from './ScrollingPearl';

interface CounterProps {
  loopSize: number;
  onCountChange?: (count: number, loop: number, total: number) => void;
}

const Counter: React.FC<CounterProps> = ({ loopSize, onCountChange }) => {
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/tick.mp3');
    audioRef.current.volume = 0.5;
    
    // Preload the audio
    try {
      audioRef.current.load();
    } catch (error) {
      console.error('Error loading audio:', error);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Sound effect
  const playTickSound = () => {
    if (!audioRef.current) return;
    
    try {
      // Create a clone to allow rapid succession of sounds
      const soundClone = audioRef.current.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5;
      soundClone.play().catch(err => {
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
    if (paused) return;
    increment();
    vibrate();
    playTickSound();
  };

  return (
    <div className="flex flex-col items-center">
      {/* ScrollingPearl component */}
      <ScrollingPearl 
        onIncrement={handleIncrement}
        disabled={paused}
        color="#FFD15C" // Yellow pearl color matching the design
      />
      
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
          onClick={increment}
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
      
      <div className="flex justify-center mt-6 space-x-5">
        <button
          onClick={reset}
          className="control-button bg-white/80 text-dhikr-text/60 hover:text-dhikr-primary hover:bg-white shadow-sm"
          aria-label="Reset counter"
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={() => {}}
          className="control-button bg-white/80 text-dhikr-text/60 hover:text-dhikr-primary hover:bg-white shadow-sm"
          aria-label="Toggle sound"
        >
          <Volume2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Counter;
