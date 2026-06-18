import React from 'react';
import { User, Users, Activity } from 'lucide-react';

const PATIENT_COLORS = {
  'pat-001': '#38bdf8',
  'pat-002': '#10b981',
  'pat-003': '#ef4444',
};

export default function ControlCenter({
  patients,
  activePatientId,
  setActivePatientId,
  setActiveTimepoint
}) {
  const isAll = activePatientId === 'all';
  const currentPatient = isAll ? null : (patients.find(p => p.id === activePatientId) || patients[0]);

  const getStatusLEDClass = (patient) => {
    if (!patient) return 'led-ctdna active';
    if (patient.status.includes('Progression') || patient.status.includes('Progressive')) return 'led-danger active';
    if (patient.status.includes('Complete')) return 'led-safe active';
    return 'led-mutation active';
  };

  // Shared timepoint labels (same for all patients)
  const timepointKeys = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5'];

  return (
    <div className="skeuo-panel" style={{ width: '100%', marginBottom: '1rem' }}>
      <div className="skeuo-screw screw-tl"></div>
      <div className="skeuo-screw screw-tr"></div>
      <div className="skeuo-screw screw-bl"></div>
      <div className="skeuo-screw screw-br"></div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'stretch' }}>

        {/* Patient Selection Deck */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="card-num">#</span>
            <h2 className="card-title" style={{ fontSize: '1.15rem' }}>Patient Control Console</h2>
          </div>

          <div className="skeuo-inset" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Select Active Profile
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {/* ALL PATIENTS toggle */}
              <button
                className={`skeuo-btn ${isAll ? 'active' : ''}`}
                onClick={() => { setActivePatientId('all'); setActiveTimepoint(0); }}
                style={{
                  flex: '0 0 auto',
                  fontSize: '0.85rem',
                  background: isAll
                    ? 'linear-gradient(to bottom, #0e2a3a 0%, #081520 100%)'
                    : undefined,
                  borderColor: isAll ? '#38bdf8' : undefined,
                  color: isAll ? '#38bdf8' : undefined,
                  boxShadow: isAll
                    ? 'inset 0 2px 4px rgba(0,0,0,0.7), 0 0 6px rgba(56,189,248,0.25)'
                    : undefined,
                }}
              >
                <Users size={14} />
                All Patients
              </button>

              {/* Individual patient buttons */}
              {patients.map(p => {
                const col = PATIENT_COLORS[p.id];
                const isActive = activePatientId === p.id;
                return (
                  <button
                    key={p.id}
                    className={`skeuo-btn ${isActive ? 'active' : ''}`}
                    onClick={() => { setActivePatientId(p.id); setActiveTimepoint(0); }}
                    style={{
                      flex: '1 1 auto',
                      fontSize: '0.85rem',
                      borderColor: isActive ? col : undefined,
                      color: isActive ? col : undefined,
                      background: isActive
                        ? `linear-gradient(to bottom, #111820 0%, #0b1219 100%)`
                        : undefined,
                      boxShadow: isActive
                        ? `inset 0 2px 4px rgba(0,0,0,0.7), 0 0 6px ${col}44`
                        : undefined,
                    }}
                  >
                    {/* Colored dot indicating patient color */}
                    <span style={{
                      display: 'inline-block',
                      width: '8px', height: '8px',
                      borderRadius: '50%',
                      backgroundColor: col,
                      boxShadow: isActive ? `0 0 6px ${col}` : 'none',
                      flexShrink: 0,
                    }} />
                    {p.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Patient Details Monitor */}
        <div style={{ flex: '2 2 450px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeuo-inset-screen" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0.8rem' }}>

            {isAll ? (
              /* All-patients comparison view */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a222d', paddingBottom: '0.4rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', textShadow: '0 0 8px rgba(56,189,248,0.4)' }}>
                    Comparative Analysis — All Patients
                  </span>
                  <span className="digital-readout" style={{ fontSize: '0.65rem', color: '#38bdf8' }}>N=3</span>
                </div>
                {patients.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.3rem 0', borderBottom: '1px solid #111822' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: PATIENT_COLORS[p.id], boxShadow: `0 0 6px ${PATIENT_COLORS[p.id]}`, marginTop: '0.3rem', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{p.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginLeft: '0.4rem' }}>Age {p.age}</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.diagnosis}</div>
                    </div>
                    <span className={`led-indicator ${getStatusLEDClass(p)}`} style={{ marginTop: '0.3rem', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            ) : (
              /* Single-patient view */
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1a222d', paddingBottom: '0.4rem', marginBottom: '0.4rem' }}>
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{currentPatient.name}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.75rem' }}>Age: {currentPatient.age}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`led-indicator ${getStatusLEDClass(currentPatient)}`}></span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                      {currentPatient.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Diagnosis:</strong> {currentPatient.diagnosis}
                  <p style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentPatient.bio}</p>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
