import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import heroMapUrl from '../assets/hero-map.webp';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec4 uRipples[16];
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uMotion;
uniform vec2 uMouse;
uniform float uMouseAlpha;

// Phase 1 Image Uniforms
uniform sampler2D uImage;
uniform float uImageAspect;
uniform float uImageLoaded;
uniform float uImageReveal;
uniform float uImageStrength;
uniform float uRefract;

varying vec2 vUv;

// Hash and noise functions for the ambient swell
vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p ) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor( p + (p.x+p.y)*K1 );
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(70.0) );
}

float getHeight(vec2 p) {
    float swell = (sin(p.x * 8.0 + uTime * 0.5) * cos(p.y * 8.0 + uTime * 0.6) + sin(p.x * 15.0 - uTime * 0.8)) * 0.003 * uMotion;
    
    float mouseSwell = 0.0;
    if (uMouse.x > -999.0 && uMouse.y > -999.0) {
        float dMouse = distance(p, uMouse);
        mouseSwell = -exp(-pow(dMouse / 0.1, 2.0)) * 0.02 * uMouseAlpha; 
    }

    float ripplesHeight = 0.0;
    for(int i = 0; i < 16; i++) {
        vec4 r = uRipples[i];
        float startTime = r.z;
        float strength = r.w;
        
        if (startTime > 0.0 && strength > 0.0) {
            float age = uTime - startTime;
            if (age < 4.0 && age > 0.0) {
                float d = distance(p, r.xy);
                float speed = 0.45;
                float ringFront = age * speed;
                
                float freq = 50.0;
                float width = 0.05;
                float decay = 1.5;
                
                float wave = sin((d - ringFront) * freq);
                float envelope = exp(-pow((d - ringFront) / width, 2.0)) * exp(-age * decay);
                
                ripplesHeight += wave * envelope * strength * 0.015;
            }
        }
    }
    
    return swell + ripplesHeight + mouseSwell;
}

void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
    
    float e = 0.002;
    float h = getHeight(p);
    float hx = getHeight(p + vec2(e, 0.0));
    float hy = getHeight(p + vec2(0.0, e));
    vec3 normal = normalize(vec3(hx - h, hy - h, e));
    
    float screenAspect = uResolution.x / uResolution.y;
    vec2 coverUv = vUv - 0.5;
    if (screenAspect > uImageAspect) {
        coverUv.y *= uImageAspect / screenAspect;
    } else {
        coverUv.x *= screenAspect / uImageAspect;
    }
    coverUv += 0.5;
    
    vec2 drift = (uMotion > 0.0) ? vec2(uTime * 0.002, uTime * -0.003) : vec2(0.0);
    vec2 refractUv = coverUv + normal.xy * uRefract + drift;
    
    float slope = length(normal.xy);
    
    // Base color mapping: ±8% luminance of --bg (#EDEDED)
    // uColorA is lighter (e.g. #FFFFFF), uColorB is darker surface (#D4D4D4)
    vec3 baseColor = mix(uColorA, uColorB, smoothstep(0.0, 0.3, slope));
    
    if (uImageLoaded > 0.5 && uImageStrength > 0.0) {
        vec4 texColor = texture2D(uImage, refractUv);
        float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
        vec3 mappedImg = mix(uColorC, uColorB, lum);
        float blendFactor = uImageStrength * uImageReveal;
        baseColor = mix(baseColor, mappedImg, blendFactor);
    }
    
    // Trough darkening bounded to ~10% max
    float trough = smoothstep(0.0, -0.04, h);
    baseColor = mix(baseColor, mix(baseColor, vec3(0.0), 0.15), trough);
    
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float diffuse = max(dot(normal, lightDir), 0.0);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
    
    // Soft specular highlight for thin rings
    float caustics = smoothstep(0.7, 1.0, diffuse) * 0.05;
    vec3 color = baseColor * (0.85 + 0.15 * diffuse) + vec3(spec * 0.15) + vec3(caustics);
    
    float grain = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) * 0.02 - 0.01;
    color += grain;
    float vignette = length(vUv - 0.5);
    color = mix(color, color * 0.95, vignette);
    
    gl_FragColor = vec4(color, 1.0);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`;

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
