import React, { useState } from 'react';

const PATIENT_COLORS = {
  'pat-001': '#38bdf8',
  'pat-002': '#10b981',
  'pat-003': '#ef4444',
};

const PATIENT_GLOW_IDS = {
  'pat-001': 'glow-ctdna-filter',
  'pat-002': 'glow-cea-filter',
  'pat-003': 'glow-danger-filter',
};

export default function SingleBiomarkerTrend({ patient, patients, activeTimepoint, setActiveTimepoint }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Multi-patient mode when `patients` array is passed
  const isMulti = Array.isArray(patients) && patients.length > 1;
  const dataSource = isMulti ? patients : [patient];

  const timepoints = dataSource[0].timepoints;

  const width = 300;
  const height = 150;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const logMin = 0;
  const logMax = 4.5;

  const getX = (index) => paddingLeft + (index / (timepoints.length - 1)) * chartWidth;
  const getY = (value) => {
    let logVal = value > 0 ? Math.log10(value) : 0;
    logVal = Math.min(Math.max(logVal, logMin), logMax);
    return paddingTop + chartHeight - ((logVal - logMin) / (logMax - logMin)) * chartHeight;
  };

  const handleMouseMove = (e, idx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 45 });
    setHoverIdx(idx);
  };

  return (
    <div style={{ position: 'relative' }}>

      {/* Legend for multi-patient */}
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

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="interactive-svg"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          {['ctdna', 'cea', 'danger'].map(id => (
            <filter key={id} id={`glow-${id}-filter`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
          <linearGradient id="area-gradient-0" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines (log scale) */}
        {[1, 10, 100, 1000, 10000].map((gridVal, i) => {
          const y = getY(gridVal);
          return (
            <g key={i}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y}
                stroke="#1f2937" strokeDasharray="2,2" strokeWidth={1} />
              <text x={paddingLeft - 8} y={y + 3} fill="var(--text-muted)" fontSize="7"
                fontFamily="var(--font-mono)" textAnchor="end">
                10{['⁰','¹','²','³','⁴'][i]}
              </text>
            </g>
          );
        })}

        {/* Vertical timepoint lines */}
        {timepoints.map((_, idx) => {
          const x = getX(idx);
          const isSelected = activeTimepoint === idx;
          return (
            <g key={idx}>
              <line x1={x} y1={paddingTop} x2={x} y2={paddingTop + chartHeight}
                stroke={isSelected ? 'rgba(56,189,248,0.2)' : '#161b22'}
                strokeWidth={isSelected ? 1.5 : 1} />
              <text x={x} y={paddingTop + chartHeight + 12}
                fill={isSelected ? '#38bdf8' : 'var(--text-muted)'}
                fontSize="7" fontFamily="var(--font-mono)" textAnchor="middle"
                fontWeight={isSelected ? 'bold' : 'normal'}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveTimepoint(idx)}>
                T{idx}
              </text>
            </g>
          );
        })}

        {/* Shaded area for first/single patient */}
        {!isMulti && (() => {
          const pts = dataSource[0].ctDNA.map((v, i) => ({ x: getX(i), y: getY(v) }));
          const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
          const areaPath = `${linePath} L ${getX(pts.length - 1)} ${paddingTop + chartHeight} L ${getX(0)} ${paddingTop + chartHeight} Z`;
          return <path d={areaPath} fill="url(#area-gradient-0)" />;
        })()}

        {/* Draw lines per patient */}
        {dataSource.map((p, pIdx) => {
          const color = PATIENT_COLORS[p.id] || '#38bdf8';
          const filterId = PATIENT_GLOW_IDS[p.id] || 'glow-ctdna-filter';
          const pts = p.ctDNA.map((v, i) => ({ x: getX(i), y: getY(v), val: v, idx: i }));
          const linePath = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
          return (
            <g key={p.id}>
              <path d={linePath} fill="none" stroke={color} strokeWidth={isMulti ? 2 : 2.5}
                filter={`url(#${filterId})`} className="glow-line" style={{ color }} />
              {pts.map((pt) => {
                const isSelected = activeTimepoint === pt.idx;
                const isHovered = hoverIdx === pt.idx;
                return (
                  <circle key={pt.idx} cx={pt.x} cy={pt.y}
                    r={isHovered ? 5.5 : isSelected ? 4.5 : 3}
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

        {/* Vertical crosshair on hover */}
        {hoverIdx !== null && (
          <line x1={getX(hoverIdx)} y1={paddingTop} x2={getX(hoverIdx)} y2={paddingTop + chartHeight}
            stroke="rgba(255,255,255,0.15)" strokeDasharray="2,2" strokeWidth="1.5" pointerEvents="none" />
        )}
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
          {dataSource.map(p => (
            <div key={p.id} className="chart-tooltip-item">
              <span style={{ color: PATIENT_COLORS[p.id] }}>{p.name.split(' ')[0]}:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                {p.ctDNA[hoverIdx] === 0 ? 'ND' : `${p.ctDNA[hoverIdx].toLocaleString()} cps/mL`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
