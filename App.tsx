import React, { useState, useEffect, useCallback } from 'react';
import type { StyleOptions } from './types';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import PreviewArea from './components/PreviewArea';

const INITIAL_TEXT = `The quick brown fox jumps over the lazy dog.`;

const DEFAULT_STYLES: StyleOptions = {
  fontSize: 64,
  color: '#FFFFFF',
  letterSpacing: 0,
  lineHeight: 1.2,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  shadowColor: '#000000',
  shadowEnabled: false,
  textAlign: 'center',
};

function App() {
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [fontFamily, setFontFamily] = useState<string>('sans-serif');
  const [text, setText] = useState<string>(INITIAL_TEXT);
  const [styles, setStyles] = useState<StyleOptions>(DEFAULT_STYLES);
  const [isTransparent, setIsTransparent] = useState<boolean>(true);

  useEffect(() => {
    const fontCssUrl = 'https://fonts.googleapis.com/css2?family=Condiment&display=swap';
    const styleTagId = 'google-font-condiment-style';

    const loadFont = async () => {
      if (document.getElementById(styleTagId)) {
        return;
      }
      try {
        const response = await fetch(fontCssUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch font CSS: ${response.statusText}`);
        }
        const cssText = await response.text();
        
        const style = document.createElement('style');
        style.id = styleTagId;
        style.appendChild(document.createTextNode(cssText));
        
        document.head.appendChild(style);
      } catch (error) {
        console.error('Failed to load Google Font CSS:', error);
      }
    };

    loadFont();

    return () => {
      const styleTag = document.getElementById(styleTagId);
      if (styleTag) {
        styleTag.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!fontFile) {
      setFontFamily('sans-serif');
      return;
    }

    const newFontFamilyName = `CustomFont-${Date.now()}`;
    const reader = new FileReader();

    reader.onload = (event) => {
      const fontDataUrl = event.target?.result;
      if (typeof fontDataUrl !== 'string') return;

      const existingStyle = document.getElementById('custom-font-style-tag');
      if (existingStyle) {
        existingStyle.remove();
      }

      const newStyle = document.createElement('style');
      newStyle.id = 'custom-font-style-tag';
      newStyle.innerHTML = `
          @font-face {
              font-family: '${newFontFamilyName}';
              src: url('${fontDataUrl}');
          }
      `;
      document.head.appendChild(newStyle);
      
      setFontFamily(newFontFamilyName);
    };

    reader.readAsDataURL(fontFile);

    return () => {
      const styleTag = document.getElementById('custom-font-style-tag');
      if (styleTag) {
          document.head.removeChild(styleTag);
      }
    };
  }, [fontFile]);

  const handleStyleChange = useCallback(<K extends keyof StyleOptions>(key: K, value: StyleOptions[K]) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetStyles = useCallback(() => {
    setStyles(DEFAULT_STYLES);
  }, []);

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <ControlsPanel
              text={text}
              styles={styles}
              onTextChange={setText}
              onStyleChange={handleStyleChange}
              onFontChange={setFontFile}
              onResetStyles={resetStyles}
              isTransparent={isTransparent}
              onIsTransparentChange={setIsTransparent}
            />
          </div>
          <div className="lg:col-span-8">
            <PreviewArea
              text={text}
              styles={styles}
              fontFamily={fontFamily}
              isTransparent={isTransparent}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
