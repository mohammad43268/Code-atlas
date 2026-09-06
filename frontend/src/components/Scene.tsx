import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

const ROOT_COUNT = 5;
const CHILDREN_PER_ROOT = 8;
const RADIUS_ROOT = 3;
const RADIUS_CHILD = 1.6;
const FLOW_PARTICLE_COUNT = 18; 

const FOLDER_LABELS = ['src/', 'components/', 'utils/', 'hooks/', 'api/'];

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateNetwork() {
  const roots: THREE.Vector3[] = [];
  const children: { pos: THREE.Vector3 }[] = [];
  const coreConns: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
  const fileConns: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
  const flowPaths: { start: THREE.Vector3; end: THREE.Vector3; speed: number; offset: number }[] = [];

  for (let i = 0; i < ROOT_COUNT; i++) {
    const angle = (i / ROOT_COUNT) * Math.PI * 2;
    const r = RADIUS_ROOT + Math.sin(i * 1.7) * 0.3;
    roots.push(new THREE.Vector3(
      Math.cos(angle) * r,
      Math.sin(i * 2.3) * 0.6,
      Math.sin(angle) * r
    ));
  }

  for (let i = 0; i < ROOT_COUNT; i++) {
    coreConns.push({ start: roots[i], end: roots[(i + 1) % ROOT_COUNT] });
    flowPaths.push({ start: roots[i], end: roots[(i + 1) % ROOT_COUNT], speed: 0.15 + seededRandom(i) * 0.1, offset: i * 0.7 });
  }
  coreConns.push({ start: roots[0], end: roots[2] });
  coreConns.push({ start: roots[1], end: roots[3] });
  flowPaths.push({ start: roots[0], end: roots[2], speed: 0.12, offset: 0 });
  flowPaths.push({ start: roots[1], end: roots[3], speed: 0.18, offset: 1.5 });

  for (let i = 0; i < ROOT_COUNT; i++) {
    for (let j = 0; j < CHILDREN_PER_ROOT; j++) {
      const phi = Math.acos(-1 + (2 * (j + 0.5)) / CHILDREN_PER_ROOT);
      const theta = Math.sqrt(CHILDREN_PER_ROOT * Math.PI) * phi;
      const r = RADIUS_CHILD * (0.4 + seededRandom(i * 100 + j) * 0.6);

      const childPos = roots[i].clone().add(new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi) * r,
        Math.sin(theta) * Math.sin(phi) * r,
        Math.cos(phi) * r
      ));

      children.push({ pos: childPos });
      fileConns.push({ start: roots[i], end: childPos });

      if (j % 3 === 0) {
        flowPaths.push({ start: roots[i], end: childPos, speed: 0.2 + seededRandom(i * 50 + j) * 0.15, offset: j * 0.4 });
      }
    }
  }

  return { roots, children, coreConns, fileConns, flowPaths };
}

function FolderModel({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF('/folder-fav.fbx.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={clone} position={position} scale={0.35} />;
}

function FolderNode({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
      <group>
        <Suspense fallback={
          <mesh position={position}>
            <boxGeometry args={[0.5, 0.35, 0.05]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
          </mesh>
        }>
          <FolderModel position={position} />
        </Suspense>
        <Text
          position={[position[0], position[1] - 0.55, position[2]]}
          fontSize={0.15}
          color="#999999"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.005}
          outlineColor="black"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function FileNode({ position }: { position: [number, number, number] }) {
  const geometry = useMemo(() => {
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

  return (
    <group position={position}>
      <mesh geometry={geometry}>
        <meshStandardMaterial 
          color="#e0e0e0" 
          emissive="#ffffff" 
          emissiveIntensity={0.15} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      <mesh position={[0, 0.01, 0.001]}>
        <planeGeometry args={[0.06, 0.005]} />
        <meshBasicMaterial color="#999999" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.015, 0.001]}>
        <planeGeometry args={[0.06, 0.005]} />
        <meshBasicMaterial color="#999999" side={THREE.DoubleSide} />
      </mesh>
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
        color={isCore ? '#ffffff' : '#555555'}
        transparent
        opacity={isCore ? 0.3 : 0.12}
      />
    </lineSegments>
  );
}

function DataFlow({ start, end, speed, offset }: { start: THREE.Vector3; end: THREE.Vector3; speed: number; offset: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      const raw = ((state.clock.elapsedTime * speed + offset) % 2);
      const t = raw > 1 ? 2 - raw : raw; 
      meshRef.current.position.lerpVectors(start, end, t);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.018, 8, 8]} />
      <meshBasicMaterial color={[1.5, 1.5, 2]} toneMapped={false} transparent opacity={0.8} />
    </mesh>
  );
}

function FileNetwork() {
  const groupRef = useRef<THREE.Group>(null!);
  const data = useMemo(() => generateNetwork(), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {data.roots.map((pos, i) => (
        <FolderNode key={`f-${i}`} position={[pos.x, pos.y, pos.z]} label={FOLDER_LABELS[i]} />
      ))}

      {data.children.map((c, i) => (
        <FileNode key={`c-${i}`} position={[c.pos.x, c.pos.y, c.pos.z]} />
      ))}

      {data.coreConns.map((conn, i) => (
        <ConnectionLine key={`cc-${i}`} start={conn.start} end={conn.end} isCore={true} />
      ))}

      {data.fileConns.map((conn, i) => (
        <ConnectionLine key={`fc-${i}`} start={conn.start} end={conn.end} isCore={false} />
      ))}

      {data.flowPaths.map((fp, i) => (
        <DataFlow key={`df-${i}`} start={fp.start} end={fp.end} speed={fp.speed} offset={fp.offset} />
      ))}
    </group>
  );
}

export const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 2, 9], fov: 50 }}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#080808']} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 6, 4]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#c0c8e0" />
      <directionalLight position={[0, -3, -5]} intensity={0.3} color="#e0e0ff" />
      <pointLight position={[0, 0, 0]} intensity={0.6} color="#ffffff" distance={8} decay={2} />

      <FileNetwork />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={0.6} radius={0.5} />
      </EffectComposer>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={18}
        autoRotate
        autoRotateSpeed={0.2}
        dampingFactor={0.05}
        enableDamping
      />
    </Canvas>
  );
};
