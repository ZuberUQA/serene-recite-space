
import { useState, useCallback, useEffect } from 'react';

interface UseCounterProps {
  initialCount?: number;
  loopSize?: number;
  maxLoops?: number;
  onLoopComplete?: () => void;
  onMaxLoopsReached?: () => void;
}

export const useCounter = ({
  initialCount = 0,
  loopSize = 33,
  maxLoops = 0,
  onLoopComplete,
  onMaxLoopsReached
}: UseCounterProps = {}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [loop, setLoop] = useState<number>(1);
  const [total, setTotal] = useState<number>(initialCount);
  const [paused, setPaused] = useState<boolean>(false);

  const increment = useCallback(() => {
    if (paused) return;
    
    setCount(prev => {
      const newCount = prev + 1;
      
      if (newCount > loopSize) {
        if (onLoopComplete) onLoopComplete();
        const newLoop = loop + 1;
        setLoop(newLoop);
        
        if (maxLoops > 0 && newLoop > maxLoops) {
          if (onMaxLoopsReached) onMaxLoopsReached();
          setPaused(true);
          return loopSize;
        }
        
        return 1;
      }
      
      return newCount;
    });
    
    setTotal(prev => prev + 1);
  }, [paused, loopSize, loop, maxLoops, onLoopComplete, onMaxLoopsReached]);

  const decrement = useCallback(() => {
    if (paused) return;
    
    setCount(prev => {
      const newCount = prev - 1;
      
      if (newCount < 1) {
        if (loop > 1) {
          setLoop(prev => prev - 1);
          return loopSize;
        }
        
        return 0;
      }
      
      return newCount;
    });
    
    setTotal(prev => (prev > 0 ? prev - 1 : 0));
  }, [paused, loopSize, loop]);

  const reset = useCallback(() => {
    setCount(initialCount);
    setLoop(1);
    setTotal(initialCount);
    setPaused(false);
  }, [initialCount]);

  const togglePause = useCallback(() => {
    setPaused(prev => !prev);
  }, []);

  return {
    count,
    loop,
    total,
    paused,
    increment,
    decrement,
    reset,
    togglePause,
    loopSize,
    maxLoops
  };
};

export default useCounter;
