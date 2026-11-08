import React from 'react';
import { ChatPanel } from '../components/ChatPanel';
import { OrchestratorProvider } from '../context/OrchestratorContext';

export const Scene3D: React.FC = () => {
  return (
    <OrchestratorProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#080808' }}>
        <ChatPanel />
      </div>
    </OrchestratorProvider>
  );
};
