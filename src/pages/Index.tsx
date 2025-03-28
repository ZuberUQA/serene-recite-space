
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DhikrCard from '../components/DhikrCard';
import SettingsPanel from '../components/SettingsPanel';
import { getDefaultDhikr, defaultDhikrPhrases } from '../utils/dhikrData';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [currentDhikr, setCurrentDhikr] = useState(getDefaultDhikr());
  const [loopSize, setLoopSize] = useState(33);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const { toast } = useToast();
  
  // Preload sound effects
  useEffect(() => {
    const soundFiles = ['/tick.mp3', '/complete.mp3', '/reset.mp3'];
    let loadedCount = 0;
    
    const preloadAudio = (url: string) => {
      const audio = new Audio();
      audio.addEventListener('canplaythrough', () => {
        loadedCount++;
        if (loadedCount === soundFiles.length) {
          setSoundsLoaded(true);
          console.log('All sound files loaded');
        }
      }, { once: true });
      audio.src = url;
      audio.load();
    };
    
    // Create empty files if they don't exist (for demo purposes)
    const createEmptyAudioFile = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      return audioContext;
    };
    
    try {
      // Try to preload sounds, but don't block if they're missing
      soundFiles.forEach(preloadAudio);
      
      // Also create a fallback audio context in case files are missing
      const context = createEmptyAudioFile();
      setTimeout(() => {
        context.close();
      }, 1000);
    } catch (error) {
      console.warn('Error preloading sounds:', error);
      // Still set as loaded to prevent blocking the UI
      setSoundsLoaded(true);
    }
    
    // If sounds haven't loaded after 3 seconds, proceed anyway
    const timeout = setTimeout(() => {
      if (!soundsLoaded) {
        setSoundsLoaded(true);
        console.warn('Timeout waiting for sounds to load');
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  const toggleSettings = () => {
    setSettingsOpen(prev => !prev);
  };
  
  const handleDhikrChange = (dhikr: any) => {
    setCurrentDhikr(dhikr);
    setSettingsOpen(false);
    
    toast({
      title: "Dhikr changed",
      description: `Changed to ${dhikr.nameEn}`,
      duration: 2000,
    });
  };
  
  const handleLoopSizeChange = (size: number) => {
    setLoopSize(size);
    setSettingsOpen(false);
    
    toast({
      title: "Loop size updated",
      description: `Changed to ${size} counts per loop`,
      duration: 2000,
    });
  };

  return (
    <div className="app-bg min-h-screen">
      <Header onOpenSettings={toggleSettings} />
      
      <main className="pt-24 pb-16 px-4 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center animate-slide-down">
            <h1 className="text-3xl font-bold text-dhikr-primary mb-2">
              Virtual Tasbih
            </h1>
            <p className="text-dhikr-text/60">
              Digital dhikr counter for your spiritual journey
            </p>
          </div>
          
          <DhikrCard 
            dhikr={currentDhikr} 
            loopSize={loopSize}
          />
        </div>
      </main>
      
      <SettingsPanel 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentDhikr={currentDhikr}
        currentLoopSize={loopSize}
        onDhikrChange={handleDhikrChange}
        onLoopSizeChange={handleLoopSizeChange}
      />
      
      <footer className="py-4 px-6 text-center text-sm text-dhikr-text/50">
        <p>Virtual Tasbih - Digital Dhikr Counter</p>
      </footer>
    </div>
  );
};

export default Index;
