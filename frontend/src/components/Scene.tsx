import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, Grid, Stars, Float, Text, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useOrchestrator } from '../context/useOrchestrator';
import type { RepoNode } from '../types/orchestrator';

function FolderModel({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/folder.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={clone} position={position} scale={0.35} rotation={[Math.PI / 2, 0, 0]} />;
}

function FolderNode({ node }: { node: RepoNode }) {
  const { selectedNode, hoveredNode, setHoveredNode, focusNode } = useOrchestrator();
  const isSelected = selectedNode?.id === node.id;
  const isHovered = hoveredNode?.id === node.id;

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.5}>
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
              <boxGeometry args={[0.5, 0.35, 0.05]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.15} />
            </mesh>
          }
        >
          <FolderModel position={[0, 0, 0]} />
        </Suspense>

        {/* Selection / Hover Indicator Ring */}
        {(isSelected || isHovered) && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.55, 0.62, 32]} />
            <meshBasicMaterial
              color={isSelected ? 'var(--accent-highlight)' : '#ffffff'}
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}

        <Text
          position={[0, -0.55, 0]}
          fontSize={0.16}
          color={isSelected ? '#00ffcc' : isHovered ? '#ffffff' : '#aaaaaa'}
          anchorX="center"
          anchorY="top"
          outlineWidth={0.006}
          outlineColor="black"
        >
          {node.name}
        </Text>
      </group>
    </Float>
  );
}

function FileNode({ node }: { node: RepoNode }) {
  const { selectedNode, hoveredNode, setHoveredNode, focusNode } = useOrchestrator();
  const isSelected = selectedNode?.id === node.id;
  const isHovered = hoveredNode?.id === node.id;

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

  const scale = isSelected ? 1.4 : isHovered ? 1.25 : 1.0;

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
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.35 : 0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Decorative file lines */}
      <mesh position={[0, 0.01, 0.001]}>
        <planeGeometry args={[0.06, 0.005]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.015, 0.001]}>
        <planeGeometry args={[0.06, 0.005]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Selection halo */}
      {isSelected && (
        <mesh position={[0, 0, -0.002]}>
          <planeGeometry args={[0.18, 0.22]} />
          <meshBasicMaterial color="#00ffcc" wireframe transparent opacity={0.7} />
        </mesh>
      )}

      {/* Label on hover or selected */}
      {(isHovered || isSelected) && (
        <Text
          position={[0, -0.16, 0]}
          fontSize={0.09}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.004}
          outlineColor="black"
        >
          {node.name}
        </Text>
      )}
    </group>
  );
}

function ConnectionLine({ start, end, isCore }: { start: THREE.Vector3; end: THREE.Vector3; isCore: boolean }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(
      new Float32Array([start.x, start.y, start.z, end.x, end.y, end.z]), 3
    ));
    return geo;
  }, [start, end]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color={isCore ? '#ffffff' : '#666666'}
        transparent
        opacity={isCore ? 0.35 : 0.14}
      />
    </lineSegments>
  );
}

function DataFlow({ start, end, speed, offset }: { start: THREE.Vector3; end: THREE.Vector3; speed: number; offset: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { dataFlowSpeed } = useOrchestrator();

  useFrame((state) => {
    if (meshRef.current) {
      const adjustedSpeed = speed * dataFlowSpeed;
      const raw = ((state.clock.elapsedTime * adjustedSpeed + offset) % 2);
      const t = raw > 1 ? 2 - raw : raw;
      meshRef.current.position.lerpVectors(start, end, t);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.022, 8, 8]} />
      <meshBasicMaterial color={[1.8, 1.8, 2.5]} toneMapped={false} transparent opacity={0.85} />
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
  const { graph } = useOrchestrator();
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

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

      {/* Interconnections */}
      {graph.connections.map(conn => (
        <ConnectionLine key={conn.id} start={conn.start} end={conn.end} isCore={conn.isCore} />
      ))}

      {/* Realtime Data Flows */}
      {graph.flowPaths.map(fp => (
        <DataFlow key={fp.id} start={fp.start} end={fp.end} speed={fp.speed} offset={fp.offset} />
      ))}
    </group>
  );
}

export const Scene: React.FC = () => {
  const { showGrid, resetCamera } = useOrchestrator();

  return (
    <Canvas
      camera={{ position: [0, 2, 9], fov: 50 }}
      style={{ width: '100%', height: '100%', cursor: 'grab', background: '#080808' }}
      gl={{ antialias: true, alpha: false }}
      onPointerMissed={(e) => {
        if (e.type === 'click') resetCamera();
      }}
    >
      <color attach="background" args={['#080808']} />

      {/* Atmospheric Starfield */}
      <Stars radius={50} depth={40} count={1400} factor={3.5} saturation={0} fade speed={0.6} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 5]} intensity={1.3} color="#ffffff" />
      <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#80d8ff" />
      <directionalLight position={[0, -4, -6]} intensity={0.3} color="#ea80fc" />
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#00e5ff" distance={10} decay={2} />

      {/* Dynamic Repository Hierarchy */}
      <DynamicRepositoryGraph />

      {/* Sci-Fi Grid Plane */}
      {showGrid && (
        <Grid
          position={[0, -4.2, 0]}
          args={[60, 60]}
          infiniteGrid
          sectionSize={3}
          sectionColor="#00e5ff"
          sectionThickness={1.2}
          cellColor="#1c1c1c"
          cellThickness={0.7}
          fadeDistance={30}
          fadeStrength={1.4}
        />
      )}

      {/* Cinematic Post-Processing */}
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={0.55} radius={0.45} />
      </EffectComposer>

      {/* Camera Flight & Damped Orbit Controller */}
      <CameraFlightController />
    </Canvas>
  );
};
