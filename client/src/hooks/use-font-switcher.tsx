import { useState, useEffect } from 'react';

export function useFontSwitcher() {
  const [currentFont, setCurrentFont] = useState<string>('pixelated');

  useEffect(() => {
    const savedFont = localStorage.getItem('selectedFont') || 'pixelated';
    setCurrentFont(savedFont);
    applyFont(savedFont);
  }, []);

  const setFont = (fontType: string) => {
    setCurrentFont(fontType);
    applyFont(fontType);
    localStorage.setItem('selectedFont', fontType);
  };

  const applyFont = (fontType: string) => {
    const body = document.body;
    
    // Remove existing font classes
    body.classList.remove('font-pixelated');
    body.style.fontFamily = '';

    switch (fontType) {
      case 'pixelated':
        body.classList.add('font-pixelated');
        break;
      case 'mono':
        body.style.fontFamily = "'Fira Code', monospace";
        break;
      case 'sans':
        body.style.fontFamily = "'Inter', sans-serif";
        break;
      case 'comic':
        body.style.fontFamily = "'Comic Neue', cursive";
        break;
    }
  };

  return { currentFont, setFont };
}
