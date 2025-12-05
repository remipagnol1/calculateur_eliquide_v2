import React from 'react';
import { IngredientRatio } from '../types';

interface RatioSelectorProps {
  label: string;
  ratio: IngredientRatio;
  onChange: (ratio: IngredientRatio) => void;
  isFixed?: boolean;
}

export const RatioSelector: React.FC<RatioSelectorProps> = ({ label, ratio, onChange, isFixed = false }) => {
  const commonRatios = [
    { pg: 100, vg: 0 },
    { pg: 70, vg: 30 },
    { pg: 50, vg: 50 },
    { pg: 30, vg: 70 },
    { pg: 0, vg: 100 },
  ];

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-xs text-slate-500">
          {ratio.pg}% PG / {ratio.vg}% VG
        </span>
      </div>
      
      {!isFixed && (
        <div className="flex flex-wrap gap-2 mb-2">
          {commonRatios.map((r) => (
            <button
              key={`${r.pg}-${r.vg}`}
              onClick={() => onChange(r)}
              className={`px-2 py-1 text-xs rounded border ${
                ratio.pg === r.pg && ratio.vg === r.vg
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {r.pg}/{r.vg}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-blue-500 w-8">PG</span>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={ratio.pg}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onChange({ pg: val, vg: 100 - val });
          }}
          disabled={isFixed}
          className="w-full h-2 bg-gradient-to-r from-blue-400 to-pink-400 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs font-bold text-pink-500 w-8 text-right">VG</span>
      </div>
    </div>
  );
};