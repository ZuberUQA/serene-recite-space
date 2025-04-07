
import React, { useState, useEffect } from 'react';
import DhikrText from './DhikrText';
import Counter from './Counter';
import BeadVisualizer from './BeadVisualizer';
import { DhikrPhrase } from '../utils/dhikrData';
import useTextToSpeech from '../hooks/useTextToSpeech';
import useSound from '../hooks/useSound';
import useVibration from '../hooks/useVibration';
import ScrollingPearl from './ScrollingPearl';

interface DhikrCardProps {
  dhikr: DhikrPhrase;
  loopSize: number;
}

const DhikrCard: React.FC<DhikrCardProps> = ({ dhikr, loopSize }) => {
  const [count, setCount] = useState(0);
  const [loop, setLoop] = useState(1);
  const [total, setTotal] = useState(0);
  const [beadColor, setBeadColor] = useState('gold');
  const [showBeadCustomizer, setShowBeadCustomizer] = useState(false);
  
  // Initialize text to speech with the dhikr text
  const { speak, isEnabled: speechEnabled, toggleEnabled: toggleSpeech } = useTextToSpeech({
    text: dhikr.textAr || dhikr.textEn || dhikr.nameAr || dhikr.nameEn,
    lang: dhikr.textAr ? 'ar-SA' : 'en-US', // Use Arabic for Arabic text
    rate: 0.8, // Slightly slower for better comprehension
    enabled: true,
  });
  
  // Initialize sound and vibration
  const { play: playTickSound } = useSound({ soundType: 'tick' });
  const { vibrate } = useVibration();
  
  const handleCountChange = (newCount: number, newLoop: number, newTotal: number) => {
    setCount(newCount);
    setLoop(newLoop);
    setTotal(newTotal);
  };
  
  const handleColorChange = (colorId: string) => {
    setBeadColor(colorId);
  };
  
  const toggleBeadCustomizer = () => {
    setShowBeadCustomizer(prev => !prev);
  };

  const handleTasbihTap = () => {
    // Speak the dhikr text when tasbih is tapped
    if (speechEnabled) {
      speak();
    }
  };

  // Apply entry animation when dhikr changes
  useEffect(() => {
    // Reset animation here if needed
  }, [dhikr]);

  return (
    <div className="glass-effect w-full max-w-md mx-auto rounded-3xl overflow-hidden animate-fade-in dark:bg-gray-800/90 dark:border-gray-700/50 shadow-lg">
      <div className="p-6 space-y-8">
        <DhikrText dhikr={dhikr} />
        
        <div className="w-full">
          <ScrollingPearl
            count={count}
            loopSize={loopSize}
            selectedColor={beadColor}
            onIncrement={handleTasbihTap}
            animationEnabled={true}
          />
        </div>
        
        <Counter 
          loopSize={loopSize} 
          onCountChange={handleCountChange} 
        />
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleBeadCustomizer}
            className="px-4 py-2 rounded-lg bg-dhikr-primary/20 dark:bg-dhikr-accent/20 text-dhikr-primary dark:text-dhikr-accent hover:bg-dhikr-primary/30 dark:hover:bg-dhikr-accent/30 transition-colors"
          >
            Customize
          </button>
          
          <button
            onClick={toggleSpeech}
            className={`px-4 py-2 rounded-lg ${
              speechEnabled 
                ? 'bg-dhikr-primary/20 dark:bg-dhikr-accent/20 text-dhikr-primary dark:text-dhikr-accent' 
                : 'bg-gray-300/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
            } hover:opacity-80 transition-colors`}
          >
            {speechEnabled ? 'Voice On' : 'Voice Off'}
          </button>
        </div>
        
        {showBeadCustomizer && (
          <BeadVisualizer 
            count={count} 
            loopSize={loopSize} 
            selectedColor={beadColor}
            onColorChange={handleColorChange}
            onClose={toggleBeadCustomizer}
          />
        )}
      </div>
    </div>
  );
};

export default DhikrCard;
