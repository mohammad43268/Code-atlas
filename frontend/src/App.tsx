import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { Scene3D } from './scene/Scene3D';
import './index.css'; 

const Placeholder = ({ title }: { title: string }) => (
  <div style={{ height: '100svh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
    <h1 style={{ color: 'var(--ink)', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</h1>
  </div>
);

function App() {
  const [showScene, setShowScene] = useState(false);

  if (showScene) {
    return <Scene3D onBack={() => setShowScene(false)} />;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage onExplore={() => setShowScene(true)} />} />
        <Route path="/docs" element={<Placeholder title="Documentation" />} />
        <Route path="/projects" element={<Placeholder title="Projects" />} />
        <Route path="/about" element={<Placeholder title="About" />} />
      </Routes>
    </Router>
  );
}

export default App;
