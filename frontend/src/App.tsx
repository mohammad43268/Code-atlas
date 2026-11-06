import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import './index.css'; 

const Scene3D = lazy(() =>
  import('./scene/Scene3D').then((m) => ({ default: m.Scene3D }))
);

const SceneLoader = () => (
  <div style={{
    height: '100svh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-solid)',
    color: 'var(--ink)',
    gap: '1rem',
    fontFamily: 'Inter, sans-serif'
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderTopColor: 'var(--accent-highlight)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <span style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
      Initializing 3D Workspace...
    </span>
  </div>
);

const Placeholder = ({ title }: { title: string }) => (
  <div style={{ height: '100svh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
    <h1 style={{ color: 'var(--ink)', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</h1>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/scene"
          element={
            <Suspense fallback={<SceneLoader />}>
              <Scene3D />
            </Suspense>
          }
        />
        <Route path="/docs" element={<Placeholder title="Documentation" />} />
        <Route path="/projects" element={<Placeholder title="Projects" />} />
        <Route path="/about" element={<Placeholder title="About" />} />
      </Routes>
    </Router>
  );
}

export default App;
