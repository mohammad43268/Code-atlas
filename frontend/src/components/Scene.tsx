import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  CameraControls,
  Grid,
  Stars,
  Float,
  Html,
  QuadraticBezierLine,
  useGLTF
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useOrchestrator } from '../context/useOrchestrator';
import type { RepoNode } from '../types/orchestrator';

interface SemanticColorDef {
  color: string;
  glow: string;
  category: string;
}

function getSemanticColor(pathOrName: string, extension?: string): SemanticColorDef {
  const lower = (pathOrName || '').toLowerCase();

  // 1. Logic, Hooks & Utils: Amber
  if (
    lower.includes('hook') ||
    lower.includes('util') ||
    lower.includes('lib') ||
    lower.includes('store') ||
    lower.includes('context') ||
    lower.includes('helper') ||
    lower.includes('state')
  ) {
    return { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.25)', category: 'Logic' };
  }

  // 2. UI & Components: Sky Cyan
  if (
    lower.includes('component') ||
    lower.includes('view') ||
    lower.includes('page') ||
    lower.includes('layout') ||
    extension === 'tsx' ||
    extension === 'jsx'
  ) {
    return { color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.25)', category: 'UI' };
  }

  // 3. Backend & API: Emerald
  if (
    lower.includes('api') ||
    lower.includes('service') ||
    lower.includes('route') ||
    lower.includes('server') ||
    lower.includes('controller') ||
    lower.includes('backend')
  ) {
    return { color: '#10B981', glow: 'rgba(16, 185, 129, 0.25)', category: 'API' };
  }

  // 4. Styles & Assets: Rose Pink
  if (
    lower.includes('style') ||
    lower.includes('css') ||
    lower.includes('asset') ||
    lower.includes('public') ||
    lower.includes('theme') ||
    extension === 'css' ||
    extension === 'scss' ||
    extension === 'svg' ||
    extension === 'png' ||
    extension === 'jpg' ||
    extension === 'glsl'
  ) {
    return { color: '#EC4899', glow: 'rgba(236, 72, 153, 0.25)', category: 'Styles' };
  }

  // 5. Core / Root: Indigo
  if (
    lower.includes('src') ||
    lower.startsWith('main.') ||
    lower.startsWith('index.') ||
    lower.startsWith('app.')
  ) {
    return { color: '#6366F1', glow: 'rgba(99, 102, 241, 0.25)', category: 'Core' };
  }

  return { color: '#94A3B8', glow: 'rgba(148, 163, 184, 0.25)', category: 'Default' };
}

function formatNodeLabel(name: string, type: 'folder' | 'file'): string {
  if (type === 'folder') {
    const clean = name.replace(/\/+$/, '');
    return `${clean}/`;
  }
  return name.replace(/\/+$/, '');
}

function FolderModel({ position, color }: { position: [number, number, number]; color: string }) {
  const { scene } = useGLTF('/folder.glb');
  const clone = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(color),
          roughness: 0.25,
          metalness: 0.6,
          clearcoat: 0.8
        });
      }
    });
    return c;
  }, [scene, color]);

  return <primitive object={clone} position={position} scale={0.35} rotation={[Math.PI / 2, 0, 0]} />;
}

