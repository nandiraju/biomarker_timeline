import React, { useState, useEffect } from 'react';
import { patients } from './data/patients';
import ControlCenter from './components/ControlCenter';
import SkeuoCard from './components/SkeuoCard';
import SingleBiomarkerTrend from './components/SingleBiomarkerTrend';
import MultiBiomarkerTrend from './components/MultiBiomarkerTrend';
import TreatmentTimeline from './components/TreatmentTimeline';
import BiomarkerHeatmap from './components/BiomarkerHeatmap';
import ResponseSpiderPlot from './components/ResponseSpiderPlot';
import MutationEvolutionPlot from './components/MutationEvolutionPlot';
import HeatmapChart from './components/HeatmapChart';
import Gauge from './components/Gauge';
import brandLogo from './assets/brand_logo.png';
import { Activity, ShieldAlert, TrendingDown, Thermometer, Sparkles, BarChart2, Grid3X3, Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

export default function App() {
  const [activePatientId, setActivePatientId] = useState('pat-001');
  const [activeTimepoint, setActiveTimepoint] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTelemetryMaximized, setIsTelemetryMaximized] = useState(false);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maximizedGaugeSize = Math.max(120, Math.min(220, Math.floor((windowHeight - 180) / 1.6)));
  const currentGaugeSize = isTelemetryMaximized ? maximizedGaugeSize : 155;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveTimepoint((prev) => (prev + 1) % 6);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const [cardIds, setCardIds] = useState(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']);
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [dragOverCardId, setDragOverCardId] = useState(null);

  const handleDragStart = (e, id) => {
    if (e.target.closest('.skeuo-inset-screen') || e.target.closest('.card-num-btn')) {
      e.preventDefault();
      return;
    }
    setDraggedCardId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, id) => {
    e.preventDefault();
    if (draggedCardId && draggedCardId !== id) {
      setDragOverCardId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverCardId(null);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setDragOverCardId(null);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    setDragOverCardId(null);
    if (!draggedCardId || draggedCardId === targetId) return;

    const sourceIndex = cardIds.indexOf(draggedCardId);
    const targetIndex = cardIds.indexOf(targetId);

    const newCardIds = [...cardIds];
    newCardIds.splice(sourceIndex, 1);
    newCardIds.splice(targetIndex, 0, draggedCardId);

    setCardIds(newCardIds);
    setDraggedCardId(null);
  };

  const formatDateTime = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const isAll = activePatientId === 'all';
  // Primary patient for panels that don't support multi-mode
  const currentPatient = isAll
    ? patients[0]
    : (patients.find(p => p.id === activePatientId) || patients[0]);
  // Multi-patient array for panels that do
  const activePatients = isAll ? patients : [currentPatient];

  // Telemetry Calculations for Gauges
  const getRoundedMax = (val) => {
    if (val <= 0) return 100;
    const order = Math.pow(10, Math.floor(Math.log10(val)));
    const rounded = Math.ceil(val / order) * order;
    return rounded;
  };

  const avgCtDNA = patients.reduce((acc, p) => acc + p.ctDNA[activeTimepoint], 0) / patients.length;
  const avgCEA = patients.reduce((acc, p) => acc + p.snapshots.CEA[activeTimepoint], 0) / patients.length;
  const avgTumor = patients.reduce((acc, p) => acc + p.snapshots.tumorSize[activeTimepoint], 0) / patients.length;
  const avgMarker = patients.reduce((acc, p) => acc + p.heatmap[2].values[activeTimepoint], 0) / patients.length;
  const avgPdl1 = patients.reduce((acc, p) => acc + p.heatmap[5].values[activeTimepoint], 0) / patients.length;

  const cohortMaxCtDNA = Math.max(...patients.flatMap(p => p.ctDNA));
  const cohortMaxCEA = Math.max(...patients.flatMap(p => p.snapshots.CEA));
  const cohortMaxTumor = Math.max(...patients.flatMap(p => p.snapshots.tumorSize));
  const cohortMaxMarker = Math.max(...patients.flatMap(p => p.heatmap[2].values));

  const telemetry = isAll ? {
    name: 'Cohort Average',
    ctDNA: avgCtDNA,
    ctDNAMax: cohortMaxCtDNA,
    cea: avgCEA,
    ceaMax: cohortMaxCEA,
    tumor: avgTumor,
    tumorMax: cohortMaxTumor,
    marker: avgMarker,
    markerMax: cohortMaxMarker,
    markerName: 'CA-19/CA-125',
    pdl1: avgPdl1,
    pdl1Max: 100,
    labelSuffix: 'Cohort Avg'
  } : {
    name: currentPatient.name,
    ctDNA: currentPatient.ctDNA[activeTimepoint],
    ctDNAMax: Math.max(...currentPatient.ctDNA),
    cea: currentPatient.snapshots.CEA[activeTimepoint],
    ceaMax: Math.max(...currentPatient.snapshots.CEA),
    tumor: currentPatient.snapshots.tumorSize[activeTimepoint],
    tumorMax: Math.max(...currentPatient.snapshots.tumorSize),
    marker: currentPatient.heatmap[2].values[activeTimepoint],
    markerMax: Math.max(...currentPatient.heatmap[2].values),
    markerName: currentPatient.heatmap[2].name.split(' ')[0] + ' ' + (currentPatient.heatmap[2].name.split(' ')[1] || ''),
    pdl1: currentPatient.heatmap[5].values[activeTimepoint],
    pdl1Max: 100,
    labelSuffix: 'Current'
  };

  return (
    <div className="app-container">
      {/* Header Console */}
      <header className="dashboard-header skeuo-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeuo-screw screw-tl"></div>
        <div className="skeuo-screw screw-tr"></div>
        <div className="skeuo-screw screw-bl"></div>
        <div className="skeuo-screw screw-br"></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <img src={brandLogo} style={{ height: '42px', objectFit: 'contain' }} alt="OneCell Logo" />
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LONGITUDINAL BIOMARKER ANALYZER
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Oncology Molecular Intelligence &amp; Diagnostic Console v3.12
              {isAll && <span style={{ color: '#38bdf8', marginLeft: '0.75rem', textShadow: '0 0 6px rgba(56,189,248,0.6)' }}>● COMPARATIVE MODE ACTIVE</span>}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="digital-readout" style={{ fontSize: '0.8rem', color: '#f59e0b', textShadow: '0 0 4px rgba(245,158,11,0.6)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b', animation: 'pulse 1s infinite alternate' }} />
            {formatDateTime(currentTime)}
          </div>
        </div>
      </header>

      {/* Control Panel */}
      <ControlCenter
        patients={patients}
        activePatientId={activePatientId}
        setActivePatientId={setActivePatientId}
        setActiveTimepoint={setActiveTimepoint}
      />

      {/* Real-Time Telemetry Deck */}
      {isTelemetryMaximized && (
        <div 
          className="maximized-backdrop" 
          onClick={() => setIsTelemetryMaximized(false)} 
        />
      )}
      <section className={`skeuo-panel telemetry-deck ${isTelemetryMaximized ? 'maximized' : ''}`} style={{ marginBottom: isTelemetryMaximized ? '0' : '1.5rem' }}>
        <div className="skeuo-screw screw-tl"></div>
        <div className="skeuo-screw screw-tr"></div>
        <div className="skeuo-screw screw-bl"></div>
        <div className="skeuo-screw screw-br"></div>
        
        <div className="card-header-container" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title-group">
            <button 
              type="button"
              className="card-num-btn"
              onClick={() => setIsTelemetryMaximized(!isTelemetryMaximized)}
              title={isTelemetryMaximized ? "Exit Fullscreen" : "Maximize to Fullscreen"}
              style={{
                background: '#10151c',
                color: isTelemetryMaximized ? '#ef4444' : '#38bdf8',
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
              {isTelemetryMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
            <h2 className="card-title" style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}>REAL-TIME MOLECULAR TELEMETRY DECK</h2>
          </div>
          <div className="digital-readout" style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
            PROFILE: {telemetry.name.toUpperCase()} | TIMEPOINT: T{activeTimepoint}
          </div>
        </div>
        
        <div className="telemetry-gauges-container">
          <Gauge
            value={telemetry.ctDNA}
            min={0}
            max={getRoundedMax(telemetry.ctDNAMax)}
            color="blue"
            label={`${telemetry.labelSuffix} ctDNA`}
            unit="copies/mL"
            size={currentGaugeSize}
            dangerZone={telemetry.ctDNAMax * 0.8}
          />
          <Gauge
            value={telemetry.cea}
            min={0}
            max={getRoundedMax(telemetry.ceaMax)}
            color="green"
            label={`${telemetry.labelSuffix} CEA`}
            unit="ng/mL"
            size={currentGaugeSize}
            dangerZone={5}
          />
          <Gauge
            value={telemetry.marker}
            min={0}
            max={getRoundedMax(telemetry.markerMax)}
            color="yellow"
            label={`${telemetry.labelSuffix} ${telemetry.markerName}`}
            unit="U/mL"
            size={currentGaugeSize}
            dangerZone={37}
          />
          <Gauge
            value={telemetry.tumor}
            min={0}
            max={getRoundedMax(telemetry.tumorMax)}
            color="orange"
            label={`${telemetry.labelSuffix} Tumor Size`}
            unit="cm"
            size={currentGaugeSize}
            dangerZone={5}
          />
          <Gauge
            value={telemetry.pdl1}
            min={0}
            max={100}
            color="red"
            label={`${telemetry.labelSuffix} PD-L1`}
            unit="%"
            size={currentGaugeSize}
            dangerZone={0}
          />
        </div>
      </section>

      {/* Draggable & Repositionable Grid of Cards */}
      <main className="dashboard-grid">
        {(() => {
          const cardsData = {
            p1: {
              title: isAll ? 'ctDNA Trend — All Patients' : 'Single Biomarker Trend',
              icon: Activity,
              iconColor: 'var(--glow-ctdna)',
              desc: isAll
                ? 'ctDNA levels overlaid across all three patients to compare treatment response trajectories.'
                : 'ctDNA levels decrease after treatment and begin to rise slightly at the latest follow-up.',
              className: '',
              component: (
                <SingleBiomarkerTrend
                  patient={currentPatient}
                  patients={activePatients}
                  activeTimepoint={activeTimepoint}
                  setActiveTimepoint={setActiveTimepoint}
                />
              )
            },
            p2: {
              title: 'Multi-Biomarker Trend',
              icon: BarChart2,
              iconColor: 'var(--glow-cea)',
              desc: 'Biomarkers show different response patterns over the course of treatment.',
              className: '',
              component: (
                <MultiBiomarkerTrend
                  patient={currentPatient}
                  activeTimepoint={activeTimepoint}
                  setActiveTimepoint={setActiveTimepoint}
                />
              )
            },
            p3: {
              title: 'Treatment Timeline',
              icon: Sparkles,
              iconColor: 'var(--glow-tumor)',
              desc: isAll
                ? `Showing journey for ${currentPatient.name}. Select an individual patient for their timeline.`
                : 'Clinical events aligned with longitudinal biomarker measurements across the care continuum.',
              className: '',
              component: (
                <TreatmentTimeline
                  patient={currentPatient}
                  activeTimepoint={activeTimepoint}
                  setActiveTimepoint={setActiveTimepoint}
                />
              )
            },
            p4: {
              title: 'Biomarker Heatmap Table',
              icon: Thermometer,
              iconColor: 'var(--glow-mutation)',
              desc: 'Heatmap table shows relative intensity of multiple biomarkers over time (row-wise).',
              className: '',
              component: (
                <BiomarkerHeatmap
                  patient={currentPatient}
                  activeTimepoint={activeTimepoint}
                  setActiveTimepoint={setActiveTimepoint}
                />
              )
            },
            p5: {
              title: isAll ? 'Tumor Burden — All Patients' : 'Response / Spider Plot',
              icon: TrendingDown,
              iconColor: 'var(--glow-ctdna)',
              desc: isAll
                ? 'Comparative tumor burden change across all three patients against clinical response thresholds.'
                : 'Percentage change in tumor burden shows deep response followed by early progression.',
              className: '',
              component: (
                <ResponseSpiderPlot
                  patient={currentPatient}
                  patients={activePatients}
                  activeTimepoint={activeTimepoint}
                  setActiveTimepoint={setActiveTimepoint}
                />
              )
            },
            p6: {
              title: 'Mutation Evolution Plot',
              icon: ShieldAlert,
              iconColor: 'var(--glow-mutation)',
              desc: isAll
                ? `Mutation clonal fractions for ${currentPatient.name}. Select an individual patient for theirs.`
                : 'Clonal evolution of key mutations over time shows emergence and clearance of subclones.',
              className: '',
              component: (
                <MutationEvolutionPlot
                  patient={currentPatient}
                  activeTimepoint={activeTimepoint}
                  setActiveTimepoint={setActiveTimepoint}
                />
              )
            },
            p7: {
              title: isAll ? 'Multi-Patient Biomarker Heatmap — Comparative View' : `Biomarker Intensity Heatmap — ${currentPatient.name}`,
              icon: Grid3X3,
              iconColor: '#a78bfa',
              desc: isAll
                ? 'Side-by-side biomarker intensity comparison across all three patients at each timepoint. Columns highlighted by the active timepoint scrubber.'
                : 'Continuous color-scale heatmap showing relative biomarker intensities across all timepoints. Blue = cleared/low, red = high/active.',
              className: 'heatmap-full',
              component: (
                <HeatmapChart
                  patient={currentPatient}
                  patients={activePatients}
                  activeTimepoint={activeTimepoint}
                  setActiveTimepoint={setActiveTimepoint}
                />
              )
            }
          };

          return cardIds.map((id) => {
            const card = cardsData[id];
            if (!card) return null;
            const isDragging = draggedCardId === id;
            const isDragOver = dragOverCardId === id;

            return (
              <div
                key={id}
                draggable
                onDragStart={(e) => handleDragStart(e, id)}
                onDragOver={(e) => handleDragOver(e)}
                onDragEnter={(e) => handleDragEnter(e, id)}
                onDragLeave={() => handleDragLeave()}
                onDragEnd={() => handleDragEnd()}
                onDrop={(e) => handleDrop(e, id)}
                className={`card-drag-container ${card.className} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
              >
                <SkeuoCard
                  title={card.title}
                  icon={card.icon}
                  iconColor={card.iconColor}
                  desc={card.desc}
                  className={card.className}
                >
                  {card.component}
                </SkeuoCard>
              </div>
            );
          });
        })()}
      </main>

      {/* Floating Timepoint Scrubber */}
      <div className="floating-scrubber skeuo-panel">
        <div className="skeuo-screw screw-tl"></div>
        <div className="skeuo-screw screw-tr"></div>
        <div className="skeuo-screw screw-bl"></div>
        <div className="skeuo-screw screw-br"></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="card-num" style={{ width: '18px', height: '18px', fontSize: '0.65rem' }}>P</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Timeline Scrubber
              </span>
            </div>
            <div className="digital-readout" style={{ fontSize: '0.8rem', color: '#10b981', textShadow: '0 0 4px rgba(16, 185, 129, 0.6)' }}>
              T{activeTimepoint} / T5
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Track and Slider Input */}
            <div className="skeuo-slider-container">
              <div className="skeuo-slider-track">
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={activeTimepoint}
                  onChange={(e) => setActiveTimepoint(parseInt(e.target.value))}
                  className="skeuo-slider-input"
                />
              </div>
            </div>
          </div>

          {/* Quick selectors or indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 14px' }}>
            {['T0', 'T1', 'T2', 'T3', 'T4', 'T5'].map((tp, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTimepoint(idx)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: activeTimepoint === idx ? '#38bdf8' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: activeTimepoint === idx ? 'bold' : 'normal',
                  cursor: 'pointer',
                  textShadow: activeTimepoint === idx ? '0 0 5px rgba(56, 189, 248, 0.8)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {tp}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
