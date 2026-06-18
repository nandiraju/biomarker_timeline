# Longitudinal Biomarker Analyzer

The Longitudinal Biomarker Analyzer is an interactive oncology diagnostics console designed to visualize longitudinal patient biomarker trends, tumor response, and clonal mutation evolution. It supports both single-patient tracking and cohort-wide comparative analysis.

---

## How to Use the Application

### 1. Patient Selection
Use the Patient Control Console at the top of the screen to switch between patient profiles:
- Select individual patient profiles (Liam Carter, Chloe Zhao, or Marcus Vance) to view detailed single-patient telemetry and mutation tracking.
- Select "All Patients" to activate Comparative Mode, which overlays trajectories and calculates cohort averages.

### 2. Timeline Scrubber
Locate the Timeline Scrubber console in the bottom-right corner:
- Drag the range slider to step through the chronological timepoints (T0 to T5).
- Click on the quick-select labels (T0, T1, etc.) to jump directly to a specific timepoint.
- As you scrub, the molecular telemetry gauges, active grid highlights, and charts will update dynamically in real time.

### 3. Reordering Dashboard Cards
Customize the layout order of the dashboard by dragging and dropping:
- Click and hold the header of any card to drag it.
- Hover over another card slot and release to swap the cards.
- Dragging is disabled inside the interactive charts and action buttons to prevent accidental moves.

### 4. Fullscreen Maximizer
To inspect a chart or dataset in detail:
- Click the circular maximize button in the top-left of any card.
- The card will zoom into a fullscreen view with a darkened backdrop.
- Telemetry gauges scale dynamically in fullscreen mode to fit the height of the viewport.
- Click the button again (now showing a minimize icon) or click the dark backdrop to return to the grid layout.

---

## UI Components and Cards

### Molecular Telemetry Deck
Located below the patient selector, this panel displays five mechanical-style dial gauges representing molecular measurements at the active timepoint:
- **ctDNA** (copies/mL): Tracks circulating tumor DNA, indicating residual disease or molecular progression.
- **CEA** (ng/mL): Tracks Carcinoembryonic Antigen, a standard colorectal cancer marker.
- **Tumor Marker** (U/mL): Tracks patient-specific markers (CA 19-9 or CA 125) depending on the active profile.
- **Tumor Size** (cm): Tracks physical tumor burden from imaging.
- **PD-L1** (%): Tracks immunotherapy target expression levels.

When in comparative mode, the gauges automatically calculate and display the cohort average for all patients.

### Single Biomarker Trend
Displays a longitudinal line chart of ctDNA levels. In comparative mode, it overlays the curves of all three patients for direct response comparison. Hovering over data points displays precise value tooltips.

### Multi-Biomarker Trend
Normalizes and overlays multiple clinical metrics (ctDNA, CEA, and Tumor Size) on a single chart to correlate molecular changes with physical tumor response.

### Treatment Timeline
A step-by-step history showing clinical events (e.g., diagnosis, surgery, and chemotherapy cycles) aligned with the active timeline scrubber.

### Biomarker Heatmap Table
Tabulates exact biomarker measurements at each timepoint in a table grid. Row cells are shaded based on values, and the active column matches the timeline scrubber position.

### Response / Spider Plot
Calculates and plots the percentage change in physical tumor size relative to the baseline (T0) measurement. Horizontal reference lines indicate standard response thresholds (e.g., progression, stable disease, partial response).

### Mutation Evolution Plot
Visualizes the clonal fraction of key driver mutations (EGFR, KRAS, TP53, PIK3CA) over time to monitor subclone clearance, persistence, or the emergence of resistant clones.

### Biomarker Intensity Heatmap
A continuous color-scale heatmap chart at the bottom of the dashboard. It maps low intensity (cleared markers) to blue and high intensity (active disease) to red, highlighting overall disease clearance or progression.

---

## Local Development and Build

### Install Dependencies
To install the required project packages, run:
```bash
npm install
```

### Start Development Server
To launch the hot-reloading local development server:
```bash
npm run dev
```

### Build for Production
To compile and bundle the application into the `dist/` directory for hosting:
```bash
npm run build
```
