import React from 'react';
import { ChatPanel } from '../components/ChatPanel';

interface Scene3DProps {
  onBack: () => void;
}

export const Scene3D: React.FC<Scene3DProps> = ({ onBack }) => {
  return (
    <div className="scene-container">
      <button className="back-button" onClick={onBack}>
        ← Back to Home
      </button>
      <ChatPanel />
    </div>
  );
};
