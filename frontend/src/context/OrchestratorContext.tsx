import React, { useState, useCallback } from 'react';
import type { RepoGraph, RepoNode } from '../types/orchestrator';
import { generateDefaultGraph, fetchGitHubRepoGraph, parseGitHubRepo } from '../services/githubTreeService';
import { OrchestratorContext } from './useOrchestrator';
import type { CameraTarget } from './useOrchestrator';

const DEFAULT_CAMERA: CameraTarget = {
  eye: [0, 2, 9],
  target: [0, 0, 0],
  timestamp: Date.now()
};

export const OrchestratorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [graph, setGraph] = useState<RepoGraph>(() => generateDefaultGraph());
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Online');
  const [selectedNode, setSelectedNode] = useState<RepoNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<RepoNode | null>(null);
  const [pinnedContextNode, setPinnedContextNode] = useState<RepoNode | null>(null);
  const [cameraTarget, setCameraTarget] = useState<CameraTarget | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [dataFlowSpeed, setDataFlowSpeed] = useState(1);

  const focusNode = useCallback((nodeIdOrPath: string) => {
    const target = graph.nodes.find(n => n.id === nodeIdOrPath || n.path === nodeIdOrPath || n.name === nodeIdOrPath);
    if (!target) return;

    setSelectedNode(target);
    if (target.type === 'file') {
      setPinnedContextNode(target);
    }

    const [nx, ny, nz] = target.position;

    // Position camera offset to view node comfortably
    const dist = target.type === 'folder' ? 3.2 : 1.8;
    setCameraTarget({
      eye: [nx + dist * 0.7, ny + dist * 0.5, nz + dist],
      target: [nx, ny, nz],
      timestamp: Date.now()
    });
  }, [graph.nodes]);

  const resetCamera = useCallback(() => {
    setSelectedNode(null);
    setCameraTarget({ ...DEFAULT_CAMERA, timestamp: Date.now() });
  }, []);

  const loadRepo = useCallback(async (repoInput: string): Promise<boolean> => {
    const parsed = parseGitHubRepo(repoInput);
    if (!parsed) {
      setStatusMessage('Invalid GitHub repo format (use owner/repo)');
      return false;
    }

    setIsLoading(true);
    setStatusMessage(`Scanning GitHub tree for ${parsed.owner}/${parsed.repo}...`);

    try {
      const newGraph = await fetchGitHubRepoGraph(parsed.owner, parsed.repo);
      setGraph(newGraph);
      setSelectedNode(null);
      setPinnedContextNode(null);
      resetCamera();
      setStatusMessage(`Loaded ${newGraph.repoName} (${newGraph.totalFiles} files)`);
      return true;
    } catch (err: any) {
      console.error('Failed to load GitHub tree:', err);
      setStatusMessage(`Error loading repo: ${err.message || 'Network error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [resetCamera]);

  return (
    <OrchestratorContext.Provider
      value={{
        graph,
        isLoading,
        statusMessage,
        selectedNode,
        hoveredNode,
        pinnedContextNode,
        cameraTarget,
        autoRotate,
        showGrid,
        dataFlowSpeed,
        setSelectedNode,
        setHoveredNode,
        setPinnedContextNode,
        setAutoRotate,
        setShowGrid,
        setDataFlowSpeed,
        loadRepo,
        focusNode,
        resetCamera
      }}
    >
      {children}
    </OrchestratorContext.Provider>
  );
};
