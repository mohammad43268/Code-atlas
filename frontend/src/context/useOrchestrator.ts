import { createContext, useContext } from 'react';
import type { RepoGraph, RepoNode } from '../types/orchestrator';

export interface CameraTarget {
  eye: [number, number, number];
  target: [number, number, number];
  timestamp: number;
}

export interface OrchestratorContextType {
  graph: RepoGraph;
  isLoading: boolean;
  statusMessage: string;
  selectedNode: RepoNode | null;
  hoveredNode: RepoNode | null;
  pinnedContextNode: RepoNode | null;
  cameraTarget: CameraTarget | null;
  autoRotate: boolean;
  showGrid: boolean;
  dataFlowSpeed: number;
  setSelectedNode: (node: RepoNode | null) => void;
  setHoveredNode: (node: RepoNode | null) => void;
  setPinnedContextNode: (node: RepoNode | null) => void;
  setAutoRotate: (val: boolean | ((prev: boolean) => boolean)) => void;
  setShowGrid: (val: boolean | ((prev: boolean) => boolean)) => void;
  setDataFlowSpeed: (val: number | ((prev: number) => number)) => void;
  loadRepo: (repoInput: string) => Promise<boolean>;
  focusNode: (nodeIdOrPath: string) => void;
  resetCamera: () => void;
}

export const OrchestratorContext = createContext<OrchestratorContextType | null>(null);

export const useOrchestrator = () => {
  const ctx = useContext(OrchestratorContext);
  if (!ctx) {
    throw new Error('useOrchestrator must be used within an OrchestratorProvider');
  }
  return ctx;
};
