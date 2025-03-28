
import { useCallback, useState } from 'react';

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
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  
  // Convert intensity to actual pattern
  const getIntensityPattern = useCallback(() => {
    switch (intensity) {
      case 'light': return [30];
      case 'medium': return [50];
      case 'strong': return [100];
      default: return pattern;
    }
  }, [intensity, pattern]);
  
  const vibrate = useCallback(() => {
    if (!enabled) return;
    
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        const effectivePattern = getIntensityPattern();
        navigator.vibrate(effectivePattern);
        
        if (isSupported === null) {
          setIsSupported(true);
        }
      } catch (error) {
        console.error("Vibration failed:", error);
        if (isSupported === null) {
          setIsSupported(false);
        }
      }
    } else if (isSupported === null) {
      setIsSupported(false);
    }
  }, [enabled, getIntensityPattern, isSupported]);
  
  return { vibrate, isSupported };
};

export default useVibration;
