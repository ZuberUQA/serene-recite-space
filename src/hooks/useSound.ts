
import { useCallback, useEffect, useRef, useState } from 'react';

type SoundType = 'tick' | 'complete' | 'reset';

interface UseSoundProps {
  enabled?: boolean;
  volume?: number;
  soundType?: SoundType;
}

export const useSound = ({
  enabled = true,
  volume = 0.5,
  soundType = 'tick'
}: UseSoundProps = {}) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [soundVolume, setSoundVolume] = useState(volume);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const getSoundPath = useCallback((type: SoundType) => {
    switch (type) {
      case 'tick': return '/tick.mp3';
      case 'complete': return '/complete.mp3';
      case 'reset': return '/reset.mp3';
      default: return '/tick.mp3';
    }
  }, []);
  
  useEffect(() => {
    // Create audio elements on client side only
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(getSoundPath(soundType));
      audioRef.current.volume = soundVolume;
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [soundType, getSoundPath, soundVolume]);
  
  const play = useCallback(() => {
    if (!isEnabled || !audioRef.current) return;
    
    try {
      // Reset audio to beginning if it's already playing
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn('Audio playback was prevented:', err);
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isEnabled]);
  
  const toggleSound = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);
  
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setSoundVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);
  
  return { 
    play, 
    toggleSound, 
    setVolume, 
    isEnabled, 
    volume: soundVolume 
  };
};

export default useSound;
