export const patients = [
  {
    id: "pat-001",
    name: "Liam Carter",
    age: 58,
    diagnosis: "Stage IIIb Non-Small Cell Lung Cancer (NSCLC)",
    status: "Partial Response with Late Progression",
    bio: "Patient showed strong initial response to surgical resection and adjuvant chemotherapy. However, emerging resistance clones led to molecular recurrence at the 6-month follow-up.",
    timepoints: ["T0\nBaseline", "T1\nPost-Op", "T2\nPost-Chemo", "T3\nPost-Immuno", "T4\n3 Mo FU", "T5\n6 Mo FU"],
    timepointLabels: ["T0 (Baseline)", "T1 (2 Wks Post-Op)", "T2 (6 Wks Post-Chemo)", "T3 (5 Wks Post-Immuno)", "T4 (3 Mo Follow-up)", "T5 (6 Mo Follow-up)"],
    // Single Biomarker Trend (ctDNA)
    ctDNA: [3200, 1050, 210, 38, 22, 65], // copies/mL
    // Normalized to Baseline (%)
    normalizedData: {
      ctDNA: [100, 60, 25, 10, 5, 18],
      CEA: [100, 80, 60, 30, 35, 50],
      tumorSize: [100, 95, 88, 70, 65, 80]
    },
    // Raw Snapshots for the table
    snapshots: {
      ctDNA: [3200, 1050, 210, 38, 22, 65],
      CEA: [18.4, 12.6, 6.4, 4.1, 3.2, 4.3],
      tumorSize: [6.2, 5.8, 4.0, 2.8, 2.4, 3.1]
    },
    // Heatmap Biomarkers
    heatmap: [
      { name: "ctDNA (copies/mL)", values: [3200, 1050, 210, 38, 22, 65], relative: [1.0, 0.65, 0.35, 0.08, 0.05, 0.15] },
      { name: "CEA (ng/mL)", values: [18.4, 12.6, 6.4, 4.1, 3.2, 4.3], relative: [1.0, 0.72, 0.45, 0.25, 0.18, 0.28] },
      { name: "CA 19-9 (U/mL)", values: [860, 620, 320, 210, 180, 240], relative: [1.0, 0.75, 0.45, 0.28, 0.22, 0.32] },
      { name: "NSE (ng/mL)", values: [24.0, 18.5, 14.0, 10.2, 9.1, 11.3], relative: [1.0, 0.78, 0.52, 0.32, 0.25, 0.38] },
      { name: "LDH (U/L)", values: [320, 280, 210, 180, 160, 190], relative: [1.0, 0.82, 0.55, 0.42, 0.35, 0.48] },
      { name: "PD-L1 (%)", values: [15, 20, 30, 45, 50, 48], relative: [0.1, 0.2, 0.45, 0.85, 1.0, 0.95] }
    ],
    // Response / Spider Plot: % change in tumor burden (from 6.2cm baseline)
    tumorBurdenChange: [0, -10, -35, -60, -70, -35],
    // Mutation Evolution
    mutations: [
      { name: "EGFR L858R", values: [45, 30, 15, 0, 0, 0], status: ["Detected", "Detected", "Detected", "ND", "ND", "ND"] },
      { name: "KRAS G12D", values: [0, 10, 20, 35, 45, 50], status: ["ND", "Detected", "Detected", "Detected", "Detected", "Detected"] },
      { name: "TP53 R175H", values: [50, 55, 60, 55, 60, 65], status: ["Detected", "Detected", "Detected", "Detected", "Detected", "Detected"] },
      { name: "PIK3CA E545K", values: [0, 0, 10, 15, 20, 25], status: ["ND", "ND", "Detected", "Detected", "Detected", "Detected"] }
    ],
    // Treatment events mapping
    journey: [
      { title: "Diagnosis", desc: "Stage IIIb Lung Cancer", icon: "file-text", color: "#3b82f6" },
      { title: "Surgery", desc: "Lobectomy resection", icon: "scissors", color: "#10b981" },
      { title: "Chemotherapy", desc: "Cisplatin + Pemetrexed", icon: "droplet", color: "#f59e0b" },
      { title: "Immunotherapy", desc: "Pembrolizumab (Keytruda)", icon: "shield", color: "#8b5cf6" },
      { title: "Follow-up", desc: "Routine CT & Liquid Biopsy", icon: "user", color: "#ec4899" },
      { title: "Follow-up", desc: "Secondary lesions noted", icon: "alert-triangle", color: "#ef4444" }
    ]
  },
  {
    id: "pat-002",
    name: "Elena Rostova",
    age: 45,
    diagnosis: "Stage IIIc High-Grade Serous Ovarian Cancer",
    status: "Complete Clinical Response",
    bio: "Patient exhibited excellent response to primary debulking surgery followed by adjuvant paclitaxel/carboplatin and maintenance PARP inhibitors. ctDNA cleared completely post-chemo.",
    timepoints: ["T0\nBaseline", "T1\nPost-Op", "T2\nPost-Chemo", "T3\nMaintenance", "T4\n3 Mo FU", "T5\n6 Mo FU"],
    timepointLabels: ["T0 (Baseline)", "T1 (Surgery)", "T2 (Post-Chemo)", "T3 (6 Wks Maintenance)", "T4 (3 Mo Follow-up)", "T5 (6 Mo Follow-up)"],
    ctDNA: [1800, 420, 0, 0, 0, 0],
    normalizedData: {
      ctDNA: [100, 23, 0, 0, 0, 0],
      CEA: [100, 65, 12, 5, 5, 4],
      tumorSize: [100, 30, 5, 0, 0, 0]
    },
    snapshots: {
      ctDNA: [1800, 420, 0, 0, 0, 0],
      CEA: [12.2, 7.9, 1.4, 0.6, 0.5, 0.4],
      tumorSize: [7.8, 2.3, 0.4, 0.0, 0.0, 0.0]
    },
    heatmap: [
      { name: "ctDNA (copies/mL)", values: [1800, 420, 0, 0, 0, 0], relative: [1.0, 0.23, 0.0, 0.0, 0.0, 0.0] },
      { name: "CEA (ng/mL)", values: [12.2, 7.9, 1.4, 0.6, 0.5, 0.4], relative: [1.0, 0.65, 0.11, 0.05, 0.04, 0.03] },
      { name: "CA 125 (U/mL)", values: [450, 180, 28, 12, 10, 8], relative: [1.0, 0.4, 0.06, 0.02, 0.02, 0.01] },
      { name: "NSE (ng/mL)", values: [12.5, 10.2, 8.1, 7.8, 7.5, 7.4], relative: [1.0, 0.81, 0.64, 0.62, 0.6, 0.59] },
      { name: "LDH (U/L)", values: [280, 210, 160, 150, 145, 142], relative: [1.0, 0.75, 0.57, 0.53, 0.51, 0.5] },
      { name: "PD-L1 (%)", values: [65, 62, 58, 55, 55, 52], relative: [1.0, 0.95, 0.89, 0.84, 0.84, 0.8] }
    ],
    tumorBurdenChange: [0, -70, -95, -100, -100, -100],
    mutations: [
      { name: "TP53 Y220C", values: [65, 20, 0, 0, 0, 0], status: ["Detected", "Detected", "ND", "ND", "ND", "ND"] },
      { name: "BRCA1 c.191G>A", values: [42, 12, 0, 0, 0, 0], status: ["Detected", "Detected", "ND", "ND", "ND", "ND"] },
      { name: "EGFR WT", values: [0, 0, 0, 0, 0, 0], status: ["ND", "ND", "ND", "ND", "ND", "ND"] },
      { name: "KRAS WT", values: [0, 0, 0, 0, 0, 0], status: ["ND", "ND", "ND", "ND", "ND", "ND"] }
    ],
    journey: [
      { title: "Diagnosis", desc: "High-Grade Serous Ovarian", icon: "file-text", color: "#3b82f6" },
      { title: "Debulking Surgery", desc: "R0 optimal resection", icon: "scissors", color: "#10b981" },
      { title: "Chemotherapy", desc: "Paclitaxel + Carboplatin", icon: "droplet", color: "#f59e0b" },
      { title: "PARP Inhibitor", desc: "Olaparib maintenance", icon: "shield", color: "#8b5cf6" },
      { title: "Follow-up", desc: "Complete clinical response", icon: "user", color: "#10b981" },
      { title: "Follow-up", desc: "No evidence of disease", icon: "check-circle", color: "#10b981" }
    ]
  },
  {
    id: "pat-003",
    name: "Marcus Vance",
    age: 62,
    diagnosis: "Stage IV Metastatic Colorectal Cancer (mCRC)",
    status: "Primary Non-Responder / Progressive Disease",
    bio: "Patient showed immediate resistance to FOLFOX chemotherapy. Liquid biopsy reveals rapid expansion of KRAS and NRAS subclonal mutations driving aggressive metastatic tumor growth.",
    timepoints: ["T0\nBaseline", "T1\nCycle 1", "T2\nCycle 2", "T3\nCycle 4", "T4\nSalvage Tx", "T5\n6 Mo FU"],
    timepointLabels: ["T0 (Baseline)", "T1 (2 Wks Post-FOLFOX)", "T2 (6 Wks Post-FOLFOX)", "T3 (12 Wks Post-FOLFOX)", "T4 (16 Wks Salvage Therapy)", "T5 (6 Mo Follow-up)"],
    ctDNA: [4200, 4800, 6500, 8900, 11500, 15000],
    normalizedData: {
      ctDNA: [100, 114, 154, 211, 273, 357],
      CEA: [100, 110, 135, 170, 210, 280],
      tumorSize: [100, 105, 115, 130, 120, 145]
    },
    snapshots: {
      ctDNA: [4200, 4800, 6500, 8900, 11500, 15000],
      CEA: [45.2, 49.7, 61.0, 76.8, 94.9, 126.5],
      tumorSize: [8.5, 8.9, 9.8, 11.0, 10.2, 12.3]
    },
    heatmap: [
      { name: "ctDNA (copies/mL)", values: [4200, 4800, 6500, 8900, 11500, 15000], relative: [0.28, 0.32, 0.43, 0.59, 0.76, 1.0] },
      { name: "CEA (ng/mL)", values: [45.2, 49.7, 61.0, 76.8, 94.9, 126.5], relative: [0.35, 0.39, 0.48, 0.6, 0.75, 1.0] },
      { name: "CA 19-9 (U/mL)", values: [1200, 1420, 1850, 2400, 3100, 4500], relative: [0.26, 0.31, 0.41, 0.53, 0.68, 1.0] },
      { name: "NSE (ng/mL)", values: [18.2, 20.4, 25.1, 31.0, 36.2, 44.5], relative: [0.4, 0.45, 0.56, 0.69, 0.81, 1.0] },
      { name: "LDH (U/L)", values: [450, 490, 580, 690, 750, 920], relative: [0.48, 0.53, 0.63, 0.75, 0.81, 1.0] },
      { name: "PD-L1 (%)", values: [10, 10, 12, 15, 15, 18], relative: [0.55, 0.55, 0.66, 0.83, 0.83, 1.0] }
    ],
    tumorBurdenChange: [0, 5, 15, 30, 20, 45],
    mutations: [
      { name: "KRAS G12V", values: [35, 52, 68, 79, 82, 88], status: ["Detected", "Detected", "Detected", "Detected", "Detected", "Detected"] },
      { name: "NRAS Q61K", values: [0, 15, 32, 48, 55, 62], status: ["ND", "Detected", "Detected", "Detected", "Detected", "Detected"] },
      { name: "TP53 R273H", values: [60, 62, 70, 75, 78, 84], status: ["Detected", "Detected", "Detected", "Detected", "Detected", "Detected"] },
      { name: "PIK3CA H1047R", values: [0, 0, 15, 25, 38, 45], status: ["ND", "ND", "Detected", "Detected", "Detected", "Detected"] }
    ],
    journey: [
      { title: "Diagnosis", desc: "Stage IV Colorectal Adenocarcinoma", icon: "file-text", color: "#3b82f6" },
      { title: "Systemic Therapy", desc: "FOLFOX + Bevacizumab", icon: "droplet", color: "#f59e0b" },
      { title: "CT Staging", desc: "Hepatic metastases progression", icon: "alert-triangle", color: "#ef4444" },
      { title: "CT Staging", desc: "Pulmonary nodules detected", icon: "alert-triangle", color: "#ef4444" },
      { title: "Salvage Regimen", desc: "FOLFIRI + Cetuximab trial", icon: "droplet", color: "#8b5cf6" },
      { title: "Assessment", desc: "Widespread progression noted", icon: "x-circle", color: "#ef4444" }
    ]
  }
];
