import * as THREE from 'three';

export type NodeType = 'folder' | 'file';

export interface RepoNode {
  id: string;
  name: string;
  path: string;
  type: NodeType;
  extension?: string;
  size?: number;
  depth: number;
  parentId?: string;
  position: [number, number, number];
  color: string;
  lineCount?: number;
}

export interface RepoConnection {
  id: string;
  sourceId: string;
  targetId: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  isCore: boolean;
}

export interface FlowPath {
  id: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  speed: number;
  offset: number;
}

export interface RepoGraph {
  repoName: string;
  branch: string;
  nodes: RepoNode[];
  connections: RepoConnection[];
  flowPaths: FlowPath[];
  totalFiles: number;
  totalFolders: number;
}
