import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { vertexShader, fragmentShader } from '../glsl/WaterShader';

const WaterQuad = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const targetMouseAlpha = useRef(0.0);
  const targetMouse = useRef(new THREE.Vector2(-1000, -1000));

  const uniforms = useMemo(() => {
    const parseColor = (hex: string) => new THREE.Color(hex);
    const ripples = new Array(16).fill(null).map(() => new THREE.Vector4(0, 0, 0, 0));

    return {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(-1000, -1000) },
      uMouseAlpha: { value: 0.0 },
      uRipples: { value: ripples },
      uColorA: { value: parseColor('#050506') },
      uColorB: { value: parseColor('#12141a') },
      uColorC: { value: parseColor('#050506') },
      uMotion: { value: 1.0 }
    };
  }, [size.width, size.height]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size]);

  const rippleIndex = useRef(0);
  const lastRipplePos = useRef(new THREE.Vector2());
  const lastRippleTime = useRef(0);

  const spawnRipple = useCallback(
    (x: number, y: number, strength: number) => {
      if (!materialRef.current) return;
      const aspectY = size.height;
      const px = (x - 0.5 * size.width) / aspectY;
      const py = (size.height - y - 0.5 * size.height) / aspectY;
      const time = materialRef.current.uniforms.uTime.value;
      const ripples = materialRef.current.uniforms.uRipples.value;
      ripples[rippleIndex.current].set(px, py, time, strength);
      rippleIndex.current = (rippleIndex.current + 1) % 16;
    },
    [size.height, size.width]
  );

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const time = performance.now();
      targetMouseAlpha.current = 1.0;

      const aspectY = size.height;
      const px = (e.clientX - 0.5 * size.width) / aspectY;
      const py = (size.height - e.clientY - 0.5 * size.height) / aspectY;
      targetMouse.current.set(px, py);

      if (time - lastRippleTime.current < 32) return;

      const dx = e.clientX - lastRipplePos.current.x;
      const dy = e.clientY - lastRipplePos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 5) return;

      spawnRipple(e.clientX, e.clientY, 0.65);
      lastRipplePos.current.set(e.clientX, e.clientY);
      lastRippleTime.current = time;
    };

    const handlePointerLeave = () => {
      targetMouseAlpha.current = 0.0;
    };

    const handlePointerDown = (e: PointerEvent) => {
      spawnRipple(e.clientX, e.clientY, 2.4);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [size, spawnRipple]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

      // Damped mouse interpolation for silky 144fps cursor ripples
      const uMouse = materialRef.current.uniforms.uMouse.value as THREE.Vector2;
      if (targetMouse.current.x > -500) {
        if (uMouse.x < -500) {
          uMouse.copy(targetMouse.current);
        } else {
          uMouse.lerp(targetMouse.current, 0.14);
        }
      }

      const currentAlpha = materialRef.current.uniforms.uMouseAlpha.value;
      materialRef.current.uniforms.uMouseAlpha.value = THREE.MathUtils.lerp(
        currentAlpha,
        targetMouseAlpha.current,
        0.1
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[size.width, size.height]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

export const WaterCanvas: React.FC = () => {
  const [motion, setMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setMotion(!e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundColor: '#050506',
        touchAction: 'pan-y',
        pointerEvents: 'none'
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ antialias: false, toneMapping: THREE.NoToneMapping }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        frameloop={motion ? 'always' : 'demand'}
      >
        <WaterQuad />
      </Canvas>
    </div>
  );
};
