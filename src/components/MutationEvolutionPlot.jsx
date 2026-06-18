import React, { useState } from 'react';

export default function MutationEvolutionPlot({ patient, activeTimepoint, setActiveTimepoint }) {
  const [hoverNode, setHoverNode] = useState(null); // { rowIdx, colIdx }
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, val: "", name: "" });

  const mutations = patient.mutations;
  const timepoints = patient.timepoints;

  // Chart dimensions
  const width = 300;
  const height = 150;
  const paddingLeft = 65; // Extra room for mutation labels
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index) => {
    return paddingLeft + (index / (timepoints.length - 1)) * chartWidth;
  };

  const getRowY = (index) => {
    return paddingTop + (index / (mutations.length - 1)) * chartHeight;
  };

  // Color assignments for mutations
  const mutationColors = [
    "#38bdf8", // Neon Blue (EGFR / KRAS)
    "#fb923c", // Orange (KRAS / NRAS)
    "#10b981", // Emerald (TP53)
    "#c084fc"  // Purple (PIK3CA)
  ];

  const handleMouseMove = (e, rowIdx, colIdx, val, name, status) => {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltipPos({
      x,
      y: y - 55,
      val: status === "ND" ? "Not Detected (ND)" : `Detected (${val}% Clonal Fraction)`,
      name
    });
    setHoverNode({ rowIdx, colIdx });
  };

  return (
    <div style={{ position: 'relative' }}>
      
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="interactive-svg"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        {/* Background vertical timepoint lines */}
        {timepoints.map((tp, idx) => {
          const x = getX(idx);
          const isSelected = activeTimepoint === idx;
          return (
            <g key={idx}>
              <line
                x1={x}
                y1={paddingTop - 5}
                x2={x}
                y2={paddingTop + chartHeight + 5}
                stroke={isSelected ? "rgba(56, 189, 248, 0.2)" : "#161b22"}
                strokeWidth={isSelected ? 1.5 : 1}
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

        {/* Mutation Rows */}
        {mutations.map((mut, rowIdx) => {
          const y = getRowY(rowIdx);
          const color = mutationColors[rowIdx % mutationColors.length];
          return (
            <g key={rowIdx}>
              {/* Row Label */}
              <text
                x={paddingLeft - 8}
                y={y + 3}
                fill="var(--text-primary)"
                fontSize="7"
                fontWeight="700"
                textAnchor="end"
              >
                {mut.name.split(' ')[0]}
              </text>
              
              <text
                x={paddingLeft - 8}
                y={y + 9}
                fill="var(--text-muted)"
                fontSize="5.5"
                textAnchor="end"
              >
                {mut.name.split(' ')[1] || ""}
              </text>

              {/* Row connector line */}
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#1f2937"
                strokeWidth="1.5"
              />

              {/* Mutation Bubbles */}
              {mut.values.map((val, colIdx) => {
                const x = getX(colIdx);
                const isND = mut.status[colIdx] === "ND" || val === 0;
                const isSelectedCol = activeTimepoint === colIdx;
                const isHovered = hoverNode && hoverNode.rowIdx === rowIdx && hoverNode.colIdx === colIdx;
                
                // Bubble size logic based on clonal fraction value
                const baseRadius = isND ? 4 : 4 + (val / 100) * 8;
                const radius = isHovered ? baseRadius + 1.5 : isSelectedCol ? baseRadius + 1 : baseRadius;

                return (
                  <g key={colIdx} style={{ cursor: 'pointer' }} onClick={() => setActiveTimepoint(colIdx)}>
                    {isND ? (
                      /* Dotted Circle for Not Detected */
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill="#0c0f13"
                        stroke="#475569"
                        strokeWidth="1.2"
                        strokeDasharray="2,2"
                        onMouseEnter={(e) => handleMouseMove(e, rowIdx, colIdx, val, mut.name, "ND")}
                        onMouseMove={(e) => handleMouseMove(e, rowIdx, colIdx, val, mut.name, "ND")}
                        onMouseLeave={() => setHoverNode(null)}
                      />
                    ) : (
                      /* Solid Bubble for Detected */
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill={color}
                        fillOpacity={isHovered ? 0.95 : 0.8}
                        stroke={isHovered || isSelectedCol ? "#ffffff" : color}
                        strokeWidth={isHovered || isSelectedCol ? 1.8 : 0}
                        style={{
                          filter: `drop-shadow(0 0 ${isHovered ? 5 : 3}px ${color})`,
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => handleMouseMove(e, rowIdx, colIdx, val, mut.name, "Detected")}
                        onMouseMove={(e) => handleMouseMove(e, rowIdx, colIdx, val, mut.name, "Detected")}
                        onMouseLeave={() => setHoverNode(null)}
                      />
                    )}

                    {/* Small percentage labels on/above the bubbles */}
                    {!isND && val > 0 && radius > 5 && (
                      <text
                        x={x}
                        y={y + 2}
                        fill="#000000"
                        fontSize="6"
                        fontWeight="900"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {val}
                      </text>
                    )}
                    {isND && (
                      <text
                        x={x}
                        y={y + 1.5}
                        fill="#475569"
                        fontSize="5"
                        fontWeight="normal"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        ND
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Evolution Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem', 
        fontSize: '0.62rem', 
        color: 'var(--text-muted)',
        fontWeight: 600,
        marginTop: '0.2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8', boxShadow: '0 0 3px #38bdf8' }} />
          Detected Clones
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', border: '1px solid #475569', backgroundColor: '#0c0f13', borderStyle: 'dashed' }} />
          Not Detected (ND)
        </div>
      </div>

      {/* Tooltip Overlay */}
      {hoverNode !== null && (
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
          <div className="chart-tooltip-title">{tooltipPos.name}</div>
          <div className="chart-tooltip-item">
            <span style={{ color: 'var(--glow-mutation)' }}>Status:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{tooltipPos.val}</span>
          </div>
        </div>
      )}
    </div>
  );
}
