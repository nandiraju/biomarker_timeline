import React, { useState } from 'react';

const PATIENT_COLORS = {
  'pat-001': '#38bdf8',
  'pat-002': '#10b981',
  'pat-003': '#ef4444',
};

export default function ResponseSpiderPlot({ patient, patients, activeTimepoint, setActiveTimepoint }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const isMulti = Array.isArray(patients) && patients.length > 1;
  const dataSource = isMulti ? patients : [patient];
  const timepoints = dataSource[0].timepoints;

  const width = 300;
  const height = 150;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const yMin = -100;
  const yMax = 50;

  const getX = (index) => paddingLeft + (index / (timepoints.length - 1)) * chartWidth;
  const getY = (value) => {
    const clamped = Math.min(Math.max(value, yMin), yMax);
    return paddingTop + chartHeight - ((clamped - yMin) / (yMax - yMin)) * chartHeight;
  };

  const handleMouseMove = (e, idx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 55 });
    setHoverIdx(idx);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Multi-patient legend */}
      {isMulti && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.65rem', fontWeight: 600, marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          {patients.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: PATIENT_COLORS[p.id] }}>
              <span style={{ display: 'inline-block', width: '16px', height: '2px', backgroundColor: PATIENT_COLORS[p.id], boxShadow: `0 0 4px ${PATIENT_COLORS[p.id]}` }} />
              {p.name.split(' ')[0]}
            </div>
          ))}
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="interactive-svg" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          {dataSource.map(p => (
            <filter key={p.id} id={`glow-spider-${p.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
        </defs>

        {/* Shaded response zones */}
        <rect x={paddingLeft} y={getY(yMax)} width={chartWidth} height={getY(20) - getY(yMax)} fill="rgba(239,68,68,0.05)" />
        <rect x={paddingLeft} y={getY(20)} width={chartWidth} height={getY(-30) - getY(20)} fill="rgba(245,158,11,0.03)" />
        <rect x={paddingLeft} y={getY(-30)} width={chartWidth} height={getY(yMin) - getY(-30)} fill="rgba(16,185,129,0.05)" />

        {/* Grid lines */}
        {[50, 20, 0, -20, -40, -60, -80, -100].map((val, i) => {
          const y = getY(val);
          return (
            <g key={i}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y}
                stroke={val === 0 ? 'rgba(255,255,255,0.2)' : '#161b22'}
                strokeWidth={val === 0 ? 1.5 : 1}
                strokeDasharray={val === 20 || val === -30 ? '2,2' : 'none'} />
              <text x={paddingLeft - 6} y={y + 3} fill="var(--text-muted)" fontSize="7"
                fontFamily="var(--font-mono)" textAnchor="end">
                {val > 0 ? `+${val}` : val}%
              </text>
            </g>
          );
        })}

        {/* Threshold labels */}
        <line x1={paddingLeft} y1={getY(20)} x2={width - paddingRight} y2={getY(20)}
          stroke="var(--glow-danger)" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
        <text x={width - paddingRight - 4} y={getY(20) - 4} fill="var(--glow-danger)"
          fontSize="6" fontWeight="bold" textAnchor="end">Progressive (&gt;+20%)</text>

        <line x1={paddingLeft} y1={getY(-30)} x2={width - paddingRight} y2={getY(-30)}
          stroke="var(--glow-cea)" strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
        <text x={width - paddingRight - 4} y={getY(-30) + 8} fill="var(--glow-cea)"
          fontSize="6" fontWeight="bold" textAnchor="end">Partial Response (≤-30%)</text>

        {/* Baseline label */}
        <text x={paddingLeft + 4} y={getY(0) - 4} fill="var(--text-muted)" fontSize="6" fontWeight="bold">Baseline</text>

        {/* Vertical timepoint lines */}
        {timepoints.map((_, idx) => {
          const x = getX(idx);
          const isSelected = activeTimepoint === idx;
          return (
            <g key={idx}>
              <line x1={x} y1={paddingTop} x2={x} y2={paddingTop + chartHeight}
                stroke={isSelected ? 'rgba(56,189,248,0.2)' : '#161b22'}
                strokeWidth={isSelected ? 1.5 : 1} />
              <text x={x} y={paddingTop + chartHeight + 12} fill={isSelected ? '#38bdf8' : 'var(--text-muted)'}
                fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle"
                fontWeight={isSelected ? 'bold' : 'normal'}
                style={{ cursor: 'pointer' }} onClick={() => setActiveTimepoint(idx)}>
                T{idx}
              </text>
            </g>
          );
        })}

        {/* Crosshair */}
        {hoverIdx !== null && (
          <line x1={getX(hoverIdx)} y1={paddingTop} x2={getX(hoverIdx)} y2={paddingTop + chartHeight}
            stroke="rgba(255,255,255,0.15)" strokeDasharray="2,2" strokeWidth="1.5" pointerEvents="none" />
        )}

        {/* Lines + dots per patient */}
        {dataSource.map(p => {
          const color = PATIENT_COLORS[p.id] || '#38bdf8';
          const pts = p.tumorBurdenChange.map((v, i) => ({ x: getX(i), y: getY(v), val: v, idx: i }));
          const linePath = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
          return (
            <g key={p.id}>
              <path d={linePath} fill="none" stroke={color} strokeWidth={isMulti ? 2 : 2.2}
                filter={`url(#glow-spider-${p.id})`} className="glow-line" style={{ color }} />
              {pts.map(pt => {
                const isSelected = activeTimepoint === pt.idx;
                const isHovered = hoverIdx === pt.idx;
                return (
                  <circle key={pt.idx} cx={pt.x} cy={pt.y}
                    r={isHovered ? 5 : isSelected ? 4 : 2.5}
                    fill="#0d1115"
                    stroke={isSelected || isHovered ? '#ffffff' : color}
                    strokeWidth={isSelected || isHovered ? 2.5 : 1.5}
                    style={{ filter: isSelected || isHovered ? `drop-shadow(0 0 4px ${color})` : 'none', transition: 'all 0.15s ease', cursor: 'pointer' }}
                    onMouseEnter={(e) => handleMouseMove(e, pt.idx)}
                    onMouseMove={(e) => handleMouseMove(e, pt.idx)}
                    onMouseLeave={() => setHoverIdx(null)}
                    onClick={() => setActiveTimepoint(pt.idx)}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoverIdx !== null && (
        <div className="chart-tooltip" style={{
          left: `${(tooltipPos.x / width) * 100}%`,
          top: `${(tooltipPos.y / height) * 100}%`,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}>
          <div className="chart-tooltip-title">{dataSource[0].timepointLabels[hoverIdx]}</div>
          {dataSource.map(p => {
            const val = p.tumorBurdenChange[hoverIdx];
            return (
              <div key={p.id} className="chart-tooltip-item">
                <span style={{ color: PATIENT_COLORS[p.id] }}>{p.name.split(' ')[0]}:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {val > 0 ? `+${val}` : val}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
