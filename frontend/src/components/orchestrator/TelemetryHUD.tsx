import React from 'react';
import { useOrchestrator } from '../../context/useOrchestrator';

export const TelemetryHUD: React.FC = () => {
  const {
    autoRotate,
    showGrid,
    dataFlowSpeed,
    setAutoRotate,
    setShowGrid,
    setDataFlowSpeed,
    resetCamera
  } = useOrchestrator();

  const cycleFlowSpeed = () => {
    const speeds = [0.5, 1, 2, 4];
    const currentIndex = speeds.indexOf(dataFlowSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length] ?? 1;
    setDataFlowSpeed(nextSpeed);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        height: '36px',
        padding: '4px',
        background: '#161922',
        border: '1px solid #262B38',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      {/* Reset */}
      <button
        type="button"
        onClick={resetCamera}
        title="Reset Camera Overview"
        style={{
          height: '28px',
          padding: '0 10px',
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: '5px',
          color: '#94A3B8',
          fontSize: '11.5px',
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#F8FAFC';
          e.currentTarget.style.background = '#212634';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#94A3B8';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <i className="fa-solid fa-crosshairs" style={{ fontSize: '11px', color: '#64748B' }} />
        <span>Reset</span>
      </button>

      {/* Orbit */}
      <button
        type="button"
        onClick={() => setAutoRotate((prev) => !prev)}
        title="Toggle Damped 3D Orbit"
        style={{
          height: '28px',
          padding: '0 10px',
          background: autoRotate ? '#252B3B' : 'transparent',
          border: autoRotate ? '1px solid #3B445E' : '1px solid transparent',
          borderRadius: '5px',
          color: autoRotate ? '#60A5FA' : '#94A3B8',
          fontSize: '11.5px',
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          if (!autoRotate) {
            e.currentTarget.style.color = '#F8FAFC';
            e.currentTarget.style.background = '#212634';
          }
        }}
        onMouseLeave={(e) => {
          if (!autoRotate) {
            e.currentTarget.style.color = '#94A3B8';
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        <i
          className="fa-solid fa-rotate"
          style={{
            fontSize: '11px',
            animation: autoRotate ? 'spin 6s linear infinite' : 'none'
          }}
        />
        <span>Orbit</span>
      </button>

      {/* Grid */}
      <button
        type="button"
        onClick={() => setShowGrid((prev) => !prev)}
        title="Toggle Viewport Grid"
        style={{
          height: '28px',
          padding: '0 10px',
          background: showGrid ? '#252B3B' : 'transparent',
          border: showGrid ? '1px solid #3B445E' : '1px solid transparent',
          borderRadius: '5px',
          color: showGrid ? '#60A5FA' : '#94A3B8',
          fontSize: '11.5px',
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          if (!showGrid) {
            e.currentTarget.style.color = '#F8FAFC';
            e.currentTarget.style.background = '#212634';
          }
        }}
        onMouseLeave={(e) => {
          if (!showGrid) {
            e.currentTarget.style.color = '#94A3B8';
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        <i className="fa-solid fa-border-all" style={{ fontSize: '11px' }} />
        <span>Grid</span>
      </button>

      {/* Speed (1x) */}
      <button
        type="button"
        onClick={cycleFlowSpeed}
        title="Cycle Data Flow Photon Speed (0.5x, 1x, 2x, 4x)"
        style={{
          height: '28px',
          padding: '0 10px',
          background: dataFlowSpeed > 1 ? '#252B3B' : 'transparent',
          border: dataFlowSpeed > 1 ? '1px solid #3B445E' : '1px solid transparent',
          borderRadius: '5px',
          color: dataFlowSpeed > 1 ? '#818CF8' : '#94A3B8',
          fontSize: '11.5px',
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          if (dataFlowSpeed <= 1) {
            e.currentTarget.style.color = '#F8FAFC';
            e.currentTarget.style.background = '#212634';
          }
        }}
        onMouseLeave={(e) => {
          if (dataFlowSpeed <= 1) {
            e.currentTarget.style.color = '#94A3B8';
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        <i className="fa-solid fa-bolt" style={{ fontSize: '10px' }} />
        <span>{dataFlowSpeed}x</span>
      </button>
    </div>
  );
};
