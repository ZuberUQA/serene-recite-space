
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { DhikrPhrase, defaultDhikrPhrases, defaultLoopSizes } from '../utils/dhikrData';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentDhikr: DhikrPhrase;
  currentLoopSize: number;
  onDhikrChange: (dhikr: DhikrPhrase) => void;
  onLoopSizeChange: (size: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  currentDhikr,
  currentLoopSize,
  onDhikrChange,
  onLoopSizeChange
}) => {
  const [activeTab, setActiveTab] = useState<'dhikr' | 'loop'>('dhikr');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-dhikr-text">Settings</h2>
          <button
            onClick={onClose}
            className="text-dhikr-text/60 hover:text-dhikr-secondary transition-colors"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-center transition-colors ${
              activeTab === 'dhikr'
                ? 'text-dhikr-primary border-b-2 border-dhikr-primary'
                : 'text-dhikr-text/60 hover:text-dhikr-text'
            }`}
            onClick={() => setActiveTab('dhikr')}
          >
            Dhikr Phrases
          </button>
          <button
            className={`flex-1 py-3 text-center transition-colors ${
              activeTab === 'loop'
                ? 'text-dhikr-primary border-b-2 border-dhikr-primary'
                : 'text-dhikr-text/60 hover:text-dhikr-text'
            }`}
            onClick={() => setActiveTab('loop')}
          >
            Loop Size
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === 'dhikr' ? (
            <div className="p-4 space-y-2">
              {defaultDhikrPhrases.map((dhikr) => (
                <button
                  key={dhikr.id}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
                    currentDhikr.id === dhikr.id
                      ? 'bg-dhikr-primary/10 text-dhikr-primary'
                      : 'bg-gray-50 hover:bg-gray-100 text-dhikr-text'
                  }`}
                  onClick={() => onDhikrChange(dhikr)}
                >
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{dhikr.nameEn}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                        {dhikr.count}
                      </span>
                    </div>
                    <div className="text-sm text-dhikr-text/70 font-arabic">
                      {dhikr.nameAr}
                    </div>
                  </div>
                  
                  {currentDhikr.id === dhikr.id && (
                    <Check size={18} className="text-dhikr-primary" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <p className="text-sm text-dhikr-text/70 mb-3">
                Select how many counts per loop:
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                {defaultLoopSizes.map((size) => (
                  <button
                    key={size}
                    className={`p-3 rounded-lg transition-all ${
                      currentLoopSize === size
                        ? 'bg-dhikr-primary text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-dhikr-text'
                    }`}
                    onClick={() => onLoopSizeChange(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <label className="text-sm text-dhikr-text/70 block mb-2">
                  Or enter a custom loop size:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Custom size"
                  />
                  <button className="bg-dhikr-primary text-white px-4 py-2 rounded-lg">
                    Set
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dhikr-primary text-white rounded-lg shadow hover:bg-dhikr-primary/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
