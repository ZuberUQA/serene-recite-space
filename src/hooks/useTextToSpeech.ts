
import { useCallback, useEffect, useState, useRef } from 'react';

interface UseTextToSpeechProps {
  text?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  enabled?: boolean;
}

export const useTextToSpeech = ({
  text = '',
  rate = 1,
  pitch = 1,
  volume = 1,
  lang = 'ar-SA', // Default to Arabic for dhikr
  enabled = true
}: UseTextToSpeechProps = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setIsSupported(true);
    } else {
      setIsSupported(false);
      console.warn('Text-to-speech is not supported in this browser');
    }

    return () => {
      if (synthRef.current && utteranceRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Create and configure speech utterance
  const createUtterance = useCallback((textToSpeak: string) => {
    if (!synthRef.current) return null;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = lang;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    return utterance;
  }, [rate, pitch, volume, lang]);

  // Speak the text
  const speak = useCallback((textToSpeak: string = text) => {
    if (!isEnabled || !isSupported || !synthRef.current) return;
    
    // Cancel any ongoing speech
    if (isSpeaking) {
      synthRef.current.cancel();
    }
    
    // Create new utterance
    utteranceRef.current = createUtterance(textToSpeak);
    
    if (utteranceRef.current) {
      try {
        synthRef.current.speak(utteranceRef.current);
      } catch (error) {
        console.error('Failed to speak:', error);
      }
    }
  }, [text, isEnabled, isSupported, isSpeaking, createUtterance]);

  // Stop speaking
  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Toggle enabled state
  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => !prev);
    
    // If disabling while speaking, stop speaking
    if (isEnabled && isSpeaking) {
      stop();
    }
  }, [isEnabled, isSpeaking, stop]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    isEnabled,
    toggleEnabled
  };
};

export default useTextToSpeech;
