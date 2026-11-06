import * as THREE from 'three';
import type { RepoNode, RepoConnection, FlowPath, RepoGraph } from '../types/orchestrator';

const EXTENSION_COLORS: Record<string, string> = {
  tsx: '#00e5ff',
  ts: '#00b0ff',
  jsx: '#ffd600',
  js: '#ffea00',
  py: '#448aff',
  rs: '#ff6e40',
  go: '#18ffff',
  css: '#e040fb',
  scss: '#ea80fc',
  html: '#ff6d00',
  json: '#69f0ae',
  yaml: '#00e676',
  yml: '#00e676',
  md: '#b0bec5',
  sql: '#7c4dff',
  sh: '#76ff03',
  env: '#ffab40',
};

function getExtensionColor(ext: string): string {
  return EXTENSION_COLORS[ext.toLowerCase()] || '#cfd8dc';
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export function parseGitHubRepo(input: string): { owner: string; repo: string } | null {
  const cleaned = input.trim().replace(/\/+$/, '');
  const matchUrl = cleaned.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/i);
  if (matchUrl) {
    return { owner: matchUrl[1], repo: matchUrl[2].replace(/\.git$/i, '') };
  }

  const matchShort = cleaned.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (matchShort) {
    return { owner: matchShort[1], repo: matchShort[2] };
  }

  return null;
}

interface GitHubTreeItem {
  path: string;
  type: 'tree' | 'blob';
  size?: number;
}

