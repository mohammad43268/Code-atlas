export const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
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
        mouseSwell = -exp(-pow(dMouse / 0.15, 2.0)) * 0.03 * uMouseAlpha; // enhanced mouse interaction
    }

    float ripplesHeight = 0.0;
    for(int i = 0; i < 16; i++) {
        vec4 r = uRipples[i];
        float startTime = r.z;
        float strength = r.w;
        
        if (startTime > 0.0 && strength > 0.0) {
            float age = uTime - startTime;
            if (age < 5.0 && age > 0.0) {
                float d = distance(p, r.xy);
                float speed = 0.45;
                float ringFront = age * speed;
                
                float freq = 60.0; // tighter rings
                float width = 0.04;
                float decay = 1.2;
                
                float wave = sin((d - ringFront) * freq);
                float envelope = exp(-pow((d - ringFront) / width, 2.0)) * exp(-age * decay);
                
                ripplesHeight += wave * envelope * strength * 0.02; // stronger ripples
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
    
    vec2 drift = (uMotion > 0.0) ? vec2(uTime * 0.001, uTime * -0.0015) : vec2(0.0);
    
    // ENHANCED GLSL EFFECT: Chromatic Aberration in refraction
    vec2 refractUvR = coverUv + normal.xy * (uRefract * 1.2) + drift;
    vec2 refractUvG = coverUv + normal.xy * uRefract + drift;
    vec2 refractUvB = coverUv + normal.xy * (uRefract * 0.8) + drift;
    
    float slope = length(normal.xy);
    
    vec3 baseColor = mix(uColorA, uColorB, smoothstep(0.0, 0.3, slope));
    
    if (uImageLoaded > 0.5 && uImageStrength > 0.0) {
        // Sample channels separately for chromatic aberration
        float r = texture2D(uImage, refractUvR).r;
        float g = texture2D(uImage, refractUvG).g;
        float b = texture2D(uImage, refractUvB).b;
        vec4 texColor = vec4(r, g, b, 1.0);
        
        float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
        vec3 mappedImg = mix(uColorC, uColorB, lum);
        float blendFactor = uImageStrength * uImageReveal;
        baseColor = mix(baseColor, mappedImg, blendFactor);
    }
    
    float trough = smoothstep(0.0, -0.04, h);
    baseColor = mix(baseColor, mix(baseColor, vec3(0.0), 0.2), trough);
    
    // Enhanced Specular lighting
    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float diffuse = max(dot(normal, lightDir), 0.0);
    float spec = pow(max(dot(normal, halfDir), 0.0), 128.0); // sharper highlights
    
    float caustics = smoothstep(0.6, 1.0, diffuse) * 0.08;
    vec3 color = baseColor * (0.85 + 0.15 * diffuse) + vec3(spec * 0.25) + vec3(caustics);
    
    float grain = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) * 0.02 - 0.01;
    color += grain;
    float vignette = length(vUv - 0.5);
    color = mix(color, color * 0.90, vignette * 1.2); // enhanced vignette
    
    gl_FragColor = vec4(color, 1.0);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`;
