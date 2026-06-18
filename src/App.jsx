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
import { Activity, ShieldAlert, TrendingDown, Thermometer, Sparkles, BarChart2, Grid3X3 } from 'lucide-react';

export default function App() {
  const [activePatientId, setActivePatientId] = useState('pat-001');
  const [activeTimepoint, setActiveTimepoint] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
        activeTimepoint={activeTimepoint}
        setActiveTimepoint={setActiveTimepoint}
      />

      {/* Real-Time Telemetry Deck */}
      <section className="skeuo-panel telemetry-deck" style={{ width: '100%', marginBottom: '1.5rem' }}>
        <div className="skeuo-screw screw-tl"></div>
        <div className="skeuo-screw screw-tr"></div>
        <div className="skeuo-screw screw-bl"></div>
        <div className="skeuo-screw screw-br"></div>
        
        <div className="card-header-container" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title-group">
            <span className="card-num">T</span>
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
            size={155}
            dangerZone={telemetry.ctDNAMax * 0.8}
          />
          <Gauge
            value={telemetry.cea}
            min={0}
            max={getRoundedMax(telemetry.ceaMax)}
            color="green"
            label={`${telemetry.labelSuffix} CEA`}
            unit="ng/mL"
            size={155}
            dangerZone={5}
          />
          <Gauge
            value={telemetry.marker}
            min={0}
            max={getRoundedMax(telemetry.markerMax)}
            color="yellow"
            label={`${telemetry.labelSuffix} ${telemetry.markerName}`}
            unit="U/mL"
            size={155}
            dangerZone={37}
          />
          <Gauge
            value={telemetry.tumor}
            min={0}
            max={getRoundedMax(telemetry.tumorMax)}
            color="orange"
            label={`${telemetry.labelSuffix} Tumor Size`}
            unit="cm"
            size={155}
            dangerZone={5}
          />
          <Gauge
            value={telemetry.pdl1}
            min={0}
            max={100}
            color="red"
            label={`${telemetry.labelSuffix} PD-L1`}
            unit="%"
            size={155}
            dangerZone={0}
          />
        </div>
      </section>

      {/* 6-Panel Grid */}
      <main className="dashboard-grid">

        {/* Panel 1: ctDNA Single Biomarker — supports multi-patient overlay */}
        <SkeuoCard
          number="1"
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
          number="2"
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
          number="3"
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
          number="4"
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
          number="5"
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
          number="6"
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
        number="7"
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

    </div>
  );
}
