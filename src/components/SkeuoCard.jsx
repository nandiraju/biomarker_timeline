import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function SkeuoCard({ 
  title, 
  icon: IconComponent, 
  iconColor = "var(--glow-ctdna)", 
  desc, 
  children,
  className = "" 
}) {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <>
      {isMaximized && (
        <div 
          className="maximized-backdrop" 
          onClick={() => setIsMaximized(false)} 
        />
      )}
      <div className={`skeuo-panel ${isMaximized ? 'maximized' : ''} ${className}`}>
        {/* Decorative mechanical screws in the corners for a realistic physical design */}
        <div className="skeuo-screw screw-tl"></div>
        <div className="skeuo-screw screw-tr"></div>
        <div className="skeuo-screw screw-bl"></div>
        <div className="skeuo-screw screw-br"></div>
        
        <div className="card-header-container">
          <div className="card-title-group">
            <button 
              type="button"
              className="card-num-btn"
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? "Exit Fullscreen" : "Maximize to Fullscreen"}
              style={{
                background: '#10151c',
                color: isMaximized ? '#ef4444' : '#38bdf8',
                border: '1px solid #1a222d',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.05)',
                transition: 'all 0.15s ease',
                padding: 0
              }}
            >
              {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
            <h3 className="card-title">{title}</h3>
          </div>
          {IconComponent && (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: iconColor,
                filter: `drop-shadow(0 0 4px ${iconColor})` 
              }}
            >
              <IconComponent size={18} />
            </div>
          )}
        </div>

        <div className="skeuo-inset-screen">
          {children}
        </div>

        {desc && <p className="card-desc">{desc}</p>}
      </div>
    </>
  );
}

