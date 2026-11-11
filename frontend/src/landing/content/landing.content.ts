export interface ServiceItem {
  name: string;
  tag: string;
  desc: string;
}

export interface RoadmapMilestone {
  phase: string;
  title: string;
  status: 'COMPLETED' | 'IN DEVELOPMENT' | 'PLANNED';
  date: string;
  details: string;
}

export interface TeamMember {
  name: string;
  role: string;
  handle: string;
}

export const content = {
  statement: {
    label: "[01 // MANIFESTO]",
    headline: "Software architecture is physical topography, not flat text files.",
    support: "CodeAtlas transpiles Git repositories into navigable 3D spatial networks. We extract language ASTs, map transitive dependency graphs, and orchestrate grounded reasoning copilot telemetry in real time."
  },
  howItWorks: [
    {
      step: "01",
      tag: "AST_STREAM",
      title: "Stream AST and topological dependency trees directly from GitHub.",
      desc: "Connect any repository. CodeAtlas parses file trees, language signatures, and folder hierarchies into structured graph nodes.",
      img: "/an open laptop computer sitting on top of a desk next to a notebook and pen.jpg"
    },
    {
      step: "02",
      tag: "SPATIAL_PROJECTION",
      title: "De-flatten code into a 3D force-directed coordinate space.",
      desc: "Files orbit their parent modules in 3D physics. Photons travel along interconnections, visualizing data contracts and modular boundaries.",
      img: "/Master Logical Thinking for Superior Software Development 🧠.jpg"
    },
    {
      step: "03",
      tag: "GROUNDED_COPILOT",
      title: "Inspect any node and pin code context directly into reasoning copilot.",
      desc: "Click any 3D node to inspect file size and depth, fly the camera to its coordinates, or pin it into the copilot dock for grounded architectural Q&A.",
      img: "/Coder.jpg"
    }
  ],
  features: [
    {
      id: "spatial-engine",
      tag: "01 // RENDERING ENGINE",
      title: "Instanced WebGL Cartography",
      desc: "Thousands of code nodes clustered by architectural semantic density with smooth 120 FPS camera fly-to dynamics and damped orbital navigation.",
      metric: "120 FPS // INSTANCED",
      status: "PRODUCTION",
      img: "/feature1.jpg"
    },
    {
      id: "grounded-reasoning",
      tag: "02 // REASONING BUS",
      title: "Bi-Directional 3D Context Pinning",
      desc: "AI responses are physically grounded in your graph. Clicking citations in chat flies the camera to the exact file node in 3D space.",
      metric: "24MS // ZERO DRIFT",
      status: "ONLINE",
      img: "/feature2.jpg"
    },
    {
      id: "dependency-analyzer",
      tag: "03 // STATIC ANALYSIS",
      title: "Transitive Graph Extraction",
      desc: "Instantly detect cyclic imports, orphaned components, and monolithic cluster bottlenecks with visual laser connection paths.",
      metric: "99.8% AST FIDELITY",
      status: "ACTIVE",
      img: "/feature3.jpg"
    }
  ],
  underTheHood: {
    label: "[03 // INFRASTRUCTURE MATRIX]",
    line: "A decoupled, high-throughput micro-architecture orchestrated over high-frequency JSON-SSE event streams.",
    services: [
      { name: "GIT TREE PARSER", tag: "SRV_01", desc: "Recursive Git tree & AST ingestion" },
      { name: "DEPENDENCY GRAPH", tag: "SRV_02", desc: "Transitive module link computation" },
      { name: "SPATIAL CLUSTERER", tag: "SRV_03", desc: "3D force-directed layout computation" },
      { name: "GROUNDING COPILOT", tag: "SRV_04", desc: "Ollama / LLM context injection bridge" },
      { name: "STREAM DISPATCHER", tag: "SRV_05", desc: "Server-Sent Events real-time pipeline" }
    ],
    bottomLabel: "DETERMINISTIC KNOWLEDGE GRAPH CONTRACT",
    storageLabel: "UNIFIED SPATIAL CODEBASE MATRIX"
  },
  team: [
    { name: "Mohammad Huzaifa", role: "Core Architecture & WebGL Systems", handle: "@mohammad43268" },
    { name: "CodeAtlas Core Engine", role: "Spatial Knowledge Graph & AST Pipeline", handle: "v1.0-release" },
    { name: "Copilot Orchestration", role: "Bi-directional Context Pinning & Grounding", handle: "gemini-ollama" }
  ] as TeamMember[],
  roadmap: [
    { phase: "PHASE 01", title: "Git AST Ingestion & Spatial R3F Graph", status: "COMPLETED", date: "Q3 2026", details: "Recursive tree ingestion, force-directed node layout, and shader water canvas." },
    { phase: "PHASE 02", title: "Bi-directional Context Pinning & Fly-To Controls", status: "COMPLETED", date: "Q4 2026", details: "Camera flight damping, node inspector, and grounded SSE streaming copilot." },
    { phase: "PHASE 03", title: "Multi-Repo Federation & Realtime Collaborative Rooms", status: "IN DEVELOPMENT", date: "Q1 2027", details: "Shared WebRTC spatial rooms with multiplayer camera synchronization." },
    { phase: "PHASE 04", title: "Automated Architectural Drift & Security Heatmaps", status: "PLANNED", date: "Q2 2027", details: "Color-coded vulnerability clusters, PR impact simulation, and git diff topology." }
  ] as RoadmapMilestone[],
  cta: {
    label: "[05 // LAUNCH SEQUENCE]",
    headline: "Explore your codebase as a living spatial universe.",
    subheadline: "Scan any public repository URL and launch the 3D orchestrator in under 3 seconds.",
    links: [
      { text: "Launch 3D Orchestrator", to: "/scene", isPrimary: true },
      { text: "Documentation", to: "/docs", isPrimary: false },
      { text: "Architecture Spec", to: "/projects", isPrimary: false }
    ]
  },
  footer: {
    repoLink: "https://github.com/mohammad43268/Code-atlas",
    copyright: "2026 CODEATLAS RESEARCH LABS // ALL RIGHTS RESERVED",
    status: "ORCHESTRATOR MATRIX: OPERATIONAL",
    links: [
      { name: "Home", path: "/" },
      { name: "3D Space", path: "/scene" },
      { name: "Docs", path: "/docs" },
      { name: "Projects", path: "/projects" },
      { name: "About", path: "/about" }
    ]
  }
};
