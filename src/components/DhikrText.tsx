
import React from 'react';
import { X } from 'lucide-react';
import { DhikrPhrase } from '../utils/dhikrData';

interface DhikrTextProps {
  dhikr: DhikrPhrase;
  onClose?: () => void;
}

const DhikrText: React.FC<DhikrTextProps> = ({ dhikr, onClose }) => {
  return (
    <div className="relative w-full p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md animate-scale-in">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-dhikr-secondary transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      )}
      
      <div className="space-y-4">
        <div className="text-center">
          <p className="font-arabic text-3xl md:text-4xl leading-relaxed text-dhikr-text font-semibold mb-2">
            {dhikr.textAr}
          </p>
          
          {dhikr.transliteration && (
            <p className="text-dhikr-text/70 text-sm md:text-base">
              {dhikr.transliteration}
            </p>
          )}
          
          {dhikr.textEn && (
            <p className="text-dhikr-text/80 text-sm md:text-base mt-2">
              {dhikr.textEn}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DhikrText;