export function generateDefaultGraph(repoName = 'mohammad43268/Code-atlas'): RepoGraph {
  const FOLDER_NAMES = ['src/', 'components/', 'utils/', 'hooks/', 'api/', 'styles/'];
  const FILE_TEMPLATES: Record<string, string[]> = {
    'src/': ['App.tsx', 'main.tsx', 'index.css', 'routes.tsx'],
    'components/': ['Scene.tsx', 'ChatPanel.tsx', 'Navbar.tsx', 'AIMessageRenderer.tsx', 'WaterCanvas.tsx'],
    'utils/': ['helpers.ts', 'analytics.ts', 'constants.ts', 'formatters.ts'],
    'hooks/': ['useFitText.ts', 'useScroll.ts', 'useWindowSize.ts'],
    'api/': ['server.js', 'client.ts', 'endpoints.ts'],
    'styles/': ['landing.module.css', 'theme.css', 'variables.css']
  };

  const nodes: RepoNode[] = [];
  const connections: RepoConnection[] = [];
  const flowPaths: FlowPath[] = [];

  const folderCount = FOLDER_NAMES.length;
  const folderRadius = 3.6;

  FOLDER_NAMES.forEach((name, i) => {
    const angle = (i / folderCount) * Math.PI * 2;
    const r = folderRadius + Math.sin(i * 1.7) * 0.4;
    const pos: [number, number, number] = [
      Math.cos(angle) * r,
      Math.sin(i * 2.3) * 0.7,
      Math.sin(angle) * r
    ];

    const folderId = `folder-${i}`;
    nodes.push({
      id: folderId,
      name,
      path: name,
      type: 'folder',
      depth: 1,
      position: pos,
      color: '#ffffff'
    });

    const files = FILE_TEMPLATES[name] || ['index.ts'];
    const fileCount = files.length;
    const fileRadius = 1.6;

    files.forEach((fileName, j) => {
      const phi = Math.acos(-1 + (2 * (j + 0.5)) / fileCount);
      const theta = Math.sqrt(fileCount * Math.PI) * phi;
      const fr = fileRadius * (0.6 + seededRandom(i * 100 + j) * 0.5);

      const filePos: [number, number, number] = [
        pos[0] + Math.cos(theta) * Math.sin(phi) * fr,
        pos[1] + Math.sin(theta) * Math.sin(phi) * fr,
        pos[2] + Math.cos(phi) * fr
      ];

      const ext = fileName.split('.').pop() || '';
      const fileId = `file-${i}-${j}`;
      const lineCount = Math.floor(60 + seededRandom(i * 50 + j) * 350);

      nodes.push({
        id: fileId,
        name: fileName,
        path: `${name}${fileName}`,
        type: 'file',
        extension: ext,
        depth: 2,
        parentId: folderId,
        position: filePos,
        color: getExtensionColor(ext),
        lineCount
      });

      const start = new THREE.Vector3(...pos);
      const end = new THREE.Vector3(...filePos);

      connections.push({
        id: `conn-file-${i}-${j}`,
        sourceId: folderId,
        targetId: fileId,
        start,
        end,
        isCore: false
      });

      if (j % 2 === 0) {
        flowPaths.push({
          id: `flow-file-${i}-${j}`,
          start,
          end,
          speed: 0.2 + seededRandom(i * 20 + j) * 0.15,
          offset: j * 0.4
        });
      }
    });
  });

  // Core inter-folder connections
  for (let i = 0; i < folderCount; i++) {
    const nextIdx = (i + 1) % folderCount;
    const start = new THREE.Vector3(...nodes[i].position);
    const end = new THREE.Vector3(...nodes[nextIdx].position);

    connections.push({
      id: `conn-core-${i}`,
      sourceId: nodes[i].id,
      targetId: nodes[nextIdx].id,
      start,
      end,
      isCore: true
    });

    flowPaths.push({
      id: `flow-core-${i}`,
      start,
      end,
      speed: 0.14 + seededRandom(i) * 0.1,
      offset: i * 0.8
    });
  }

  // Cross structural ties
  if (folderCount >= 4) {
    const start0 = new THREE.Vector3(...nodes[0].position);
    const end2 = new THREE.Vector3(...nodes[2].position);
    connections.push({ id: 'conn-cross-1', sourceId: nodes[0].id, targetId: nodes[2].id, start: start0, end: end2, isCore: true });
    flowPaths.push({ id: 'flow-cross-1', start: start0, end: end2, speed: 0.12, offset: 0 });

    const start1 = new THREE.Vector3(...nodes[1].position);
    const end3 = new THREE.Vector3(...nodes[3].position);
    connections.push({ id: 'conn-cross-2', sourceId: nodes[1].id, targetId: nodes[3].id, start: start1, end: end3, isCore: true });
    flowPaths.push({ id: 'flow-cross-2', start: start1, end: end3, speed: 0.16, offset: 1.2 });
  }

  const filesOnly = nodes.filter(n => n.type === 'file');
  const foldersOnly = nodes.filter(n => n.type === 'folder');

  return {
    repoName,
    branch: 'main',
    nodes,
    connections,
    flowPaths,
    totalFiles: filesOnly.length,
    totalFolders: foldersOnly.length
  };
}

