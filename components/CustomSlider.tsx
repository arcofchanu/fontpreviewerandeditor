import React from 'react';

interface CustomSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ label, value, min, max, step, onChange }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-dark-medium-text">{label}</label>
        <span className="text-sm font-mono text-dark-light-text bg-dark-bg/50 px-2 py-1 rounded">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-dark-border rounded-lg appearance-none cursor-pointer range-lg accent-brand-primary"
      />
    </div>
  );
};

export default CustomSlider;