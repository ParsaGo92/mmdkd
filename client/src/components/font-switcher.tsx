import { useState, useRef, useEffect } from "react";

export default function FontSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFont, setCurrentFont] = useState('pixelated');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fontOptions = [
    { 
      key: 'pixelated', 
      label: 'Pixelated', 
      preview: 'Aa',
      description: 'retro style'
    },
    { 
      key: 'monospace', 
      label: 'Monospace', 
      preview: 'Aa',
      description: 'for the hack0rs'
    },
    { 
      key: 'inter', 
      label: 'Inter', 
      preview: 'Aa',
      description: 'dyslexia-friendly'
    },
    { 
      key: 'comic', 
      label: 'Comic Sans', 
      preview: 'Aa',
      description: 'funny and silly'
    }
  ];

  useEffect(() => {
    // Initialize from localStorage or default to pixelated
    try {
      const savedTheme = localStorage.getItem('font-theme');
      if (savedTheme && ['pixelated', 'monospace', 'inter', 'comic'].includes(savedTheme)) {
        setCurrentFont(savedTheme);
        document.documentElement.className = document.documentElement.className.replace(/font-theme-\w+/g, '');
        document.documentElement.classList.add(`font-theme-${savedTheme}`);
      } else {
        document.documentElement.classList.add('font-theme-pixelated');
      }
    } catch (e) {
      document.documentElement.classList.add('font-theme-pixelated');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFontChange = (fontKey: string) => {
    setCurrentFont(fontKey);
    
    // Update documentElement class
    document.documentElement.className = document.documentElement.className.replace(/font-theme-\w+/g, '');
    document.documentElement.classList.add(`font-theme-${fontKey}`);
    
    // Save to localStorage
    localStorage.setItem('font-theme', fontKey);
    
    setIsOpen(false);
  };

  return (
    <div className="font-switcher" ref={dropdownRef} data-testid="font-switcher">
      <button 
        aria-label="Font switcher" 
        className="font-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-font-switcher"
      >
        <svg fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20">
          <path d="M4 7V4h16v3"></path>
          <path d="M9 20h6"></path>
          <path d="M12 4v16"></path>
        </svg>
        <span className="sr-only">Change font</span>
      </button>
      
      {isOpen && (
        <div className="font-dropdown" data-testid="font-dropdown">
          <div className="dropdown-header">FONT THEMES</div>
          {fontOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => handleFontChange(option.key)}
              className={`font-option ${currentFont === option.key ? 'active' : ''}`}
              data-testid={`button-font-${option.key}`}
            >
              <div className="font-preview" style={{ 
                fontFamily: option.key === 'pixelated' ? '"Press Start 2P", monospace' :
                           option.key === 'monospace' ? '"JetBrains Mono", monospace' :
                           option.key === 'inter' ? '"Inter", sans-serif' :
                           option.key === 'comic' ? '"Comic Sans MS", cursive, sans-serif' : undefined
              }}>
                {option.preview}
              </div>
              <div className="font-details">
                <h4>{option.label}</h4>
                <p>{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}