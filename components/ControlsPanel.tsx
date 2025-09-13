import React from 'react';
import type { StyleOptions } from '../types';
import CustomSlider from './CustomSlider';
import { UploadIcon } from './icons/UploadIcon';
import { ResetIcon } from './icons/ResetIcon';
import IconButton from './IconButton';
import { AlignLeftIcon } from './icons/AlignLeftIcon';
import { AlignCenterIcon } from './icons/AlignCenterIcon';
import { AlignRightIcon } from './icons/AlignRightIcon';

interface ControlsPanelProps {
  text: string;
  styles: StyleOptions;
  onTextChange: (text: string) => void;
  onStyleChange: <K extends keyof StyleOptions>(key: K, value: StyleOptions[K]) => void;
  onFontChange: (file: File | null) => void;
  onResetStyles: () => void;
  isTransparent: boolean;
  onIsTransparentChange: (value: boolean) => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  text,
  styles,
  onTextChange,
  onStyleChange,
  onFontChange,
  onResetStyles,
  isTransparent,
  onIsTransparentChange
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFontChange(file);
    }
  };

  const alignmentOptions = [
    { value: 'left', icon: <AlignLeftIcon className="w-5 h-5" />, label: 'Align left' },
    { value: 'center', icon: <AlignCenterIcon className="w-5 h-5" />, label: 'Align center' },
    { value: 'right', icon: <AlignRightIcon className="w-5 h-5" />, label: 'Align right' },
  ] as const;

  return (
    <div className="bg-dark-card/60 backdrop-blur-xl border border-dark-border/50 p-6 rounded-2xl shadow-lg space-y-6 sticky top-8">
      <div>
        <label htmlFor="font-upload" className="block text-sm font-medium text-dark-medium-text mb-2">Upload Font (.ttf, .otf)</label>
        <label
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-dark-border rounded-md cursor-pointer hover:border-brand-primary transition-colors"
        >
          <UploadIcon className="w-6 h-6 mr-3 text-dark-medium-text"/>
          <span className="text-dark-light-text font-medium">Choose a font file</span>
          <input id="font-upload" type="file" accept=".ttf,.otf" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <div>
        <label htmlFor="text-input" className="block text-sm font-medium text-dark-medium-text mb-2">Your Text</label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={4}
          className="w-full bg-dark-bg/50 border border-dark-border rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
          placeholder="Type something..."
        />
      </div>

      <div className="space-y-4">
        <CustomSlider
          label="Font Size (px)"
          value={styles.fontSize}
          min={8}
          max={200}
          step={1}
          onChange={(e) => onStyleChange('fontSize', parseInt(e.target.value, 10))}
        />
        <CustomSlider
          label="Letter Spacing (px)"
          value={styles.letterSpacing}
          min={-10}
          max={50}
          step={0.5}
          onChange={(e) => onStyleChange('letterSpacing', parseFloat(e.target.value))}
        />
        <CustomSlider
          label="Line Height"
          value={styles.lineHeight}
          min={0.5}
          max={3}
          step={0.1}
          onChange={(e) => onStyleChange('lineHeight', parseFloat(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="color-picker" className="block text-sm font-medium text-dark-medium-text mb-2">Color</label>
            <input
              id="color-picker"
              type="color"
              value={styles.color}
              onChange={(e) => onStyleChange('color', e.target.value)}
              className="w-full h-10 p-1 bg-dark-bg/50 border border-dark-border rounded-md cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="shadow-color-picker" className="block text-sm font-medium text-dark-medium-text mb-2">Shadow</label>
            <input
              id="shadow-color-picker"
              type="color"
              value={styles.shadowColor}
              onChange={(e) => onStyleChange('shadowColor', e.target.value)}
              className="w-full h-10 p-1 bg-dark-bg/50 border border-dark-border rounded-md cursor-pointer"
            />
          </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-dark-medium-text mb-2">Alignment</label>
        <div className="grid grid-cols-3 gap-2 bg-dark-bg/50 p-1 rounded-md border border-dark-border">
          {alignmentOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStyleChange('textAlign', option.value)}
              className={`flex justify-center items-center p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-primary ${
                styles.textAlign === option.value
                  ? 'bg-brand-primary text-black'
                  : 'text-dark-medium-text hover:bg-dark-border hover:text-dark-light-text'
              }`}
              aria-pressed={styles.textAlign === option.value}
              title={option.label}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
            <input id="bold" type="checkbox" checked={styles.isBold} onChange={(e) => onStyleChange('isBold', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
            <label htmlFor="bold" className="ml-2 block text-sm text-dark-light-text">Bold</label>
        </div>
        <div className="flex items-center">
            <input id="italic" type="checkbox" checked={styles.isItalic} onChange={(e) => onStyleChange('isItalic', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
            <label htmlFor="italic" className="ml-2 block text-sm text-dark-light-text">Italic</label>
        </div>
        <div className="flex items-center">
            <input id="underline" type="checkbox" checked={styles.isUnderline} onChange={(e) => onStyleChange('isUnderline', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
            <label htmlFor="underline" className="ml-2 block text-sm text-dark-light-text">Underline</label>
        </div>
         <div className="flex items-center">
            <input id="shadow" type="checkbox" checked={styles.shadowEnabled} onChange={(e) => onStyleChange('shadowEnabled', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
            <label htmlFor="shadow" className="ml-2 block text-sm text-dark-light-text">Shadow</label>
        </div>
        <div className="flex items-center">
            <input id="transparent-bg" type="checkbox" checked={isTransparent} onChange={(e) => onIsTransparentChange(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
            <label htmlFor="transparent-bg" className="ml-2 block text-sm text-dark-light-text">Transparent BG</label>
        </div>
      </div>
      
      <IconButton text="Reset Styles" icon={<ResetIcon />} onClick={onResetStyles} fullWidth />

    </div>
  );
};

export default ControlsPanel;