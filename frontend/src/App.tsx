import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import './index.css';

const Scene3D = lazy(() => import('./scene/Scene3D').then((m) => ({ default: m.Scene3D })));

const Placeholder = ({ title }: { title: string }) => (
  <div
    style={{
      height: '100svh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)'
    }}
  >
    <h1 style={{ color: 'var(--ink)', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {title}
    </h1>
  </div>
);

const SceneRouteLoader = () => (
  <div
    style={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#080808',
      gap: '12px'
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '2px solid rgba(0, 255, 204, 0.2)',
        borderTopColor: 'var(--accent-highlight)',
        animation: 'spin 0.8s linear infinite'
      }}
    />
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase'
      }}
    >
      INITIALIZING CODE ATLAS 3D...
    </span>
  </div>
);

function App() {
  return (
    <Router>
      <div className="film-grain" aria-hidden="true" />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/scene"
          element={
            <Suspense fallback={<SceneRouteLoader />}>
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