export async function fetchGitHubRepoGraph(owner: string, repo: string): Promise<RepoGraph> {
  const branches = ['main', 'master'];
  let treeData: GitHubTreeItem[] | null = null;
  let activeBranch = 'main';

  for (const branch of branches) {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.tree && Array.isArray(json.tree)) {
          treeData = json.tree;
          activeBranch = branch;
          break;
        }
      }
    } catch {
      // try next branch or fallback
    }
  }

  if (!treeData || treeData.length === 0) {
    console.warn(`GitHub API request failed or rate-limited. Falling back to synthetic layout for ${owner}/${repo}`);
    return generateDefaultGraph(`${owner}/${repo}`);
  }

  // Filter out unwanted files
  const filtered = treeData.filter(item => {
    const p = item.path;
    return !p.startsWith('.') &&
      !p.includes('node_modules/') &&
      !p.includes('dist/') &&
      !p.includes('build/') &&
      !p.endsWith('.lock') &&
      !p.endsWith('-lock.json');
  });

  // Extract distinct top-level directories
  const dirSet = new Set<string>();
  filtered.forEach(item => {
    const parts = item.path.split('/');
    if (parts.length > 1) {
      dirSet.add(parts[0] + '/');
    }
  });

  // Limit directories for clean 3D visual clarity
  const topDirs = Array.from(dirSet).slice(0, 8);
  if (topDirs.length === 0) topDirs.push('root/');

  const nodes: RepoNode[] = [];
  const connections: RepoConnection[] = [];
  const flowPaths: FlowPath[] = [];

  const folderCount = topDirs.length;
  const folderRadius = Math.max(3.5, folderCount * 0.7);

  // 1. Position folder nodes
  topDirs.forEach((dirName, i) => {
    const angle = (i / folderCount) * Math.PI * 2;
    const r = folderRadius + Math.sin(i * 1.5) * 0.3;
    const pos: [number, number, number] = [
      Math.cos(angle) * r,
      Math.sin(i * 2.1) * 0.8,
      Math.sin(angle) * r
    ];

    const folderId = `folder-${dirName}`;
    nodes.push({
      id: folderId,
      name: dirName,
      path: dirName,
      type: 'folder',
      depth: 1,
      position: pos,
      color: '#ffffff'
    });
  });

  // 2. Position file nodes around their respective folder cluster
  topDirs.forEach((dirName, i) => {
    const folderNode = nodes[i];
    const folderPos = folderNode.position;

    // Grab files belonging to this directory (cap at 12 files per directory for optimal GPU performance)
    const matchingFiles = filtered
      .filter(item => item.type === 'blob' && item.path.startsWith(dirName))
      .slice(0, 12);

    const childCount = matchingFiles.length;
    const childRadius = 1.8;

    matchingFiles.forEach((fileItem, j) => {
      const fileName = fileItem.path.split('/').pop() || 'file';
      const ext = fileName.split('.').pop() || '';

      const phi = Math.acos(-1 + (2 * (j + 0.5)) / (childCount || 1));
      const theta = Math.sqrt((childCount || 1) * Math.PI) * phi;
      const cr = childRadius * (0.6 + seededRandom(i * 50 + j) * 0.5);

      const filePos: [number, number, number] = [
        folderPos[0] + Math.cos(theta) * Math.sin(phi) * cr,
        folderPos[1] + Math.sin(theta) * Math.sin(phi) * cr,
        folderPos[2] + Math.cos(phi) * cr
      ];

      const fileId = `file-${fileItem.path}`;
      const lineCount = fileItem.size ? Math.max(15, Math.floor(fileItem.size / 38)) : Math.floor(40 + seededRandom(i * 20 + j) * 200);

      nodes.push({
        id: fileId,
        name: fileName,
        path: fileItem.path,
        type: 'file',
        extension: ext,
        depth: 2,
        parentId: folderNode.id,
        size: fileItem.size,
        lineCount,
        position: filePos,
        color: getExtensionColor(ext)
      });

      const start = new THREE.Vector3(...folderPos);
      const end = new THREE.Vector3(...filePos);

      connections.push({
        id: `conn-${folderNode.id}-${fileId}`,
        sourceId: folderNode.id,
        targetId: fileId,
        start,
        end,
        isCore: false
      });

      if (j % 2 === 0) {
        flowPaths.push({
          id: `flow-${fileId}`,
          start,
          end,
          speed: 0.2 + seededRandom(i * 30 + j) * 0.15,
          offset: j * 0.5
        });
      }
    });
  });

  // 3. Core inter-directory connections
  for (let i = 0; i < folderCount; i++) {
    const nextIdx = (i + 1) % folderCount;
    const start = new THREE.Vector3(...nodes[i].position);
    const end = new THREE.Vector3(...nodes[nextIdx].position);

    connections.push({
      id: `core-conn-${i}`,
      sourceId: nodes[i].id,
      targetId: nodes[nextIdx].id,
      start,
      end,
      isCore: true
    });

    flowPaths.push({
      id: `core-flow-${i}`,
      start,
      end,
      speed: 0.15,
      offset: i * 0.7
    });
  }

  const filesOnly = nodes.filter(n => n.type === 'file');
  const foldersOnly = nodes.filter(n => n.type === 'folder');

  return {
    repoName: `${owner}/${repo}`,
    branch: activeBranch,
    nodes,
    connections,
    flowPaths,
    totalFiles: filesOnly.length,
    totalFolders: foldersOnly.length
  };
}
