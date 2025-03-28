
import { useCallback } from 'react';

interface UseVibrationProps {
  enabled?: boolean;
  pattern?: number[];
}

export const useVibration = ({ 
  enabled = true, 
  pattern = [50] 
}: UseVibrationProps = {}) => {
  
  const vibrate = useCallback(() => {
    if (!enabled) return;
    
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.error("Vibration failed:", error);
      }
    }
  }, [enabled, pattern]);
  
  return { vibrate };
};

export default useVibration;
