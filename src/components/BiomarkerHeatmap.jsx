import React, { useState } from 'react';

export default function BiomarkerHeatmap({ patient, activeTimepoint, setActiveTimepoint }) {
  const [hoverCell, setHoverCell] = useState(null); // { rowIdx, colIdx }
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, val: "", name: "" });

  const heatmapData = patient.heatmap;
  const timepoints = patient.timepoints;

  // Color mapping helper based on relative value (0.0 to 1.0)
  const getCellColor = (relativeVal) => {
    // 1.0 (High) -> Red/Orange
    // 0.0 (Low) -> Blue
    if (relativeVal >= 0.8) return 'rgba(220, 38, 38, 0.85)';    // Dark Red
    if (relativeVal >= 0.6) return 'rgba(249, 115, 22, 0.85)';   // Orange
    if (relativeVal >= 0.4) return 'rgba(234, 179, 8, 0.85)';    // Yellow/Amber
    if (relativeVal >= 0.2) return 'rgba(16, 185, 129, 0.85)';   // Green/Teal
    if (relativeVal >= 0.05) return 'rgba(14, 165, 233, 0.85)';  // Light Blue
    return 'rgba(29, 78, 216, 0.85)';                           // Deep Blue
  };

  const handleCellMouseMove = (e, rowIdx, colIdx, val, name) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + e.currentTarget.offsetLeft;
    const y = e.clientY - rect.top + e.currentTarget.offsetTop;
    
    // Formatting values nicely
    let formattedVal = val.toLocaleString();
    if (name.includes("CEA") || name.includes("NSE")) {
      formattedVal = val.toFixed(1);
    } else if (name.includes("PD-L1") || name.includes("%")) {
      formattedVal = `${val}%`;
    }

    setTooltipPos({
      x,
      y: y - 45,
      val: formattedVal,
      name
    });
    setHoverCell({ rowIdx, colIdx });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', position: 'relative' }}>
      
      {/* Table Grid Wrapper */}
      <div className="skeuo-table-wrapper" style={{ border: '1px solid #1a222d', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr>
              <th style={{ 
                background: '#161d25', 
                color: 'var(--text-secondary)', 
                padding: '0.5rem', 
                textAlign: 'left',
                borderBottom: '2px solid #202935'
              }}>
                Biomarker
              </th>
              {timepoints.map((tp, colIdx) => {
                const isSelected = activeTimepoint === colIdx;
                return (
                  <th 
                    key={colIdx} 
                    onClick={() => setActiveTimepoint(colIdx)}
                    style={{ 
                      background: isSelected ? 'rgba(56, 189, 248, 0.15)' : '#161d25',
                      color: isSelected ? '#38bdf8' : 'var(--text-secondary)',
                      padding: '0.5rem', 
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderBottom: isSelected ? '2px solid #38bdf8' : '2px solid #202935',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem'
                    }}
                  >
                    T{colIdx}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td style={{ 
                  background: '#0a0d12', 
                  color: 'var(--text-primary)', 
                  fontWeight: 600, 
                  padding: '0.5rem',
                  borderBottom: '1px solid #161b22',
                  fontSize: '0.72rem'
                }}>
                  {row.name.split(' ')[0]} 
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.2rem' }}>
                    {row.name.substring(row.name.indexOf(' '))}
                  </span>
                </td>
                
                {row.values.map((val, colIdx) => {
                  const relativeVal = row.relative[colIdx];
                  const bgCellColor = getCellColor(relativeVal);
                  const isColActive = activeTimepoint === colIdx;
                  const isCellHovered = hoverCell && hoverCell.rowIdx === rowIdx && hoverCell.colIdx === colIdx;
                  
                  return (
                    <td
                      key={colIdx}
                      onMouseEnter={(e) => handleCellMouseMove(e, rowIdx, colIdx, val, row.name)}
                      onMouseMove={(e) => handleCellMouseMove(e, rowIdx, colIdx, val, row.name)}
                      onMouseLeave={() => setHoverCell(null)}
                      onClick={() => setActiveTimepoint(colIdx)}
                      style={{
                        backgroundColor: bgCellColor,
                        padding: '0.5rem',
                        textAlign: 'center',
                        color: '#ffffff',
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(0,0,0,0.15)',
                        borderRight: '1px solid rgba(0,0,0,0.15)',
                        transition: 'all 0.1s ease',
                        boxShadow: isCellHovered 
                          ? 'inset 0 0 0 2px #ffffff, 0 0 8px rgba(255, 255, 255, 0.5)' 
                          : isColActive 
                          ? 'inset 0 0 0 1px rgba(255, 255, 255, 0.4)' 
                          : 'none',
                        transform: isCellHovered ? 'scale(1.05)' : 'none',
                        zIndex: isCellHovered ? 10 : 1
                      }}
                    >
                      <span style={{ 
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {val === 0 ? "ND" : val > 999 ? val.toLocaleString() : val}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Heatmap Legend Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.2rem' }}>
        <div style={{ 
          height: '8px', 
          borderRadius: '4px',
          background: 'linear-gradient(90deg, rgba(29, 78, 216, 0.85) 0%, rgba(16, 185, 129, 0.85) 40%, rgba(234, 179, 8, 0.85) 65%, rgba(249, 115, 22, 0.85) 85%, rgba(220, 38, 38, 0.85) 100%)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <span>LOW (Cleared)</span>
          <span>RELATIVE INTENSITY</span>
          <span>HIGH (Active)</span>
        </div>
      </div>

      {/* Tooltip Overlay */}
      {hoverCell !== null && (
        <div 
          className="chart-tooltip"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <div className="chart-tooltip-title">T{hoverCell.colIdx} Snapshot</div>
          <div className="chart-tooltip-item">
            <span style={{ color: 'var(--glow-ctdna)' }}>{tooltipPos.name}:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{tooltipPos.val}</span>
          </div>
        </div>
      )}
    </div>
  );
}
