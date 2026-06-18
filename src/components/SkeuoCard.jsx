import React from 'react';

export default function SkeuoCard({ 
  number, 
  title, 
  icon: IconComponent, 
  iconColor = "var(--glow-ctdna)", 
  desc, 
  children,
  className = "" 
}) {
  return (
    <div className={`skeuo-panel ${className}`}>
      {/* Decorative mechanical screws in the corners for a realistic physical design */}
      <div className="skeuo-screw screw-tl"></div>
      <div className="skeuo-screw screw-tr"></div>
      <div className="skeuo-screw screw-bl"></div>
      <div className="skeuo-screw screw-br"></div>
      
      <div className="card-header-container">
        <div className="card-title-group">
          {number && <span className="card-num">{number}</span>}
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
  );
}
