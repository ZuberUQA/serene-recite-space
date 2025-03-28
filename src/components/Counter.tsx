
import React, { useEffect, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import useCounter from '../hooks/useCounter';
import useVibration from '../hooks/useVibration';
import useSound from '../hooks/useSound';
import ScrollingPearl from './ScrollingPearl';

interface CounterProps {
  loopSize: number;
  onCountChange?: (count: number, loop: number, total: number) => void;
}

const Counter: React.FC<CounterProps> = ({ loopSize, onCountChange }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedColor, setSelectedColor] = useState('gold');
  
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
      // Play complete sound when loop is completed
      completeSound.play();
    }
  });
  
  const { vibrate } = useVibration({ 
    enabled: true,
    intensity: 'medium'
  });
  
  const { play: playTickSound, isEnabled, toggleSound } = useSound({
    enabled: soundEnabled,
    volume: 0.5,
    soundType: 'tick'
  });
  
  const completeSound = useSound({
    enabled: soundEnabled,
    volume: 0.6,
    soundType: 'complete'
  });
  
  const resetSound = useSound({
    enabled: soundEnabled,
    volume: 0.5,
    soundType: 'reset'
  });
  
  // Notify parent about count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(count, loop, total);
    }
  }, [count, loop, total, onCountChange]);

  const handleIncrement = () => {
    if (paused) {
      togglePause();
      return;
    }
    
    increment();
    vibrate();
    
    if (isEnabled) {
      playTickSound();
    }
  };
  
  const handleReset = () => {
    reset();
    resetSound.play();
  };
  
  const togglePlayPause = () => {
    togglePause();
  };
  
  return (
    <div className="flex flex-col items-center">
      {/* Scrolling Pearl Animation */}
      <ScrollingPearl
        count={count}
        loopSize={loopSize}
        selectedColor={selectedColor}
        onIncrement={handleIncrement}
        animationEnabled={!paused}
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
          onClick={togglePlayPause}
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
          onClick={handleReset}
          className="control-button bg-white/80 text-dhikr-text/60 hover:text-dhikr-primary hover:bg-white shadow-sm"
          aria-label="Reset counter"
        >
          <RotateCcw size={20} />
        </button>
        
        <button
          onClick={toggleSound}
          className="control-button bg-white/80 text-dhikr-text/60 hover:text-dhikr-primary hover:bg-white shadow-sm"
          aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Counter;