function FolderNode({ node }: { node: RepoNode }) {
  const { selectedNode, hoveredNode, setHoveredNode, focusNode } = useOrchestrator();
  const isSelected = selectedNode?.id === node.id;
  const isHovered = hoveredNode?.id === node.id;
  const semantic = getSemanticColor(node.path || node.name, node.extension);
  const displayLabel = formatNodeLabel(node.name, 'folder');

  return (
    <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.4}>
      <group
        position={node.position}
        onClick={(e) => {
          e.stopPropagation();
          focusNode(node.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredNode(node);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredNode(null);
          document.body.style.cursor = 'default';
        }}
      >
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[0.48, 0.34, 0.06]} />
              <meshPhysicalMaterial
                color={semantic.color}
                roughness={0.25}
                metalness={0.6}
                clearcoat={0.8}
                emissive={semantic.color}
                emissiveIntensity={0.15}
              />
            </mesh>
          }
        >
          <FolderModel position={[0, 0, 0]} color={semantic.color} />
        </Suspense>

        {/* Sleek, thin semantic-colored selection ring */}
        {isSelected && (
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <ringGeometry args={[0.55, 0.58, 48]} />
            <meshBasicMaterial
              color={semantic.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.55}
            />
          </mesh>
        )}

        {isHovered && !isSelected && (
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <ringGeometry args={[0.53, 0.55, 48]} />
            <meshBasicMaterial
              color={semantic.color}
              side={THREE.DoubleSide}
              transparent
              opacity={0.3}
            />
          </mesh>
        )}

        {/* Figma-Style 3D HTML Node Pill (Single clean badge, no duplicate stacked slashes) */}
        <Html
          center
          distanceFactor={9}
          position={[0, -0.58, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(20, 23, 31, 0.88)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: isSelected
                ? `1px solid ${semantic.color}`
                : '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '11px',
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
              color: '#F1F5F9',
              whiteSpace: 'nowrap',
              boxShadow: isSelected
                ? `0 0 16px ${semantic.glow}, 0 4px 12px rgba(0,0,0,0.4)`
                : '0 4px 12px rgba(0,0,0,0.4)'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: semantic.color,
                display: 'inline-block',
                flexShrink: 0,
                boxShadow: `0 0 6px ${semantic.color}`
              }}
            />
            <span>{displayLabel}</span>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function FileNode({ node }: { node: RepoNode }) {
  const { selectedNode, hoveredNode, setHoveredNode, focusNode } = useOrchestrator();
  const isSelected = selectedNode?.id === node.id;
  const isHovered = hoveredNode?.id === node.id;
  const semantic = getSemanticColor(node.path || node.name, node.extension);
  const displayLabel = formatNodeLabel(node.name, 'file');

  const shapeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 0.12;
    const h = 0.16;
    const fold = 0.04;

    shape.moveTo(-w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2);
    shape.lineTo(w / 2, h / 2 - fold);
    shape.lineTo(w / 2 - fold, h / 2);
    shape.lineTo(-w / 2, h / 2);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  const scale = isSelected ? 1.35 : isHovered ? 1.2 : 1.0;

  return (
    <group
      position={node.position}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        e.stopPropagation();
        focusNode(node.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredNode(node);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredNode(null);
        document.body.style.cursor = 'default';
      }}
    >
      <mesh geometry={shapeGeometry}>
        <meshPhysicalMaterial
          color={semantic.color}
          roughness={0.25}
          metalness={0.6}
          clearcoat={0.8}
          emissive={semantic.color}
          emissiveIntensity={isSelected ? 0.45 : isHovered ? 0.25 : 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle file lines */}
      <mesh position={[0, 0.01, 0.001]}>
        <planeGeometry args={[0.06, 0.004]} />
        <meshBasicMaterial color="#F8FAFC" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.015, 0.001]}>
        <planeGeometry args={[0.06, 0.004]} />
        <meshBasicMaterial color="#F8FAFC" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Sleek thin selection ring */}
      {isSelected && (
        <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.17, 36]} />
          <meshBasicMaterial color={semantic.color} side={THREE.DoubleSide} transparent opacity={0.55} />
        </mesh>
      )}

      {/* Figma-Style HTML Micro-Pill revealed on hover or selection */}
      {(isHovered || isSelected) && (
        <Html
          center
          distanceFactor={8}
          position={[0, -0.22, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(20, 23, 31, 0.88)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: isSelected
                ? `1px solid ${semantic.color}`
                : '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '11px',
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
              color: '#F1F5F9',
              whiteSpace: 'nowrap',
              boxShadow: isSelected
                ? `0 0 16px ${semantic.glow}, 0 4px 12px rgba(0,0,0,0.4)`
                : '0 4px 12px rgba(0,0,0,0.4)'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: semantic.color,
                display: 'inline-block',
                flexShrink: 0,
                boxShadow: `0 0 6px ${semantic.color}`
              }}
            />
            <span>{displayLabel}</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function ConnectionLine({
  start,
  end,
  isCore,
  sourceColor,
  isActive
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  isCore: boolean;
  sourceColor: string;
  isActive: boolean;
}) {
  const { startTuple, midTuple, endTuple } = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    mid.y += Math.min(0.85, dist * 0.16);
    return {
      startTuple: [start.x, start.y, start.z] as [number, number, number],
      midTuple: [mid.x, mid.y, mid.z] as [number, number, number],
      endTuple: [end.x, end.y, end.z] as [number, number, number]
    };
  }, [start, end]);

  return (
    <QuadraticBezierLine
      start={startTuple}
      mid={midTuple}
      end={endTuple}
      color={isActive ? sourceColor : isCore ? sourceColor : '#3B445E'}
      lineWidth={isActive ? 1.5 : isCore ? 1.05 : 0.65}
      transparent
      opacity={isActive ? 0.85 : isCore ? 0.35 : 0.22}
    />
  );
}

function DataFlow({ start, end, speed, offset, color }: { start: THREE.Vector3; end: THREE.Vector3; speed: number; offset: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { dataFlowSpeed } = useOrchestrator();
  const midPoint = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.y += Math.min(0.85, start.distanceTo(end) * 0.16);
    return mid;
  }, [start, end]);
  const curve = useMemo(
    () => new THREE.QuadraticBezierCurve3(start, midPoint, end),
    [start, midPoint, end]
  );

  useFrame((state) => {
    if (meshRef.current) {
      const adjustedSpeed = speed * dataFlowSpeed;
      const raw = (state.clock.elapsedTime * adjustedSpeed + offset) % 2;
      const t = raw > 1 ? 2 - raw : raw;
      curve.getPoint(t, meshRef.current.position);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.88} />
    </mesh>
  );
}

