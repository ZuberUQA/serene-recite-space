
import { useCallback } from 'react';

interface UseVibrationProps {
  enabled?: boolean;
  pattern?: number[];
  intensity?: 'light' | 'medium' | 'strong';
}

export const useVibration = ({ 
  enabled = true, 
  pattern = [50],
  intensity = 'medium'
}: UseVibrationProps = {}) => {
  
  const vibrate = useCallback(() => {
    if (!enabled) return;
    
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        // Adjust pattern based on intensity
        let vibrationPattern;
        
        switch (intensity) {
          case 'light':
            vibrationPattern = pattern.map(duration => Math.min(duration, 20));
            break;
          case 'strong':
            vibrationPattern = pattern.map(duration => Math.min(duration * 1.5, 100));
            break;
          case 'medium':
          default:
            vibrationPattern = pattern;
            break;
        }
        
        navigator.vibrate(vibrationPattern);
      } catch (error) {
        console.error("Vibration failed:", error);
      }
    }
  }, [enabled, pattern, intensity]);
  
  return { vibrate };
};

export default useVibration;
