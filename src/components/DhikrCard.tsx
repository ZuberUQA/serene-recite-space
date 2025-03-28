
import React, { useState, useEffect } from 'react';
import DhikrText from './DhikrText';
import Counter from './Counter';
import BeadVisualizer from './BeadVisualizer';
import { DhikrPhrase } from '../utils/dhikrData';

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
  
  // Apply entry animation when dhikr changes
  useEffect(() => {
    // Reset animation here if needed
  }, [dhikr]);

  return (
    <div className="glass-effect w-full max-w-md mx-auto rounded-3xl overflow-hidden animate-fade-in">
      <div className="p-6 space-y-8">
        <DhikrText dhikr={dhikr} />
        
        <Counter 
          loopSize={loopSize} 
          onCountChange={handleCountChange} 
        />
        
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