function CameraFlightController() {
  const { cameraTarget, autoRotate } = useOrchestrator();
  const controlsRef = useRef<CameraControls>(null!);

  useEffect(() => {
    if (!controlsRef.current || !cameraTarget) return;
    const { eye, target } = cameraTarget;
    controlsRef.current.setLookAt(
      eye[0], eye[1], eye[2],
      target[0], target[1], target[2],
      true
    );
  }, [cameraTarget]);

  useFrame((_, delta) => {
    if (controlsRef.current && autoRotate) {
      controlsRef.current.azimuthAngle += 0.08 * delta;
    }
  });

  return (
    <CameraControls
      ref={controlsRef}
      minDistance={2.5}
      maxDistance={25}
      smoothTime={0.8}
    />
  );
}

function DynamicRepositoryGraph() {
  const { graph, selectedNode, hoveredNode } = useOrchestrator();
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const nodeMap = useMemo(() => {
    const map = new Map<string, RepoNode>();
    graph.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [graph.nodes]);

  const activeNodeId = selectedNode?.id || hoveredNode?.id;

  return (
    <group ref={groupRef}>
      {/* Folder Nodes */}
      {graph.nodes.filter(n => n.type === 'folder').map(node => (
        <FolderNode key={node.id} node={node} />
      ))}

      {/* File Nodes */}
      {graph.nodes.filter(n => n.type === 'file').map(node => (
        <FileNode key={node.id} node={node} />
      ))}

      {/* Curved Architectural Interconnections */}
      {graph.connections.map(conn => {
        const sourceNode = nodeMap.get(conn.sourceId);
        const sourceColor = sourceNode ? getSemanticColor(sourceNode.path || sourceNode.name, sourceNode.extension).color : '#38BDF8';
        const isActive = activeNodeId === conn.sourceId || activeNodeId === conn.targetId;

        return (
          <ConnectionLine
            key={conn.id}
            start={conn.start}
            end={conn.end}
            isCore={conn.isCore}
            sourceColor={sourceColor}
            isActive={isActive}
          />
        );
      })}

      {/* Realtime Data Flows along Bezier Arcs */}
      {graph.flowPaths.map(fp => (
        <DataFlow
          key={fp.id}
          start={fp.start}
          end={fp.end}
          speed={fp.speed}
          offset={fp.offset}
          color="#38BDF8"
        />
      ))}
    </group>
  );
}

export const Scene: React.FC = () => {
  const { showGrid, resetCamera } = useOrchestrator();

  return (
    <Canvas
      camera={{ position: [0, 2, 9], fov: 50 }}
      style={{ width: '100%', height: '100%', cursor: 'grab', background: '#0B0D12' }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onPointerMissed={(e) => {
        if (e.type === 'click') resetCamera();
      }}
    >
      <color attach="background" args={['#0B0D12']} />
      <fogExp2 attach="fog" args={['#0B0D12', 0.018]} />

      {/* Subtle Atmospheric Starfield */}
      <Stars radius={50} depth={40} count={900} factor={3.0} saturation={0} fade speed={0.45} />

      {/* Studio Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 9, 5]} intensity={1.3} color="#F8FAFC" />
      <directionalLight position={[-6, 4, -5]} intensity={0.55} color="#38BDF8" />
      <directionalLight position={[0, -5, -6]} intensity={0.3} color="#818CF8" />
      <pointLight position={[0, 1.5, 0]} intensity={0.65} color="#E2E8F0" distance={12} decay={2} />

      {/* Dynamic Repository Hierarchy */}
      <DynamicRepositoryGraph />

      {/* Studio Viewport Grid (Blender/Spline subtle dark theme) */}
      {showGrid && (
        <Grid
          position={[0, -4.2, 0]}
          args={[60, 60]}
          infiniteGrid
          sectionSize={3}
          sectionColor="#212634"
          sectionThickness={1.0}
          cellColor="#161922"
          cellThickness={0.6}
          fadeDistance={55}
          fadeStrength={1.5}
        />
      )}

      {/* Lightweight Bloom Post-Processing (RTX 3050 Optimized) */}
      <EffectComposer enableNormalPass={false} multisampling={0}>
        <Bloom luminanceThreshold={0.85} intensity={0.38} mipmapBlur radius={0.4} />
      </EffectComposer>

      {/* Camera Flight & Damped Orbit Controller */}
      <CameraFlightController />
    </Canvas>
  );
};
