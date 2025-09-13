import React, { useRef, useState, useEffect } from 'react';
import type { StyleOptions } from '../types';
import IconButton from './IconButton';
import { CopyIcon } from './icons/CopyIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SvgIcon } from './icons/SvgIcon';

// This tells TypeScript that htmlToImage exists globally, loaded from the CDN
declare const htmlToImage: any;

interface PreviewAreaProps {
  text: string;
  styles: StyleOptions;
  fontFamily: string;
  isTransparent: boolean;
}

type ButtonState = 'idle' | 'loading' | 'success';

const PreviewArea: React.FC<PreviewAreaProps> = ({ text, styles, fontFamily, isTransparent }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [copyState, setCopyState] = useState<ButtonState>('idle');
  const [downloadState, setDownloadState] = useState<ButtonState>('idle');
  const [downloadSvgState, setDownloadSvgState] = useState<ButtonState>('idle');

  useEffect(() => {
    const wrapperNode = wrapperRef.current;
    if (!wrapperNode) return;

    const calculateScale = () => {
      if (wrapperNode) {
        const wrapperWidth = wrapperNode.offsetWidth;
        const newScale = wrapperWidth / 896; // 896 is the base width of the preview
        setScale(newScale < 1 ? newScale : 1); // Only scale down, not up
      }
    };

    const resizeObserver = new ResizeObserver(calculateScale);
    resizeObserver.observe(wrapperNode);

    calculateScale(); // Initial calculation

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const textStyle: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: `${styles.fontSize}px`,
    color: styles.color,
    letterSpacing: `${styles.letterSpacing}px`,
    lineHeight: styles.lineHeight,
    fontWeight: styles.isBold ? 'bold' : 'normal',
    fontStyle: styles.isItalic ? 'italic' : 'normal',
    textDecoration: styles.isUnderline ? 'underline' : 'none',
    textShadow: styles.shadowEnabled ? `2px 2px 4px ${styles.shadowColor}` : 'none',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    textAlign: styles.textAlign,
  };

  const generateImage = async (format: 'blob' | 'png') => {
    if (!previewRef.current) return null;

    const node = previewRef.current;
    const originalClassName = node.className;
    const originalBgStyle = node.style.backgroundColor;
    const originalTransform = node.style.transform;

    // Temporarily reset scale for full-resolution image capture
    node.style.transform = 'scale(1)';

    const options: any = { pixelRatio: 2, width: 896, height: 560 };
    
    if (isTransparent) {
      // Temporarily remove checkerboard and set background to transparent
      node.className = originalClassName.replace('checkerboard', '');
      node.style.backgroundColor = 'transparent';
    } else {
      // For non-transparent, set a background color in the options.
      options.backgroundColor = '#000000';
    }

    try {
      if (format === 'blob') {
        return await htmlToImage.toBlob(node, options);
      } else {
        return await htmlToImage.toPng(node, options);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
      return null;
    } finally {
      // Restore everything back to how it was for the UI
      node.style.transform = originalTransform;
      node.className = originalClassName;
      node.style.backgroundColor = originalBgStyle;
    }
  };
  
  const generateSvg = async () => {
    if (!previewRef.current) return null;

    const node = previewRef.current;
    const originalClassName = node.className;
    const originalBgStyle = node.style.backgroundColor;
    const originalTransform = node.style.transform;

    // Temporarily reset scale for full-resolution image capture
    node.style.transform = 'scale(1)';

    if (isTransparent) {
      node.className = originalClassName.replace('checkerboard', '');
      node.style.backgroundColor = 'transparent';
    } else {
      node.className = originalClassName.replace('checkerboard', '');
      node.style.backgroundColor = '#000000';
    }

    // Get all @font-face rules from stylesheets to embed them.
    let fontCss = '';
    for (const sheet of Array.from(document.styleSheets)) {
        try {
            if (sheet.cssRules) {
                for (const rule of Array.from(sheet.cssRules)) {
                    if (rule.constructor.name === 'CSSFontFaceRule') {
                        fontCss += rule.cssText;
                    }
                }
            }
        } catch (e) {
            console.warn("Could not read CSS rules from stylesheet: " + sheet.href, e);
        }
    }

    try {
      const dataUrl = await htmlToImage.toSvg(node, {
        width: 896,
        height: 560,
        fontEmbedCss: fontCss,
      });
      return dataUrl;
    } catch (error) {
      console.error('SVG generation failed:', error);
      return null;
    } finally {
      // Restore everything back to how it was for the UI
      node.style.transform = originalTransform;
      node.className = originalClassName;
      node.style.backgroundColor = originalBgStyle;
    }
  };


  const handleCopyImage = async () => {
    setCopyState('loading');
    const blob = await generateImage('blob');
    if (blob) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopyState('success');
      } catch (err) {
        console.error('Failed to copy image:', err);
        alert('Failed to copy image to clipboard.');
        setCopyState('idle');
      }
    } else {
      setCopyState('idle');
    }
    setTimeout(() => setCopyState('idle'), 2000);
  };

  const handleDownloadImage = async () => {
    setDownloadState('loading');
    const dataUrl = await generateImage('png');
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = 'styled-text.png';
      link.href = dataUrl;
      link.click();
      setDownloadState('success');
    } else {
       setDownloadState('idle');
    }
    setTimeout(() => setDownloadState('idle'), 2000);
  };

  const handleDownloadSvg = async () => {
    setDownloadSvgState('loading');
    const dataUrl = await generateSvg();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = 'styled-text.svg';
      link.href = dataUrl;
      link.click();
      setDownloadSvgState('success');
    } else {
       setDownloadSvgState('idle');
    }
    setTimeout(() => setDownloadSvgState('idle'), 2000);
  };

  const getButtonText = (state: ButtonState, baseText: string) => {
    if (state === 'loading') return 'Generating...';
    if (state === 'success') return 'Done!';
    return baseText;
  }

  return (
    <div className="bg-dark-card/60 backdrop-blur-xl border border-dark-border/50 p-6 rounded-2xl shadow-lg sticky top-8">
      <div 
        ref={wrapperRef} 
        className="w-full overflow-hidden" 
        style={{ height: 560 * scale }}
      >
        <div
          ref={previewRef}
          style={{
            width: '896px',
            height: '560px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className={`flex items-center justify-center p-4 sm:p-8 rounded-md border border-dark-border ${isTransparent ? 'checkerboard' : 'bg-dark-bg'}`}
        >
          <p style={textStyle} className="w-full">{text || "Your text will appear here"}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <IconButton 
          text={getButtonText(copyState, 'Copy as Image')}
          icon={<CopyIcon />}
          onClick={handleCopyImage}
          disabled={copyState !== 'idle'}
          fullWidth
        />
        <IconButton
          text={getButtonText(downloadState, 'Download PNG')}
          icon={<DownloadIcon />}
          onClick={handleDownloadImage}
          disabled={downloadState !== 'idle'}
          fullWidth
        />
        <IconButton
          text={getButtonText(downloadSvgState, 'Download SVG')}
          icon={<SvgIcon />}
          onClick={handleDownloadSvg}
          disabled={downloadSvgState !== 'idle'}
          fullWidth
        />
      </div>
    </div>
  );
};

export default PreviewArea;
