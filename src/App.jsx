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
      <section className={`skeuo-panel telemetry-deck ${isTelemetryMaximized ? 'maximized' : ''}`} style={{ width: '100%', marginBottom: '1.5rem' }}>
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
            size={isTelemetryMaximized ? 260 : 155}
            dangerZone={telemetry.ctDNAMax * 0.8}
          />
          <Gauge
            value={telemetry.cea}
            min={0}
            max={getRoundedMax(telemetry.ceaMax)}
            color="green"
            label={`${telemetry.labelSuffix} CEA`}
            unit="ng/mL"
            size={isTelemetryMaximized ? 260 : 155}
            dangerZone={5}
          />
          <Gauge
            value={telemetry.marker}
            min={0}
            max={getRoundedMax(telemetry.markerMax)}
            color="yellow"
            label={`${telemetry.labelSuffix} ${telemetry.markerName}`}
            unit="U/mL"
            size={isTelemetryMaximized ? 260 : 155}
            dangerZone={37}
          />
          <Gauge
            value={telemetry.tumor}
            min={0}
            max={getRoundedMax(telemetry.tumorMax)}
            color="orange"
            label={`${telemetry.labelSuffix} Tumor Size`}
            unit="cm"
            size={isTelemetryMaximized ? 260 : 155}
            dangerZone={5}
          />
          <Gauge
            value={telemetry.pdl1}
            min={0}
            max={100}
            color="red"
            label={`${telemetry.labelSuffix} PD-L1`}
            unit="%"
            size={isTelemetryMaximized ? 260 : 155}
            dangerZone={0}
          />
        </div>
      </section>

      {/* 6-Panel Grid */}
      <main className="dashboard-grid">

        {/* Panel 1: ctDNA Single Biomarker — supports multi-patient overlay */}
        <SkeuoCard
          title={isAll ? 'ctDNA Trend — All Patients' : 'Single Biomarker Trend'}
          icon={Activity}
          iconColor="var(--glow-ctdna)"
          desc={isAll
            ? 'ctDNA levels overlaid across all three patients to compare treatment response trajectories.'
            : 'ctDNA levels decrease after treatment and begin to rise slightly at the latest follow-up.'}
        >
          <SingleBiomarkerTrend
            patient={currentPatient}
            patients={activePatients}
            activeTimepoint={activeTimepoint}
            setActiveTimepoint={setActiveTimepoint}
          />
        </SkeuoCard>

        {/* Panel 2: Multi-Biomarker Trend — single patient only */}
        <SkeuoCard
          title="Multi-Biomarker Trend"
          icon={BarChart2}
          iconColor="var(--glow-cea)"
          desc="Biomarkers show different response patterns over the course of treatment."
        >
          <MultiBiomarkerTrend
            patient={currentPatient}
            activeTimepoint={activeTimepoint}
            setActiveTimepoint={setActiveTimepoint}
          />
        </SkeuoCard>

        {/* Panel 3: Treatment Timeline — single patient only */}
        <SkeuoCard
          title="Treatment Timeline"
          icon={Sparkles}
          iconColor="var(--glow-tumor)"
          desc={isAll
            ? `Showing journey for ${currentPatient.name}. Select an individual patient for their timeline.`
            : 'Clinical events aligned with longitudinal biomarker measurements across the care continuum.'}
        >
          <TreatmentTimeline
            patient={currentPatient}
            activeTimepoint={activeTimepoint}
            setActiveTimepoint={setActiveTimepoint}
          />
        </SkeuoCard>

        {/* Panel 4: Biomarker Heatmap Table — single patient only */}
        <SkeuoCard
          title="Biomarker Heatmap Table"
          icon={Thermometer}
          iconColor="var(--glow-mutation)"
          desc="Heatmap table shows relative intensity of multiple biomarkers over time (row-wise)."
        >
          <BiomarkerHeatmap
            patient={currentPatient}
            activeTimepoint={activeTimepoint}
            setActiveTimepoint={setActiveTimepoint}
          />
        </SkeuoCard>

        {/* Panel 5: Response Spider Plot — supports multi-patient overlay */}
        <SkeuoCard
          title={isAll ? 'Tumor Burden — All Patients' : 'Response / Spider Plot'}
          icon={TrendingDown}
          iconColor="var(--glow-ctdna)"
          desc={isAll
            ? 'Comparative tumor burden change across all three patients against clinical response thresholds.'
            : 'Percentage change in tumor burden shows deep response followed by early progression.'}
        >
          <ResponseSpiderPlot
            patient={currentPatient}
            patients={activePatients}
            activeTimepoint={activeTimepoint}
            setActiveTimepoint={setActiveTimepoint}
          />
        </SkeuoCard>

        {/* Panel 6: Mutation Evolution — single patient only */}
        <SkeuoCard
          title="Mutation Evolution Plot"
          icon={ShieldAlert}
          iconColor="var(--glow-mutation)"
          desc={isAll
            ? `Mutation clonal fractions for ${currentPatient.name}. Select an individual patient for theirs.`
            : 'Clonal evolution of key mutations over time shows emergence and clearance of subclones.'}
        >
          <MutationEvolutionPlot
            patient={currentPatient}
            activeTimepoint={activeTimepoint}
            setActiveTimepoint={setActiveTimepoint}
          />
        </SkeuoCard>

      </main>

      {/* Panel 7: Scientific Heatmap — full width, supports multi-patient */}
      <SkeuoCard
        title={isAll ? 'Multi-Patient Biomarker Heatmap — Comparative View' : `Biomarker Intensity Heatmap — ${currentPatient.name}`}
        icon={Grid3X3}
        iconColor="#a78bfa"
        desc={isAll
          ? 'Side-by-side biomarker intensity comparison across all three patients at each timepoint. Columns highlighted by the active timepoint scrubber.'
          : 'Continuous color-scale heatmap showing relative biomarker intensities across all timepoints. Blue = cleared/low, red = high/active.'}
        className="heatmap-full"
      >
        <HeatmapChart
          patient={currentPatient}
          patients={activePatients}
          activeTimepoint={activeTimepoint}
          setActiveTimepoint={setActiveTimepoint}
        />
      </SkeuoCard>

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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`skeuo-btn ${isPlaying ? 'active' : ''}`}
              style={{ padding: '0.4rem', flexShrink: 0, width: '32px', height: '32px', justifyContent: 'center' }}
              title={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play'}
            >
              {isPlaying ? <Pause size={14} style={{ color: '#ef4444' }} /> : <Play size={14} style={{ color: '#10b981' }} />}
            </button>

            {/* Previous Button */}
            <button
              onClick={() => setActiveTimepoint((prev) => Math.max(0, prev - 1))}
              className="skeuo-btn"
              disabled={activeTimepoint === 0}
              style={{ padding: '0.4rem', flexShrink: 0, width: '32px', height: '32px', justifyContent: 'center', opacity: activeTimepoint === 0 ? 0.5 : 1 }}
              title="Previous Timepoint"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Track and Slider Input */}
            <div className="skeuo-slider-container" style={{ flexGrow: 1 }}>
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

            {/* Next Button */}
            <button
              onClick={() => setActiveTimepoint((prev) => Math.min(5, prev + 1))}
              className="skeuo-btn"
              disabled={activeTimepoint === 5}
              style={{ padding: '0.4rem', flexShrink: 0, width: '32px', height: '32px', justifyContent: 'center', opacity: activeTimepoint === 5 ? 0.5 : 1 }}
              title="Next Timepoint"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Quick selectors or indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0.1rem' }}>
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
