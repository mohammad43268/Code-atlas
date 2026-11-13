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

varying vec2 vUv;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}

float getHeight(vec2 p) {
    // Organic liquid-metal topographical swell
    float n1 = noise(p * 2.2 + vec2(uTime * 0.08, -uTime * 0.06)) * 0.008;
    float swell = (sin(p.x * 6.0 + uTime * 0.45) * cos(p.y * 6.0 + uTime * 0.5) + sin(p.x * 11.0 - uTime * 0.65)) * 0.0028 * uMotion;

    float mouseSwell = 0.0;
    if (uMouse.x > -999.0 && uMouse.y > -999.0) {
        float dMouse = distance(p, uMouse);
        mouseSwell = -exp(-pow(dMouse / 0.18, 2.0)) * 0.032 * uMouseAlpha;
    }

    float ripplesHeight = 0.0;
    for (int i = 0; i < 16; i++) {
        vec4 r = uRipples[i];
        float startTime = r.z;
        float strength = r.w;

        if (startTime > 0.0 && strength > 0.0) {
            float age = uTime - startTime;
            if (age < 4.5 && age > 0.0) {
                float d = distance(p, r.xy);
                float speed = 0.42;
                float ringFront = age * speed;

                float freq = 52.0;
                float width = 0.045;
                float decay = 1.25;

                float wave = sin((d - ringFront) * freq);
                float envelope = exp(-pow((d - ringFront) / width, 2.0)) * exp(-age * decay);

                ripplesHeight += wave * envelope * strength * 0.018;
            }
        }
    }

    return swell + n1 * uMotion + ripplesHeight + mouseSwell;
}

void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;

    float e = 0.0025;
    float h = getHeight(p);
    float hx = getHeight(p + vec2(e, 0.0));
    float hy = getHeight(p + vec2(0.0, e));
    vec3 normal = normalize(vec3(hx - h, hy - h, e));

    float slope = length(normal.xy);

    // Deep obsidian base transitioning into metallic charcoal on ridge slopes
    vec3 baseColor = mix(uColorA, uColorB, smoothstep(0.0, 0.35, slope));

    // Subtle topographical elevation contour lines
    float contour = abs(fract(h * 110.0) - 0.5);
    float contourLine = 1.0 - smoothstep(0.0, 0.055, contour);
    baseColor += vec3(0.22, 0.74, 0.97) * contourLine * 0.035; // Ultra-subtle Spectral Ice contour trace

    // Liquid-metal specular lighting (Silver + Spectral Ice rim)
    vec3 lightDir = normalize(vec3(0.45, 0.85, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float diffuse = max(dot(normal, lightDir), 0.0);
    float spec = pow(max(dot(normal, halfDir), 0.0), 140.0);

    // Subtle secondary Muted Indigo rim reflection on negative slopes
    float indigoRim = smoothstep(0.15, 0.55, max(0.0, -normal.x + normal.y)) * 0.045;
    vec3 specColor = mix(vec3(0.95, 0.97, 1.0), vec3(0.22, 0.74, 0.97), 0.25);

    vec3 color = baseColor * (0.88 + 0.12 * diffuse)
               + specColor * (spec * 0.28)
               + vec3(0.506, 0.549, 0.973) * indigoRim;

    // Subtle vignette into #050506 obsidian edge
    float vignette = length(vUv - 0.5);
    color = mix(color, uColorC, smoothstep(0.25, 0.85, vignette));

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`;
