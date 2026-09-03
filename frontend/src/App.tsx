import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ChatPanel } from './components/ChatPanel';
import './index.css'; 

type ViewState = 'landing' | 'chat';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage onExplore={() => setCurrentView('chat')} />
      )}
      {currentView === 'chat' && (
        <ChatPanel />
      )}
    </>
  );
}

export default App;
