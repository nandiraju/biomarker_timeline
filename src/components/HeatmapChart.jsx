import React, { useState } from 'react';

const PATIENT_COLORS = {
  'pat-001': '#38bdf8',
  'pat-002': '#10b981',
  'pat-003': '#ef4444',
};

// Continuous color scale: blue (0) → teal → green → yellow → orange → red (1)
function heatColor(t) {
  // clamp
  t = Math.min(1, Math.max(0, t));
  // 5 stops: 0=navy, 0.25=teal, 0.5=green, 0.75=amber, 1=crimson
  const stops = [
    [29, 78, 216],   // deep blue
    [6, 182, 212],   // teal
    [16, 185, 129],  // emerald
    [245, 158, 11],  // amber
    [220, 38,  38],  // red
  ];
  const seg = t * (stops.length - 1);
  const lo = Math.floor(seg);
  const hi = Math.min(lo + 1, stops.length - 1);
  const f = seg - lo;
  const r = Math.round(stops[lo][0] + f * (stops[hi][0] - stops[lo][0]));
  const g = Math.round(stops[lo][1] + f * (stops[hi][1] - stops[lo][1]));
  const b = Math.round(stops[lo][2] + f * (stops[hi][2] - stops[lo][2]));
  return `rgb(${r},${g},${b})`;
}

const BIOMARKER_LABELS = ['ctDNA', 'CEA', 'CA 19-9', 'NSE', 'LDH', 'PD-L1'];
const TIMEPOINT_LABELS = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5'];

