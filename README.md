<div align="center">
  <h1>🌌 CodeAtlas</h1>
  <p><b>An immersive, AI-powered 3D knowledge orchestrator for modern developers.</b></p>
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="ThreeJS" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Ollama-FFFFFF?style=for-the-badge&logo=Ollama&logoColor=black" alt="Ollama" />
  </p>
</div>

<br />

**CodeAtlas** transforms the way you interact with software architecture. By combining advanced AI models (via Ollama Cloud) with a stunning 3D node-based visualization system, CodeAtlas allows you to instantly explore, chat with, and analyze entire codebases in real-time.

---

## ✨ Features

- **🌐 3D Knowledge Visualization**: A fully interactive, dynamic network graph built with `Three.js` and `@react-three/fiber` that visualizes repository structure and data flow.
- **🤖 Professional AI Orchestrator**: High-performance chat interface natively integrated with powerful models (like `gpt-oss:120b`, `gemma4:31b`, etc.). 
- **⚡ Real-Time Streaming**: Native Server-Sent Events (SSE) streaming for instantaneous, progressively rendered AI responses without hanging.
- **📄 File Context Awareness**: Upload your own files (`.ts`, `.js`, `.md`, `.json`, etc.) directly into the chat to provide instant context to the AI model.
- **🎨 Cinematic Aesthetic**: A premium dark-glass UI, featuring custom GLSL liquid shaders, GSAP scroll animations, backdrop blurs, and brutalist typography.
- **📝 Markdown & Syntax Highlighting**: Professional, highly structured markdown parsing with beautifully styled, copyable code blocks (using `react-markdown` and `rehype-highlight`).

---

## 🏗️ Architecture

CodeAtlas uses a dual-layer full-stack architecture:

1. **Frontend (React + Vite)**: 
   - Uses `Three.js` + `React Three Fiber` for high-performance 3D rendering.
   - Leverages `GSAP` and `Lenis` for smooth parallax and pinning scroll animations.
   - Built entirely with CSS modules and a custom CSS variable design system to maintain complete stylistic control without utility clutter.
2. **Backend (Node.js + Express)**:
   - Extremely lightweight, proxying requests safely to the Ollama Cloud.
   - Handles API key security and SSE chunking for the frontend streaming implementation.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/code-atlas.git
   cd code-atlas
   ```

2. **Install all dependencies**
   We have a root script that installs dependencies for both the frontend and backend simultaneously:
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**
   Navigate to the `backend` directory and set up your environment secrets:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Open the `.env` file and add your API keys:
   ```env
   OLLAMA_API_KEY_1=your_first_api_key_here
   OLLAMA_API_KEY_2=your_second_api_key_here
   ```

---

## 🎮 Running the Application

CodeAtlas includes a root script that spins up both the Node server and the React frontend concurrently.

Run this command from the **root directory**:

```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5001](http://localhost:5001)
- **Backend API Server**: [http://localhost:8080](http://localhost:8080)

---

## 📂 Project Structure

```text
code-atlas/
├── frontend/                     # React / Vite Application
│   ├── src/
│   │   ├── components/           # Reusable UI (ChatPanel, AIMessageRenderer)
│   │   ├── glsl/                 # Custom GLSL Shaders (WaterShader)
│   │   ├── landing/              # Landing page GSAP sections
│   │   └── scene/                # Three.js 3D implementation
│   └── index.css                 # Core design tokens
│
├── backend/                      # Node.js Express Server
│   ├── server.js                 # API routes & streaming logic
│   └── .env                      # Secure API keys
│
└── package.json                  # Root monorepo scripts
```

---

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.

---
<div align="center">
  <i>Built with ❤️ for developers who demand beautiful tools.</i>
</div>
