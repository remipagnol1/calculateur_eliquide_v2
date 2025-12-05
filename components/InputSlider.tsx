
import React from 'react';

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
}

export const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  disabled = false
}) => {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="flex items-center">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onChange(val);
            }}
            disabled={disabled}
            className="w-20 p-1.5 text-right text-sm font-bold text-indigo-600 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 disabled:bg-slate-100 transition-all"
          />
          <span className="ml-2 text-xs text-slate-500 w-8">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50 hover:bg-slate-300 transition-colors"
      />
    </div>
  );
};
