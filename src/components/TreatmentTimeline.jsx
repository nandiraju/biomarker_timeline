import React from 'react';
import { FileText, Scissors, Droplet, Shield, User, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function TreatmentTimeline({ patient, activeTimepoint, setActiveTimepoint }) {
  
  // Icon mapper helper
  const getIcon = (iconName, color) => {
    const props = { size: 16, style: { color, filter: `drop-shadow(0 0 2px ${color})` } };
    switch (iconName) {
      case 'file-text': return <FileText {...props} />;
      case 'scissors': return <Scissors {...props} />;
      case 'droplet': return <Droplet {...props} />;
      case 'shield': return <Shield {...props} />;
      case 'user': return <User {...props} />;
      case 'alert-triangle': return <AlertTriangle {...props} />;
      case 'check-circle': return <CheckCircle {...props} />;
      case 'x-circle': return <XCircle {...props} />;
      default: return <Activity {...props} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      
      {/* Patient Journey Flowchart */}
      <div style={{ position: 'relative', padding: '0.25rem 0' }}>
        
        {/* Connection line behind the nodes */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '12px',
          right: '12px',
          height: '2px',
          background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 30%, #f59e0b 60%, #8b5cf6 80%, #ef4444 100%)',
          opacity: 0.3,
          zIndex: 1
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2, position: 'relative' }}>
          {patient.journey.map((step, idx) => {
            const isActive = activeTimepoint === idx;
            return (
              <div 
                key={idx} 
                onClick={() => setActiveTimepoint(idx)}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  flex: '1',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#090c0f',
                  border: isActive ? `2px solid ${step.color}` : '1.5px solid #283342',
                  boxShadow: isActive ? `0 0 8px ${step.color}` : 'inset 0 1px 3px rgba(0,0,0,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  transform: isActive ? 'scale(1.15)' : 'none'
                }}>
                  {getIcon(step.icon, step.color)}
                </div>

                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 700, 
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  marginTop: '0.3rem',
                  transition: 'color 0.2s ease'
                }}>
                  T{idx}
                </span>

                <span style={{ 
                  fontSize: '0.62rem', 
                  color: isActive ? 'var(--text-secondary)' : 'rgba(255,255,255,0.25)',
                  fontWeight: isActive ? 600 : 400,
                  maxWidth: '55px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '0.1rem',
                  display: 'none' // Hidden by default unless responsive CSS triggers
                }} className="journey-step-title">
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Step Detail Indicator */}
        <div style={{ 
          marginTop: '0.6rem', 
          background: '#080b0f', 
          borderRadius: '6px', 
          padding: '0.4rem 0.6rem', 
          borderLeft: `3px solid ${patient.journey[activeTimepoint].color}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Timepoint T{activeTimepoint}: {patient.journey[activeTimepoint].title}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              {patient.journey[activeTimepoint].desc}
            </div>
          </div>
          <span className="digital-readout" style={{ fontSize: '0.65rem', color: patient.journey[activeTimepoint].color, textShadow: `0 0 4px ${patient.journey[activeTimepoint].color}` }}>
            ACTIVE
          </span>
        </div>

      </div>

      {/* Snapshots Table */}
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
          Biomarker Snapshots
        </div>
        <div className="skeuo-table-wrapper" style={{ border: '1px solid #1a222d', borderRadius: '6px', overflow: 'hidden' }}>
          <table className="skeuo-table">
            <thead>
              <tr>
                <th>Biomarker</th>
                {patient.timepoints.map((tp, idx) => (
                  <th 
                    key={idx} 
                    style={{ 
                      textAlign: 'center',
                      backgroundColor: activeTimepoint === idx ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                      color: activeTimepoint === idx ? '#38bdf8' : 'var(--text-secondary)',
                      textShadow: activeTimepoint === idx ? '0 0 4px rgba(56, 189, 248, 0.4)' : 'none'
                    }}
                  >
                    T{idx}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>ctDNA <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400 }}>(copies/mL)</span></td>
                {patient.snapshots.ctDNA.map((val, idx) => (
                  <td 
                    key={idx} 
                    style={{ 
                      textAlign: 'center',
                      backgroundColor: activeTimepoint === idx ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
                      fontWeight: activeTimepoint === idx ? 700 : 400,
                      color: val === 0 ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}
                  >
                    {val === 0 ? "ND" : val.toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>CEA <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400 }}>(ng/mL)</span></td>
                {patient.snapshots.CEA.map((val, idx) => (
                  <td 
                    key={idx} 
                    style={{ 
                      textAlign: 'center',
                      backgroundColor: activeTimepoint === idx ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
                      fontWeight: activeTimepoint === idx ? 700 : 400
                    }}
                  >
                    {val.toFixed(1)}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Tumor Size <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400 }}>(cm)</span></td>
                {patient.snapshots.tumorSize.map((val, idx) => (
                  <td 
                    key={idx} 
                    style={{ 
                      textAlign: 'center',
                      backgroundColor: activeTimepoint === idx ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
                      fontWeight: activeTimepoint === idx ? 700 : 400,
                      color: val === 0 ? 'var(--glow-cea)' : 'var(--text-primary)'
                    }}
                  >
                    {val === 0 ? "0.0" : val.toFixed(1)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
