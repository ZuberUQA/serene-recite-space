
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
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setIsSupported(true);
      
      // Load available voices
      const loadVoices = () => {
        voicesRef.current = synthRef.current?.getVoices() || [];
        console.log('Available voices:', voicesRef.current.map(v => `${v.name} (${v.lang})`));
      };
      
      // Chrome loads voices asynchronously
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
      
      // Initial load attempt for Firefox/Safari
      loadVoices();
      
      // Force load voices after a short delay if they haven't loaded yet
      if (voicesRef.current.length === 0) {
        setTimeout(loadVoices, 500);
      }
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

  // Find the best voice for the language
  const getBestVoice = useCallback((language: string) => {
    if (!voicesRef.current.length) {
      console.warn('No voices available yet');
      return null;
    }
    
    console.log(`Looking for voice for language: ${language}`);
    console.log('Available voices:', voicesRef.current.map(v => `${v.name} (${v.lang})`));
    
    // Try to find an exact match
    let voice = voicesRef.current.find(v => v.lang === language);
    if (voice) console.log(`Found exact match: ${voice.name} (${voice.lang})`);
    
    // If no exact match, try to find a voice with the same language code
    if (!voice) {
      const langCode = language.split('-')[0];
      voice = voicesRef.current.find(v => v.lang.startsWith(langCode));
      if (voice) console.log(`Found partial match: ${voice.name} (${voice.lang})`);
    }
    
    // For Arabic, try different variants
    if (!voice && language.startsWith('ar')) {
      const arabicVoices = voicesRef.current.filter(v => v.lang.startsWith('ar'));
      if (arabicVoices.length > 0) {
        voice = arabicVoices[0];
        console.log(`Found Arabic variant: ${voice.name} (${voice.lang})`);
      }
    }
    
    // Default to first available voice if no match and log warning
    if (!voice) {
      console.warn(`No matching voice found for ${language}, using default`);
      return voicesRef.current[0];
    }
    
    return voice;
  }, []);

  // Create and configure speech utterance
  const createUtterance = useCallback((textToSpeak: string, language: string) => {
    if (!synthRef.current) return null;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = language;
    
    // Try to get a suitable voice
    const bestVoice = getBestVoice(language);
    if (bestVoice) {
      console.log(`Using voice: ${bestVoice.name} (${bestVoice.lang}) for ${language}`);
      utterance.voice = bestVoice;
    } else {
      console.log(`No matching voice found for ${language}, using default`);
    }
    
    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    return utterance;
  }, [rate, pitch, volume, getBestVoice]);

  // Speak the text
  const speak = useCallback((textToSpeak: string = text, language: string = lang) => {
    if (!isEnabled || !isSupported || !synthRef.current) {
      console.log('Speech not enabled, supported, or initialized');
      return;
    }
    
    // Cancel any ongoing speech
    if (isSpeaking) {
      synthRef.current.cancel();
    }
    
    if (!textToSpeak) {
      console.warn('No text provided to speak');
      return;
    }
    
    console.log(`Speaking text: "${textToSpeak}" in language: ${language}`);
    
    // Create new utterance
    utteranceRef.current = createUtterance(textToSpeak, language);
    
    if (utteranceRef.current) {
      try {
        synthRef.current.speak(utteranceRef.current);
      } catch (error) {
        console.error('Failed to speak:', error);
      }
    }
  }, [text, lang, isEnabled, isSupported, isSpeaking, createUtterance]);

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
