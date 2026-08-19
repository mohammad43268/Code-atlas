import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Scene3D } from './scene/Scene3D';
import './App.css'; // Will be essentially empty

type ViewState = 'landing' | 'scene';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage onExplore={() => setCurrentView('scene')} />
      )}
      {currentView === 'scene' && (
        <Scene3D onBack={() => setCurrentView('landing')} />
      )}
    </>
  );
}

export default App;
