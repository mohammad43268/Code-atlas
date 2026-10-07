import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import heroMapUrl from '../assets/hero-map.webp';

import { vertexShader, fragmentShader } from '../glsl/WaterShader';

const WaterQuad = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const targetMouseAlpha = useRef(0.0);
  
  const uniforms = useMemo(() => {
    const parseColor = (hex: string) => new THREE.Color(hex);
    const ripples = new Array(16).fill(null).map(() => new THREE.Vector4(0, 0, 0, 0));
    
    return {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(-1000, -1000) }, 
      uMouseAlpha: { value: 0.0 },
      uRipples: { value: ripples },
      uColorA: { value: parseColor('#FFFFFF') },
      uColorB: { value: parseColor('#FFFFFF') },
      uColorC: { value: parseColor('#000000') },
      uMotion: { value: 1.0 },
      uImage: { value: null },
      uImageAspect: { value: 1.0 },
      uImageLoaded: { value: 0.0 },
      uImageReveal: { value: 0.0 },
      uImageStrength: { value: 0.35 },
      uRefract: { value: 0.03 }
    };
  }, []);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      heroMapUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;

        if (materialRef.current) {
          materialRef.current.uniforms.uImage.value = texture;
          materialRef.current.uniforms.uImageAspect.value = texture.image.width / texture.image.height;
          materialRef.current.uniforms.uImageLoaded.value = 1.0;
        }
      },
      undefined,
      (err) => {
        console.warn('Failed to load water background image, defaulting to solid water.', err);
      }
    );
  }, []);

  const rippleIndex = useRef(0);
  const lastRipplePos = useRef(new THREE.Vector2());
  const lastRippleTime = useRef(0);
  const lastInteractionTime = useRef(performance.now() / 1000);

  const spawnRipple = (x: number, y: number, strength: number) => {
    if (!materialRef.current) return;
    const aspectY = size.height;
    const px = (x - 0.5 * size.width) / aspectY;
    const py = (size.height - y - 0.5 * size.height) / aspectY;
    const time = performance.now() / 1000;
    const ripples = materialRef.current.uniforms.uRipples.value;
    ripples[rippleIndex.current].set(px, py, time, strength);
    rippleIndex.current = (rippleIndex.current + 1) % 16;
    lastInteractionTime.current = time;
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!materialRef.current) return;
      const time = performance.now();
      targetMouseAlpha.current = 1.0; // Fade in immediately on move
      
      const aspectY = size.height;
      const px = (e.clientX - 0.5 * size.width) / aspectY;
      const py = (size.height - e.clientY - 0.5 * size.height) / aspectY; 
      materialRef.current.uniforms.uMouse.value.set(px, py);

      if (time - lastRippleTime.current < 30) return;
      
      const dx = e.clientX - lastRipplePos.current.x;
      const dy = e.clientY - lastRipplePos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 4) return;
      
      spawnRipple(e.clientX, e.clientY, 0.7); 
      lastRipplePos.current.set(e.clientX, e.clientY);
      lastRippleTime.current = time;
    };

    const handlePointerLeave = () => {
      targetMouseAlpha.current = 0.0; // Smoothly fade out the dent
    };

    const handlePointerDown = (e: PointerEvent) => {
      spawnRipple(e.clientX, e.clientY, 3.0);
    };

    // Attach to window for robust global tracking (won't get blocked by z-index overlays)
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
  }, [size]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      const time = state.clock.getElapsedTime();
      materialRef.current.uniforms.uTime.value = time;
      
      // Smoothly interpolate the mouse alpha to avoid instant popping
      const currentAlpha = materialRef.current.uniforms.uMouseAlpha.value;
      materialRef.current.uniforms.uMouseAlpha.value = THREE.MathUtils.lerp(currentAlpha, targetMouseAlpha.current, 0.1);

      if (materialRef.current.uniforms.uImageLoaded.value > 0.0 && materialRef.current.uniforms.uImageReveal.value < 1.0) {
        materialRef.current.uniforms.uImageReveal.value = Math.min(
          1.0,
          materialRef.current.uniforms.uImageReveal.value + delta / 1.2
        );
      }
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
  const [motion, setMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotion(!mediaQuery.matches);
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
        touchAction: 'pan-y',
        pointerEvents: 'none'
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ antialias: false, toneMapping: THREE.NoToneMapping }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        frameloop={motion ? "always" : "demand"}
      >
        <WaterQuad />
      </Canvas>
    </div>
  );
};