export default function HeatmapChart({ patient, patients, activeTimepoint, setActiveTimepoint }) {
  const [hoverCell, setHoverCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, lines: [] });

  const isMulti = Array.isArray(patients) && patients.length > 1;
  const dataSource = isMulti ? patients : [patient];

  // ---- Layout geometry ----
  const svgW = 620;
  const rowH = 22;
  const colW = isMulti ? 20 : 36;
  const labelW = 58;        // left label space
  const patLabelH = isMulti ? 14 : 0; // extra height for patient-group headers
  const numBiomarkers = 6;
  const numTimepoints = 6;
  const numPatients = dataSource.length;

  // Total section height per patient group
  const sectionH = numBiomarkers * rowH;
  const sectionGap = isMulti ? 10 : 0;
  const headerH = 20; // timepoint column header row

  const svgH = headerH + numPatients * (patLabelH + sectionH) + (numPatients - 1) * sectionGap + 32; // +32 for legend

  const getSectionY = (pIdx) =>
    headerH + pIdx * (patLabelH + sectionH + sectionGap) + patLabelH;

  const getCellX = (tIdx, pIdx) => {
    if (!isMulti) return labelW + tIdx * colW;
    // In multi mode, group by timepoint: each T has `numPatients` sub-cols
    return labelW + tIdx * (numPatients * colW + 2) + pIdx * colW;
  };

  const handleCellHover = (e, pIdx, bIdx, tIdx, val, relVal) => {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverCell({ pIdx, bIdx, tIdx });
    const p = dataSource[pIdx];
    const raw = p.heatmap[bIdx].values[tIdx];
    const name = p.heatmap[bIdx].name;
    setTooltipPos({
      x, y: y - 50,
      lines: [
        { label: isMulti ? `${p.name.split(' ')[0]} — ${name}` : name, val: raw === 0 ? 'ND' : typeof raw === 'number' && !Number.isInteger(raw) ? raw.toFixed(1) : raw.toLocaleString() }
      ]
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="interactive-svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* ---- Column header: Timepoint labels ---- */}
        {TIMEPOINT_LABELS.map((tp, tIdx) => {
          const isActive = activeTimepoint === tIdx;
          // Center of this timepoint group
          const groupW = isMulti ? numPatients * colW + 2 : colW;
          const cx = labelW + tIdx * groupW + groupW / 2;
          return (
            <g key={tIdx} style={{ cursor: 'pointer' }} onClick={() => setActiveTimepoint(tIdx)}>
              <rect x={labelW + tIdx * groupW} y={0} width={groupW - 1} height={headerH - 2}
                fill={isActive ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.03)'}
                rx="3" />
              <text x={cx} y={headerH - 5} textAnchor="middle"
                fill={isActive ? '#38bdf8' : 'var(--text-secondary)'}
                fontSize="9" fontFamily="var(--font-mono)" fontWeight={isActive ? 'bold' : 'normal'}
                style={{ textShadow: isActive ? '0 0 5px rgba(56,189,248,0.8)' : 'none' }}>
                {tp}
              </text>
            </g>
          );
        })}

        {/* ---- Patient group sections ---- */}
        {dataSource.map((p, pIdx) => {
          const sectionY = getSectionY(pIdx);
          const color = PATIENT_COLORS[p.id] || '#38bdf8';

          return (
            <g key={p.id}>
              {/* Patient group label (multi-patient mode only) */}
              {isMulti && (
                <g>
                  <rect x={0} y={sectionY - patLabelH} width={svgW} height={patLabelH - 1}
                    fill={`${color}14`} />
                  <circle cx={8} cy={sectionY - patLabelH / 2} r={3.5}
                    fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
                  <text x={16} y={sectionY - patLabelH / 2 + 3}
                    fill={color} fontSize="8" fontWeight="bold" fontFamily="var(--font-mono)">
                    {p.name.toUpperCase()}
                  </text>
                </g>
              )}

              {/* Biomarker rows */}
              {BIOMARKER_LABELS.map((bLabel, bIdx) => {
                const rowY = sectionY + bIdx * rowH;
                const bioData = p.heatmap[bIdx];
                return (
                  <g key={bIdx}>
                    {/* Row background stripe */}
                    <rect x={0} y={rowY} width={svgW} height={rowH - 1}
                      fill={bIdx % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent'} />

                    {/* Biomarker label (left side, only first patient in multi mode) */}
                    {(!isMulti || pIdx === 0) && (
                      <text x={labelW - 6} y={rowY + rowH / 2 + 3}
                        textAnchor="end" fill="var(--text-primary)"
                        fontSize={isMulti ? "7.5" : "8"} fontWeight="600" fontFamily="var(--font-main)">
                        {bLabel}
                      </text>
                    )}
                    {isMulti && pIdx > 0 && (
                      <text x={labelW - 6} y={rowY + rowH / 2 + 3}
                        textAnchor="end" fill="var(--text-muted)"
                        fontSize="7.5" fontFamily="var(--font-main)">
                        {bLabel}
                      </text>
                    )}

                    {/* Heat cells */}
                    {bioData.relative.map((relVal, tIdx) => {
                      const cellX = getCellX(tIdx, pIdx);
                      const isActiveCol = activeTimepoint === tIdx;
                      const isHovered = hoverCell && hoverCell.pIdx === pIdx && hoverCell.bIdx === bIdx && hoverCell.tIdx === tIdx;
                      const fillColor = heatColor(relVal);

                      return (
                        <g key={tIdx}>
                          <rect
                            x={cellX + 0.5}
                            y={rowY + 1}
                            width={colW - 2}
                            height={rowH - 3}
                            rx="2"
                            fill={fillColor}
                            fillOpacity={isHovered ? 1 : 0.85}
                            stroke={isHovered ? '#ffffff' : isActiveCol ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)'}
                            strokeWidth={isHovered ? 1.5 : isActiveCol ? 1 : 0.5}
                            style={{ cursor: 'pointer', transition: 'all 0.1s ease' }}
                            onMouseEnter={(e) => handleCellHover(e, pIdx, bIdx, tIdx, bioData.values[tIdx], relVal)}
                            onMouseMove={(e) => handleCellHover(e, pIdx, bIdx, tIdx, bioData.values[tIdx], relVal)}
                            onMouseLeave={() => setHoverCell(null)}
                            onClick={() => setActiveTimepoint(tIdx)}
                          />
                          {/* Show value text only if cell is wide enough */}
                          {colW >= 30 && (
                            <text
                              x={cellX + colW / 2}
                              y={rowY + rowH / 2 + 3}
                              textAnchor="middle"
                              fill="rgba(0,0,0,0.85)"
                              fontSize="6.5"
                              fontWeight="700"
                              fontFamily="var(--font-mono)"
                              pointerEvents="none"
                              style={{ textShadow: '0 0 2px rgba(255,255,255,0.4)' }}
                            >
                              {bioData.values[tIdx] === 0 ? 'ND' :
                                bioData.values[tIdx] > 999 ? `${Math.round(bioData.values[tIdx] / 100) / 10}k` :
                                  bioData.values[tIdx]}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Section divider line between patient groups */}
              {isMulti && pIdx < dataSource.length - 1 && (
                <line
                  x1={0} y1={sectionY + sectionH + sectionGap / 2}
                  x2={svgW} y2={sectionY + sectionH + sectionGap / 2}
                  stroke="#2a3547" strokeWidth="1" />
              )}
            </g>
          );
        })}

        {/* ---- Color scale legend bar ---- */}
        {(() => {
          const legendY = svgH - 22;
          const legendX = labelW;
          const legendW = svgW - labelW - 10;
          const legendH = 8;
          const stops = 40;
          return (
            <g>
              {Array.from({ length: stops }, (_, i) => {
                const t = i / (stops - 1);
                return (
                  <rect key={i}
                    x={legendX + (i / stops) * legendW}
                    y={legendY}
                    width={legendW / stops + 0.5}
                    height={legendH}
                    fill={heatColor(t)} />
                );
              })}
              <rect x={legendX} y={legendY} width={legendW} height={legendH}
                fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" rx="2" />
              <text x={legendX} y={legendY + legendH + 9} fill="var(--text-muted)"
                fontSize="7" fontFamily="var(--font-main)" fontWeight="600">LOW (Cleared)</text>
              <text x={legendX + legendW / 2} y={legendY + legendH + 9} fill="var(--text-muted)"
                fontSize="7" fontFamily="var(--font-main)" fontWeight="600" textAnchor="middle">
                RELATIVE INTENSITY
              </text>
              <text x={legendX + legendW} y={legendY + legendH + 9} fill="var(--text-muted)"
                fontSize="7" fontFamily="var(--font-main)" fontWeight="600" textAnchor="end">HIGH (Active)</text>
            </g>
          );
        })()}

        {/* Active timepoint column highlight lines (top + bottom borders) */}
        {(() => {
          const groupW = isMulti ? numPatients * colW + 2 : colW;
          const x = labelW + activeTimepoint * groupW;
          const totalGridH = svgH - 32 - headerH;
          return (
            <rect x={x + 0.5} y={headerH} width={groupW - 2} height={totalGridH}
              fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1.5" rx="2" pointerEvents="none" />
          );
        })()}
      </svg>

      {/* Tooltip */}
      {hoverCell !== null && (
        <div className="chart-tooltip" style={{
          left: `${tooltipPos.x}px`,
          top: `${tooltipPos.y}px`,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}>
          <div className="chart-tooltip-title">T{hoverCell.tIdx} · {BIOMARKER_LABELS[hoverCell.bIdx]}</div>
          {tooltipPos.lines.map((l, i) => (
            <div key={i} className="chart-tooltip-item">
              <span style={{ color: PATIENT_COLORS[dataSource[hoverCell.pIdx].id] || 'var(--glow-ctdna)' }}>{l.label}:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{l.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
