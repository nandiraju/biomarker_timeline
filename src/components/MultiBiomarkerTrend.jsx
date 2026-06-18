import React, { useState } from 'react';

export default function MultiBiomarkerTrend({ patient, activeTimepoint, setActiveTimepoint }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, label: "" });

  const ctDNANorm = patient.normalizedData.ctDNA;
  const ceaNorm = patient.normalizedData.CEA;
  const tumorNorm = patient.normalizedData.tumorSize;
  const timepoints = patient.timepoints;

  // Chart dimensions
  const width = 300;
  const height = 150;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Y-axis percentage limits (0 to 150%)
  const yMin = 0;
  const yMax = 150;

  const getX = (index) => {
    return paddingLeft + (index / (timepoints.length - 1)) * chartWidth;
  };

  const getY = (value) => {
    // Clip percentage to yMax
    const clippedVal = Math.min(Math.max(value, yMin), yMax);
    const ratio = clippedVal / yMax;
    return paddingTop + chartHeight - (ratio * chartHeight);
  };

  // SVG coordinate calculations
  const ctDNAPoints = ctDNANorm.map((val, idx) => ({ x: getX(idx), y: getY(val), val, idx }));
  const ceaPoints = ceaNorm.map((val, idx) => ({ x: getX(idx), y: getY(val), val, idx }));
  const tumorPoints = tumorNorm.map((val, idx) => ({ x: getX(idx), y: getY(val), val, idx }));

  const ctDNAPath = ctDNAPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const ceaPath = ceaPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const tumorPath = tumorPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltipPos({
      x,
      y: y - 50,
      label: patient.timepointLabels[index]
    });
    setHoverIdx(index);
  };

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Legend Block */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '0.8rem', 
        fontSize: '0.65rem', 
        fontWeight: 600,
        marginBottom: '0.3rem',
        marginTop: '-0.3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--glow-ctdna)' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
          ctDNA
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--glow-cea)' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'currentColor' }} />
          CEA
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--glow-tumor)' }}>
          <span style={{ 
            display: 'inline-block', 
            width: 0, height: 0, 
            borderLeft: '4px solid transparent', 
            borderRight: '4px solid transparent', 
            borderBottom: '6px solid currentColor' 
          }} />
          Tumor Size
        </div>
      </div>

      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="interactive-svg"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <filter id="glow-ctdna-f" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" /><feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-cea-f" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" /><feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-tumor-f" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" /><feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Y-axis gridlines (0%, 50%, 100%, 150%) */}
        {[0, 50, 100, 150].map((pct, i) => {
          const y = getY(pct);
          return (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke={pct === 100 ? "rgba(255,255,255,0.12)" : "#161b22"}
                strokeWidth={pct === 100 ? 1.5 : 1}
                strokeDasharray={pct === 100 ? "none" : "2,2"}
              />
              <text
                x={paddingLeft - 6}
                y={y + 3}
                fill="var(--text-muted)"
                fontSize="7"
                fontFamily="var(--font-mono)"
                textAnchor="end"
              >
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Vertical timepoint ticks */}
        {timepoints.map((tp, idx) => {
          const x = getX(idx);
          const isSelected = activeTimepoint === idx;
          return (
            <g key={idx}>
              <line
                x1={x}
                y1={paddingTop}
                x2={x}
                y2={paddingTop + chartHeight}
                stroke={isSelected ? "rgba(56, 189, 248, 0.2)" : "#161b22"}
                strokeWidth={isSelected ? 1.5 : 1}
              />
              {/* Hotspot rectangle for vertical hover selection */}
              <rect
                x={x - chartWidth / (timepoints.length * 2)}
                y={paddingTop}
                width={chartWidth / (timepoints.length - 1)}
                height={chartHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => handleMouseMove(e, idx)}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => setHoverIdx(null)}
                onClick={() => setActiveTimepoint(idx)}
              />
              <text
                x={x}
                y={paddingTop + chartHeight + 12}
                fill={isSelected ? "#38bdf8" : "var(--text-muted)"}
                fontSize="7"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                fontWeight={isSelected ? 'bold' : 'normal'}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveTimepoint(idx)}
              >
                T{idx}
              </text>
            </g>
          );
        })}

        {/* Shading/guidance vertical bar on hover */}
        {hoverIdx !== null && (
          <rect
            x={getX(hoverIdx) - 8}
            y={paddingTop}
            width={16}
            height={chartHeight}
            fill="rgba(56, 189, 248, 0.04)"
            pointerEvents="none"
          />
        )}

        {/* Curve 1: ctDNA (solid, blue) */}
        <path
          d={ctDNAPath}
          fill="none"
          stroke="var(--glow-ctdna)"
          strokeWidth="2"
          filter="url(#glow-ctdna-f)"
          className="glow-line"
          style={{ color: 'var(--glow-ctdna)' }}
        />

        {/* Curve 2: CEA (dashed, green) */}
        <path
          d={ceaPath}
          fill="none"
          stroke="var(--glow-cea)"
          strokeWidth="1.8"
          strokeDasharray="3,3"
          filter="url(#glow-cea-f)"
          className="glow-line"
          style={{ color: 'var(--glow-cea)' }}
        />

        {/* Curve 3: Tumor Size (dotted-dashed, purple) */}
        <path
          d={tumorPath}
          fill="none"
          stroke="var(--glow-tumor)"
          strokeWidth="1.8"
          strokeDasharray="6,2,2,2"
          filter="url(#glow-tumor-f)"
          className="glow-line"
          style={{ color: 'var(--glow-tumor)' }}
        />

        {/* Interactive node drawings */}
        {timepoints.map((tp, idx) => {
          const isSelected = activeTimepoint === idx;
          const isHovered = hoverIdx === idx;
          const strokeW = isSelected || isHovered ? 2.5 : 1;
          const strokeCol = isSelected || isHovered ? "#ffffff" : "currentColor";
          
          return (
            <g key={idx}>
              {/* ctDNA point (Circle) */}
              <circle
                cx={ctDNAPoints[idx].x}
                cy={ctDNAPoints[idx].y}
                r={isSelected || isHovered ? 4.5 : 2.5}
                fill="#0d1115"
                stroke={strokeCol}
                strokeWidth={strokeW}
                style={{ color: 'var(--glow-ctdna)' }}
              />

              {/* CEA point (Square) */}
              <rect
                x={ceaPoints[idx].x - (isSelected || isHovered ? 4 : 2.5)}
                y={ceaPoints[idx].y - (isSelected || isHovered ? 4 : 2.5)}
                width={isSelected || isHovered ? 8 : 5}
                height={isSelected || isHovered ? 8 : 5}
                fill="#0d1115"
                stroke={strokeCol}
                strokeWidth={strokeW}
                style={{ color: 'var(--glow-cea)' }}
              />

              {/* Tumor point (Triangle) */}
              <polygon
                points={`
                  ${tumorPoints[idx].x},${tumorPoints[idx].y - (isSelected || isHovered ? 5.5 : 3.5)} 
                  ${tumorPoints[idx].x - (isSelected || isHovered ? 5.5 : 3.5)},${tumorPoints[idx].y + (isSelected || isHovered ? 4.5 : 2.5)} 
                  ${tumorPoints[idx].x + (isSelected || isHovered ? 5.5 : 3.5)},${tumorPoints[idx].y + (isSelected || isHovered ? 4.5 : 2.5)}
                `}
                fill="#0d1115"
                stroke={strokeCol}
                strokeWidth={strokeW}
                style={{ color: 'var(--glow-tumor)' }}
              />
            </g>
          );
        })}
      </svg>

      {/* Shared Tooltip Overlay */}
      {hoverIdx !== null && (
        <div 
          className="chart-tooltip"
          style={{
            left: `${(tooltipPos.x / width) * 100}%`,
            top: `${(tooltipPos.y / height) * 100}%`,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <div className="chart-tooltip-title">{tooltipPos.label}</div>
          <div className="chart-tooltip-item">
            <span style={{ color: 'var(--glow-ctdna)' }}>ctDNA:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{ctDNANorm[hoverIdx]}%</span>
          </div>
          <div className="chart-tooltip-item">
            <span style={{ color: 'var(--glow-cea)' }}>CEA:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{ceaNorm[hoverIdx]}%</span>
          </div>
          <div className="chart-tooltip-item">
            <span style={{ color: 'var(--glow-tumor)' }}>Tumor Size:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{tumorNorm[hoverIdx]}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
