import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { riverAudio } from './RiverAudio';
import { riverWorld, CANONICAL_RIVER_STOPS } from './RiverWorld';
import { BoatNavigationSystem } from './BoatNavigationSystem';
import { collisionSystem, CollisionTelemetry } from './CollisionSystem';
import { WakeTrailSystem } from './WakeTrailSystem';
import { CinematicCameraSystem } from './CinematicCameraSystem';
import { environmentDetailSystem } from './EnvironmentDetailSystem';
import { realisticAssetManager, ASSET_MANIFEST } from './RealisticAssetManager';

export type CameraViewMode = 'rider' | 'follow' | 'bow' | 'aerial';

interface RiverCanvasProps {
  progress: number; // 0.0 to 1.0 along the river
  onReachStop?: (chapterNumber: number) => void;
  onSelectLantern?: (caseStudyId: string) => void;
  isHeroMode?: boolean; // Hero mode on Home page
  qualityTier?: 'high' | 'medium' | 'lite';
  cameraMode?: CameraViewMode;
  isAutoCruise?: boolean;
  isPaused?: boolean;
  onProgressUpdate?: (
    newProgress: number,
    isArrived?: boolean,
    velocity?: number,
    distanceToTarget?: number,
    navigationPhase?: 'idle' | 'navigating' | 'arriving' | 'stopped',
    actualTravelTime?: number
  ) => void;
}

/**
 * Procedural premium weathered dark timber texture for traditional wooden rowboat
 * Simulates deep hand-adzed teak/walnut grain with rich tonal variation and plank seams
 */
function createProceduralWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base warm dark timber tone
  ctx.fillStyle = '#2c1c12';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle tonal planks underlay
  const plankH = 128;
  for (let p = 0; p < 8; p++) {
    const y0 = p * plankH;
    const toneMod = (p % 2 === 0 ? 12 : -8) + (p % 3 === 0 ? 6 : -4);
    const r = Math.max(30, Math.min(55, 44 + toneMod));
    const g = Math.max(18, Math.min(36, 28 + Math.floor(toneMod * 0.6)));
    const b = Math.max(10, Math.min(26, 18 + Math.floor(toneMod * 0.4)));
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, y0, 1024, plankH);
  }

  // Micro-wood grain fibers along plank direction (X-axis)
  for (let i = 0; i < 1800; i++) {
    const y = Math.random() * 1024;
    const h = Math.random() * 2.5 + 0.8;
    const alpha = Math.random() * 0.18 + 0.03;
    const isLight = Math.random() > 0.45;
    ctx.fillStyle = isLight
      ? `rgba(92, 60, 38, ${alpha})`
      : `rgba(20, 12, 8, ${alpha * 1.3})`;
    ctx.fillRect(0, y, 1024, h);
  }

  // Organic grain undulations and growth knots
  for (let k = 0; k < 6; k++) {
    const kx = (k * 180 + 90) % 1024;
    const ky = ((k * 165 + 40) % 7) * 128 + 64;
    const rad = 28 + (k % 3) * 12;

    for (let r = rad; r > 3; r -= 4) {
      ctx.strokeStyle = `rgba(18, 10, 6, ${0.15 + (rad - r) / rad * 0.25})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(kx, ky, r * 1.8, r * 0.7, 0.12, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Hand-adzed horizontal plank joint grooves with dark bevel shadowing
  for (let y = plankH; y < 1024; y += plankH) {
    // Upper bevel highlight
    ctx.strokeStyle = 'rgba(96, 65, 42, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y - 2);
    ctx.lineTo(1024, y - 2);
    ctx.stroke();

    // Dark seam groove
    ctx.strokeStyle = 'rgba(12, 6, 4, 0.9)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();

    // Lower drop shadow
    ctx.strokeStyle = 'rgba(16, 9, 5, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y + 2);
    ctx.lineTo(1024, y + 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedural wood bump map for tactile grain relief & PBR specular response
 */
function createProceduralWoodBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  // Grain relief lines
  for (let i = 0; i < 600; i++) {
    const y = Math.random() * 512;
    const h = Math.random() * 2 + 1;
    const val = Math.random() > 0.5 ? 160 : 96;
    ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
    ctx.fillRect(0, y, 512, h);
  }

  // Seam indents (dark grooves in bump map)
  ctx.fillStyle = '#101010';
  for (let y = 64; y < 512; y += 64) {
    ctx.fillRect(0, y - 1, 512, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

/**
 * Procedural woven bamboo canopy texture with natural golden slats
 */
function createProceduralBambooTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#7a5e38';
  ctx.fillRect(0, 0, 512, 512);

  // Slats
  for (let x = 0; x < 512; x += 16) {
    const tone = x % 32 === 0 ? '#9a7b4f' : '#b29162';
    ctx.fillStyle = tone;
    ctx.fillRect(x + 1, 0, 14, 512);

    ctx.strokeStyle = '#4e381e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, 0, 16, 512);
  }

  // Horizontal woven bamboo ties
  ctx.strokeStyle = '#322212';
  ctx.lineWidth = 3;
  for (let y = 0; y < 512; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const RiverCanvas: React.FC<RiverCanvasProps> = ({
  progress,
  onReachStop,
  isHeroMode = false,
  qualityTier = 'high',
  cameraMode = 'rider',
  isAutoCruise = false,
  isPaused = false,
  onProgressUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const isHeroRef = useRef(isHeroMode);
  const cameraModeRef = useRef(cameraMode);
  const isAutoCruiseRef = useRef(isAutoCruise);
  const isPausedRef = useRef(isPaused);
  const animationLoopRef = useRef<{ start?: () => void; stop?: () => void }>({});

  const [activeStopNotice, setActiveStopNotice] = useState<{
    number: number;
    title: string;
    kicker: string;
  } | null>(null);

  // Debug HUD state (?journeydebug=1)
  const [debugData, setDebugData] = useState<{
    u: number;
    posX: number;
    posY: number;
    posZ: number;
    tangentX: number;
    tangentZ: number;
    width: number;
    depth: number;
    velocity: number;
    lateralOffset: number;
    maxLateralOffset: number;
    leftBankDist: number;
    rightBankDist: number;
    activeStop: string;
    bankingAngleDeg: number;
    pitchAngleDeg: number;
    acceleration: number;
    telemetry: CollisionTelemetry;
  } | null>(null);

  const isDebugEnabled =
    typeof window !== 'undefined' &&
    window.location.search.includes('journeydebug=1');

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    isHeroRef.current = isHeroMode;
  }, [isHeroMode]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    isAutoCruiseRef.current = isAutoCruise;
  }, [isAutoCruise]);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (isPaused) animationLoopRef.current.stop?.();
    else animationLoopRef.current.start?.();
  }, [isPaused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE SETUP - COHERENT WORLD SPACE (1 unit = 1 meter)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd7e6e5); // Soft misty mountain morning sky
    scene.fog = new THREE.FogExp2(0xd6e5e3, 0.0038); // Tuned atmospheric aerial perspective

    const camera = new THREE.PerspectiveCamera(
      58,
      container.clientWidth / container.clientHeight,
      0.1,
      1200
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: qualityTier === 'high',
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, qualityTier === 'high' ? 1.75 : 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. NATURAL ATMOSPHERIC ENVIRONMENT ILLUMINATION (IBL)
    // Synthesizes natural morning river sky reflection & ambient irradiance for PBR materials
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext('2d')!;

    // Zenith to nadir gradient: soft morning cyan -> luminous horizon mist -> riverside terrain bounce
    const skyGradient = envCtx.createLinearGradient(0, 0, 0, 256);
    skyGradient.addColorStop(0.0, '#bcdcdc'); // Upper sky dome
    skyGradient.addColorStop(0.40, '#dceae9'); // Morning atmosphere
    skyGradient.addColorStop(0.50, '#f2ebe0'); // Luminous horizon mist
    skyGradient.addColorStop(0.53, '#909e8b'); // Riverside flora & shoreline
    skyGradient.addColorStop(0.72, '#354032'); // Earthy riverbank loam
    skyGradient.addColorStop(1.0, '#1c2820'); // Water reflection
    envCtx.fillStyle = skyGradient;
    envCtx.fillRect(0, 0, 512, 256);

    // Soft warm morning sun azimuth glow
    const sunGlow = envCtx.createRadialGradient(340, 105, 4, 340, 105, 80);
    sunGlow.addColorStop(0.0, 'rgba(255, 246, 220, 0.95)');
    sunGlow.addColorStop(0.35, 'rgba(255, 232, 190, 0.35)');
    sunGlow.addColorStop(1.0, 'rgba(255, 230, 185, 0.0)');
    envCtx.fillStyle = sunGlow;
    envCtx.fillRect(0, 0, 512, 256);

    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.colorSpace = THREE.SRGBColorSpace;
    envTex.mapping = THREE.EquirectangularReflectionMapping;

    const envMap = pmremGenerator.fromEquirectangular(envTex).texture;
    scene.environment = envMap;
    pmremGenerator.dispose();

    // 3. BALANCED SUN & SKY HEMISPHERIC LIGHTING
    // Supporting ambient fill light (sky cyan vs earth loam) - tuned to prevent flat washed-out appearance
    const hemiLight = new THREE.HemisphereLight(0xd4eaec, 0x3d4838, 0.65);
    scene.add(hemiLight);

    // Key morning sunlight casting physical contact & form shadows
    const sunLight = new THREE.DirectionalLight(0xfff2dc, 2.1);
    sunLight.position.set(65, 80, -95);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1.0;
    sunLight.shadow.camera.far = 280;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.025;
    scene.add(sunLight);
    scene.add(sunLight.target);

    // 3. PHYSICAL RIVER WATER SURFACE RIBBON WITH LAYERED PBR OPTICS & TRAJECTORY WAKE
    const wakeTrail = new WakeTrailSystem();
    const waterGeo = riverWorld.createRiverWaterGeometry();
    const waterMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDeepWaterColor: { value: new THREE.Color(0x0d2824) },       // Deep central channel jade
        uShallowWaterColor: { value: new THREE.Color(0x27645b) },    // Translucent emerald shallows
        uRiverbedColor: { value: new THREE.Color(0x3e392e) },        // Warm sandy riverbed visible in shallows
        uSkyReflectionColor: { value: new THREE.Color(0xd7eaeb) },   // Luminous morning sky
        uTerrainReflectionColor: { value: new THREE.Color(0x2c3b29) },// Earthy riverside reflection
        uSunColor: { value: new THREE.Color(0xfffaee) },             // Sunlight glint
        uSunDir: { value: new THREE.Vector3(65, 80, -95).normalize() },
        uBoatPos: { value: new THREE.Vector3(0, 0, 0) },
        uBoatForward: { value: new THREE.Vector3(0, 0, 1) },
        uBoatNormal: { value: new THREE.Vector3(1, 0, 0) },
        uBoatSpeed: { value: 0.0 },
        uWakePoints: { value: wakeTrail.uniformPoints },
        uWakeDirs: { value: wakeTrail.uniformDirs },
        uWakeCount: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        attribute float waterDepth;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vWaterDepth;

        uniform vec4 uWakePoints[16];
        uniform vec4 uWakeDirs[16];
        uniform int uWakeCount;

        void main() {
          vUv = uv;
          vWaterDepth = waterDepth;
          vec3 pos = position;

          // Calm river current fluid waves (Gerstner-style displacement)
          float w1 = sin(pos.z * 0.08 + uTime * 1.4) * 0.12;
          float w2 = cos(pos.x * 0.11 + uTime * 1.7 + pos.z * 0.03) * 0.08;
          float micro = sin(pos.z * 0.35 + pos.x * 0.15 + uTime * 3.2) * 0.02;
          
          // Natural depth attenuation: waves are gentler near shallow banks
          float depthWaveFactor = clamp(waterDepth * 1.2, 0.15, 1.0);
          float waveHeight = (w1 + w2 + micro) * depthWaveFactor;

          // Trajectory wake surface displacement from historical trail
          float wakeDisp = 0.0;
          for (int i = 0; i < 16; i++) {
            if (i >= uWakeCount) break;
            vec4 wp = uWakePoints[i];
            vec4 wd = uWakeDirs[i];
            float speed = wp.w;
            float age = wd.w;
            if (speed <= 0.02 || age >= 1.0) continue;

            vec2 toVert = pos.xz - wp.xz;
            vec2 fwd = wd.xz;
            vec2 right = vec2(-fwd.y, fwd.x);

            float dParallel = dot(toVert, fwd);
            float dPerp = abs(dot(toVert, right));

            // Soft, gentle disturbed-water trail behind wooden rowboat
            if (dParallel <= 0.8 && dParallel >= -6.5) {
              float spread = 0.75 + age * 1.8 + max(0.0, -dParallel) * 0.28;
              float distToCrest = abs(dPerp - spread);
              if (distToCrest < 1.0) {
                float phase = dPerp * 3.2 - dParallel * 1.4 - uTime * 2.8;
                float crestWave = sin(phase) * exp(-distToCrest * 2.5);
                float decay = (1.0 - age) * exp(dParallel * 0.25) * clamp(speed / 2.0, 0.0, 1.0);
                wakeDisp += crestWave * decay * 0.020;
              }
            }
          }

          pos.y += waveHeight + wakeDisp;

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;

          // Analytical fluid normal
          float nx = -0.11 * sin(pos.x * 0.11 + uTime * 1.7) * depthWaveFactor;
          float nz = -0.08 * cos(pos.z * 0.08 + uTime * 1.4) * depthWaveFactor;
          vNormal = normalize(normalMatrix * vec3(nx * 0.7, 1.0, nz * 0.7));

          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uDeepWaterColor;
        uniform vec3 uShallowWaterColor;
        uniform vec3 uRiverbedColor;
        uniform vec3 uSkyReflectionColor;
        uniform vec3 uTerrainReflectionColor;
        uniform vec3 uSunColor;
        uniform vec3 uSunDir;

        uniform vec3 uBoatPos;
        uniform vec3 uBoatForward;
        uniform vec3 uBoatNormal;
        uniform float uBoatSpeed;

        uniform vec4 uWakePoints[16];
        uniform vec4 uWakeDirs[16];
        uniform int uWakeCount;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vWaterDepth;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // 1. DYNAMIC NORMAL PERTURBATION (Dual-octave micro-ripples)
          vec2 p = vWorldPosition.xz;
          float rip1 = sin(p.x * 2.2 + p.y * 1.4 + uTime * 2.4) * 0.035;
          float rip2 = cos(p.x * 1.1 - p.y * 2.1 - uTime * 1.8) * 0.025;
          float ripCapillary = sin(p.x * 5.5 + p.y * 4.2 + uTime * 4.0) * 0.012;

          vec3 normal = normalize(vNormal + vec3(rip1 + ripCapillary, 0.0, rip2 + ripCapillary));

          // 2. SOFT HISTORICAL TRAJECTORY WAKE (Gentle surface sheen, zero harsh motor foam)
          float wakePerturbation = 0.0;
          float wakeFoam = 0.0; // Completely eliminated white froth and spray

          for (int i = 0; i < 16; i++) {
            if (i >= uWakeCount) break;
            vec4 wp = uWakePoints[i];
            vec4 wd = uWakeDirs[i];
            float speed = wp.w;
            float age = wd.w;
            if (speed <= 0.02 || age >= 1.0) continue;

            vec2 toFrag = p - wp.xz;
            vec2 fwd = wd.xz;
            vec2 right = vec2(-fwd.y, fwd.x);

            float dParallel = dot(toFrag, fwd);
            float dPerp = abs(dot(toFrag, right));

            // Soft disturbed trail spreading gently from stern
            if (dParallel <= 0.8 && dParallel >= -6.5) {
              float spread = 0.75 + age * 1.8 + max(0.0, -dParallel) * 0.28;
              float distToCrest = abs(dPerp - spread);

              if (distToCrest < 1.1) {
                float phase = dPerp * 3.2 - dParallel * 1.4 - uTime * 2.8;
                float crest = sin(phase) * exp(-distToCrest * 2.5);
                float decay = (1.0 - age) * exp(dParallel * 0.25) * clamp(speed / 2.0, 0.0, 1.0);
                
                wakePerturbation += crest * decay * 0.20;
              }
            }
          }

          // Subtle sheen perturbation on surface normal
          normal = normalize(normal + vec3(wakePerturbation * 0.04, 0.0, wakePerturbation * 0.04));

          // 3. IMMEDIATE HULL CONTACT & MENISCUS (No gaps between boat and water)
          vec2 relBoat = p - uBoatPos.xz;
          float boatDx = dot(relBoat, uBoatNormal.xz);
          float boatDz = dot(relBoat, uBoatForward.xz);
          float hullDist = sqrt(pow(boatDx / 1.75, 2.0) + pow(boatDz / 4.2, 2.0));

          // Meniscus wetting line right at the hull boundary
          float hullContact = smoothstep(1.18, 1.0, hullDist) * smoothstep(0.85, 1.0, hullDist);
          float contactHighlight = hullContact * 0.35;

          // Bow displacement push wave
          if (boatDz > 1.4 && hullDist < 2.4 && uBoatSpeed > 0.3) {
            float bowWave = sin(hullDist * 6.0 - uTime * 3.0) * smoothstep(2.4, 1.1, hullDist);
            wakePerturbation += bowWave * clamp(uBoatSpeed / 2.5, 0.0, 1.0) * 0.2;
          }

          // 4. DEPTH-BASED BEER-LAMBERT COLOR & LAYERED ABSORPTION
          // Optical transmittance exponentially decreases with water depth
          float depthTransmittance = exp(-vWaterDepth * 0.85);

          // In shallow water, underlying warm riverbed peeks through
          vec3 shallowBlend = mix(uRiverbedColor, uShallowWaterColor, smoothstep(0.02, 0.35, vWaterDepth));
          vec3 waterBody = mix(uDeepWaterColor, shallowBlend, depthTransmittance);

          // 5. FRESNEL & DIRECTIONAL REFLECTION
          float nDotV = max(dot(viewDir, normal), 0.0);
          float fresnel = 0.02 + 0.98 * pow(1.0 - nDotV, 4.0);

          vec3 reflDir = reflect(-viewDir, normal);
          // Sky color gradient based on reflection pitch
          float skyPitch = clamp(reflDir.y, 0.0, 1.0);
          vec3 skyColor = mix(uSkyReflectionColor * 0.88, uSkyReflectionColor, skyPitch);

          // Terrain reflection: banks reflect warm earthy foliage near edges
          float bankProximity = 1.0 - smoothstep(0.04, 0.32, vWaterDepth);
          vec3 envReflection = mix(skyColor, uTerrainReflectionColor, bankProximity * 0.55);

          // Combine water body with environmental reflection
          vec3 finalColor = mix(waterBody, envReflection, fresnel * 0.85);

          // 6. SUBTLE SPECULAR RESPONSE (Sunlight Glint)
          vec3 halfVec = normalize(viewDir + uSunDir);
          float nDotH = max(dot(normal, halfVec), 0.0);
          // Microfacet specular highlight
          float spec = pow(nDotH, 88.0) * 0.65;
          vec3 specHighlight = uSunColor * spec;
          finalColor += specHighlight;

          // 7. SUBTLE FOAM & WATERLINE WETTING (Soft natural froth, no cartoon glow)
          vec3 foamColor = vec3(0.92, 0.95, 0.93);
          float totalFoam = clamp(wakeFoam + contactHighlight, 0.0, 0.38);

          // Shoreline transition lapping foam
          if (vWaterDepth < 0.07) {
            float shoreLap = sin(vUv.x * 32.0 + uTime * 2.0) * 0.5 + 0.5;
            float shoreAlpha = (1.0 - vWaterDepth / 0.07) * 0.24 * shoreLap;
            totalFoam = max(totalFoam, shoreAlpha);
          }

          finalColor = mix(finalColor, foamColor, totalFoam);

          gl_FragColor = vec4(finalColor, 0.96);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    scene.add(waterMesh);

    // 4. PHYSICAL TERRAIN ENCLOSURE WITH VERTICAL SOIL LAYERING & WET/DRY TRANSITIONS
    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.04,
      flatShading: false, // Smooth shading for natural continuous topography
    });

    const leftTerrainGeo = riverWorld.createTerrainCorridorGeometry('left');
    const leftTerrain = new THREE.Mesh(leftTerrainGeo, terrainMat);
    leftTerrain.receiveShadow = true;
    scene.add(leftTerrain);

    const rightTerrainGeo = riverWorld.createTerrainCorridorGeometry('right');
    const rightTerrain = new THREE.Mesh(rightTerrainGeo, terrainMat);
    rightTerrain.receiveShadow = true;
    scene.add(rightTerrain);

    // Distant panoramic mountain backdrop enclosing horizon (zero empty/white voids)
    scene.add(riverWorld.createDistantMountainBackdrop());

    // 5. PHOTOREALISTIC HANDCRAFTED WOODEN RIVER BOAT (Hero Object: 1.85 scale, length ~11.8m, beam ~4.4m)
    const boatGroup = new THREE.Group();
    boatGroup.scale.set(1.85, 1.85, 1.85); // Hero boat scale: fills 25-35% of viewport height in lower-middle third
    const woodTexture = createProceduralWoodTexture();
    const woodBumpMap = createProceduralWoodBumpTexture();
    const bambooTexture = createProceduralBambooTexture();

    // Premium dark timber material (deep aged teak/walnut with tactile grain relief)
    const premiumTimberMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      bumpMap: woodBumpMap,
      bumpScale: 0.035,
      roughness: 0.76,
      metalness: 0.04,
    });

    // Dark trim wood for gunwales, stem piece, transom, and ribs
    const darkTrimWoodMat = new THREE.MeshStandardMaterial({
      color: 0x1f130b,
      bumpMap: woodBumpMap,
      bumpScale: 0.02,
      roughness: 0.68,
      metalness: 0.06,
    });

    // Interior deck planking (slightly lighter weathered timber)
    const interiorFloorMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      bumpMap: woodBumpMap,
      bumpScale: 0.03,
      color: 0xa48566,
      roughness: 0.85,
    });

    // A. Realistic Sculpted Sampan Hull & Superstructure (Hero Slot Architecture)
    // Preserves asset-slot loader architecture so the boat can be dynamically replaced by external GLB models
    const boatSlot = realisticAssetManager.loadBoatModelSlot(
      null, // Extensible GLTF model URL slot
      (loadedModel) => {
        boatGroup.add(loadedModel);
      },
      () => realisticAssetManager.createRealisticSculptedBoat()
    );
    boatGroup.add(boatSlot);

    // I. Hanging Amber Paper Lantern at Bow Stem
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(0, 1.35, 2.65);

    const cordGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.42, 6);
    const cordMesh = new THREE.Mesh(cordGeo, realisticAssetManager.darkTrimMaterial);
    cordMesh.position.y = 0.21;
    lanternGroup.add(cordMesh);

    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.07, 8), realisticAssetManager.brassHardwareMaterial);
    capTop.position.y = 0.07;
    const capBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.07, 8), realisticAssetManager.brassHardwareMaterial);
    capBottom.position.y = -0.42;
    lanternGroup.add(capTop, capBottom);

    const paperLanternGeo = new THREE.SphereGeometry(0.25, 16, 16);
    paperLanternGeo.scale(1.0, 1.35, 1.0);
    const paperLanternMesh = new THREE.Mesh(paperLanternGeo, realisticAssetManager.silkLanternMaterial);
    paperLanternMesh.position.y = -0.17;
    lanternGroup.add(paperLanternMesh);

    const lanternLight = new THREE.PointLight(0xffa530, 2.4, 9.5);
    lanternLight.position.set(0, -0.17, 0);
    lanternGroup.add(lanternLight);
    boatGroup.add(lanternGroup);

    // J. Handcrafted Lived-In Artifacts
    // 1. Ceramic stoneware tea/water jar on floorboards
    const jarMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.38, 12), realisticAssetManager.glazedCeramicMaterial);
    jarMesh.position.set(-0.55, 0.31, 0.85);
    boatGroup.add(jarMesh);

    // 2. Coiled hemp mooring line at bow
    const ropeMesh = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.06, 10, 20), realisticAssetManager.hempRopeMaterial);
    ropeMesh.rotation.x = Math.PI / 2;
    ropeMesh.position.set(0.42, 0.58, 2.1);
    boatGroup.add(ropeMesh);

    // 3. Folded burlap cargo sack on aft thwart
    const sackMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.18, 0.48),
      realisticAssetManager.burlapSackMaterial
    );
    sackMesh.position.set(0.40, 0.53, -1.65);
    boatGroup.add(sackMesh);

    // K. Long Traditional Wooden Sculling Sweep Oars
    const oarShaftGeo = new THREE.CylinderGeometry(0.045, 0.055, 4.2, 8);
    const oarBladeGeo = new THREE.BoxGeometry(0.22, 0.035, 1.25);

    const oar1Group = new THREE.Group();
    const oar1Shaft = new THREE.Mesh(oarShaftGeo, realisticAssetManager.timberMaterial);
    const oar1Blade = new THREE.Mesh(oarBladeGeo, realisticAssetManager.timberMaterial);
    oar1Blade.position.set(0, -1.7, 0);
    oar1Group.add(oar1Shaft, oar1Blade);
    oar1Group.position.set(1.15, 0.52, -0.35);
    oar1Group.rotation.z = Math.PI / 3.4;
    boatGroup.add(oar1Group);

    const oar2Group = new THREE.Group();
    const oar2Shaft = new THREE.Mesh(oarShaftGeo, realisticAssetManager.timberMaterial);
    const oar2Blade = new THREE.Mesh(oarBladeGeo, realisticAssetManager.timberMaterial);
    oar2Blade.position.set(0, -1.7, 0);
    oar2Group.add(oar2Shaft, oar2Blade);
    oar2Group.position.set(-1.15, 0.52, -0.35);
    oar2Group.rotation.z = -Math.PI / 3.4;
    boatGroup.add(oar2Group);

    // L. Traditional Seated Rower Figure
    const paddlerGroup = new THREE.Group();
    paddlerGroup.position.set(0, 0.44, -0.42); // Seated on the rowing thwart

    // Indigo linen robe
    const robeMat = new THREE.MeshStandardMaterial({
      color: 0x223344,
      roughness: 0.88,
    });
    const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.30, 0.68, 10), robeMat);
    torsoMesh.position.y = 0.34;
    torsoMesh.rotation.x = 0.12;
    paddlerGroup.add(torsoMesh);

    // Warm clay skin tone
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xd2a679,
      roughness: 0.75,
    });
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), skinMat);
    headMesh.position.set(0, 0.78, 0.05);
    paddlerGroup.add(headMesh);

    // Conical woven straw hat (traditional kasa / bamboo hat)
    const hatMat = new THREE.MeshStandardMaterial({
      color: 0xd6ba8b,
      roughness: 0.92,
      side: THREE.DoubleSide,
    });
    const hatMesh = new THREE.Mesh(new THREE.ConeGeometry(0.52, 0.22, 24), hatMat);
    hatMesh.position.set(0, 0.90, 0.06);
    hatMesh.rotation.x = 0.14;
    paddlerGroup.add(hatMesh);

    const hatBand = new THREE.Mesh(new THREE.TorusGeometry(0.50, 0.018, 6, 24), darkTrimWoodMat);
    hatBand.rotation.x = Math.PI / 2 + 0.14;
    hatBand.position.set(0, 0.81, 0.08);
    paddlerGroup.add(hatBand);

    // Arms holding oars
    const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.58, 8);
    const leftArm = new THREE.Mesh(armGeo, robeMat);
    leftArm.position.set(0.35, 0.46, 0.14);
    leftArm.rotation.set(-0.35, 0.1, -0.65);
    paddlerGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, robeMat);
    rightArm.position.set(-0.35, 0.46, 0.14);
    rightArm.rotation.set(-0.35, -0.1, 0.65);
    paddlerGroup.add(rightArm);

    const handGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(0.58, 0.35, 0.32);
    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(-0.58, 0.35, 0.32);
    paddlerGroup.add(leftHand, rightHand);

    boatGroup.add(paddlerGroup);

    // Ensure all boat hero components cast and receive contact shadows
    boatGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(boatGroup);

    // M. Localized Oar Water Contact Ripple System (Gentle circular disturbance, zero white foam)
    const MAX_RIPPLES = 8;
    interface OarWaterRipple {
      mesh: THREE.Mesh;
      active: boolean;
      spawnTime: number;
      maxLife: number;
    }
    const rippleGeo = new THREE.RingGeometry(0.16, 0.28, 28);
    rippleGeo.rotateX(-Math.PI / 2);
    const ripples: OarWaterRipple[] = [];
    const rippleGroup = new THREE.Group();

    for (let rIdx = 0; rIdx < MAX_RIPPLES; rIdx++) {
      const rMat = new THREE.MeshBasicMaterial({
        color: 0x9ecac4,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const rMesh = new THREE.Mesh(rippleGeo, rMat);
      rMesh.visible = false;
      rippleGroup.add(rMesh);
      ripples.push({
        mesh: rMesh,
        active: false,
        spawnTime: 0,
        maxLife: 1.6,
      });
    }
    scene.add(rippleGroup);

    let nextRippleIdx = 0;
    const spawnOarRipple = (worldX: number, worldY: number, worldZ: number) => {
      const rip = ripples[nextRippleIdx];
      nextRippleIdx = (nextRippleIdx + 1) % MAX_RIPPLES;
      rip.mesh.position.set(worldX, worldY + 0.015, worldZ);
      rip.mesh.scale.set(1, 1, 1);
      (rip.mesh.material as THREE.MeshBasicMaterial).opacity = 0.35;
      rip.mesh.visible = true;
      rip.active = true;
      rip.spawnTime = performance.now() / 1000;
    };

    // 6. PERSISTENT WORLD LANDMARKS SITTING FIRMLY ON TERRAIN
    // Objects query riverWorld.getTerrainHeight() for exact elevation (no floating objects)

    // A. Realistic Masonry Moon Arch Bridges spanning river gorge (voussoirs, keystones, rusticated piers)
    scene.add(realisticAssetManager.createRealisticMoonArchBridge(0.10));
    scene.add(realisticAssetManager.createRealisticMoonArchBridge(0.25));

    // C. Memorable Journey Landmarks (Deterministically Placed & Physically Integrated)
    // 1. Ancient Scholar Banyan Tree at Awakening bend (u = 0.055)
    scene.add(realisticAssetManager.createAncientScholarBanyan(0.055, 'left'));

    // 2. High Ancient Cliff Aqueduct Span at mountain gorge threshold (u = 0.65)
    scene.add(realisticAssetManager.createAncientCliffAqueduct(0.65));

    // 3. Misty Gorge Waterfall cascading down sheer rock cliff (u = 0.44)
    scene.add(realisticAssetManager.createMistyGorgeWaterfall(0.44, 'left'));

    // 4. Secluded Riverside Pagoda Pavilion on stone plinth (u = 0.58)
    scene.add(realisticAssetManager.createRiversidePagodaPavilion(0.58, 'right'));

    // 5. Stilt Fishermen Shelter & drying nets at transformation reach (u = 0.73)
    scene.add(realisticAssetManager.createFishermanStiltShelter(0.73, 'left'));

    // B. Traditional River Village Stilt Docks at canonical chapter landings
    CANONICAL_RIVER_STOPS.slice(0, 5).forEach((stop) => {
      scene.add(realisticAssetManager.createTraditionalVillageDock(stop.u, 'right'));
    });

    // =========================================================================
    // 6.2. BOTANICAL DIVERSITY (4 Species: Willows, Peaches, Pines, Bamboo)
    // =========================================================================

    // 1. Weeping River Willows along shoreline banks (leaning toward river)
    for (let w = 0; w < 16; w++) {
      const u = 0.03 + (w / 16) * 0.84;
      const center = riverWorld.getPosition(u);
      const normal = riverWorld.getNormal(u);
      const halfWidth = riverWorld.getWidth(u) * 0.5;
      const side = w % 2 === 0 ? 1 : -1;
      const inlandDist = 1.2 + (w % 3) * 0.9;

      const wx = center.x + normal.x * side * (halfWidth + inlandDist);
      const wz = center.z + normal.z * side * (halfWidth + inlandDist);
      const scale = 0.9 + (w % 4) * 0.12;

      scene.add(environmentDetailSystem.createWeepingWillow(wx, wz, scale, w));

      // Exposed roots dipping into water margin
      if (w % 2 === 0) {
        const towardWater = normal.clone().multiplyScalar(-side);
        scene.add(environmentDetailSystem.createExposedRoots(wx, wz, towardWater));
      }
    }

    // 2. Blooming Peach Trees in Peach Village and Lantern Gorge
    for (let pt = 0; pt < 16; pt++) {
      const u = pt < 10 ? 0.05 + pt * 0.009 : 0.50 + (pt - 10) * 0.012;
      const center = riverWorld.getPosition(u);
      const normal = riverWorld.getNormal(u);
      const halfWidth = riverWorld.getWidth(u) * 0.5;
      const side = pt % 2 === 0 ? 1 : -1;
      const inlandDist = 3.6 + (pt % 3) * 2.2;

      const px = center.x + normal.x * side * (halfWidth + inlandDist);
      const pz = center.z + normal.z * side * (halfWidth + inlandDist);
      const scale = 0.92 + (pt % 3) * 0.16;

      scene.add(environmentDetailSystem.createBloomingPeachTree(px, pz, scale, pt));
    }

    // 3. Clonal Bamboo Groves at Bamboo Forest (u in [0.18, 0.30])
    for (let bg = 0; bg < 12; bg++) {
      const u = 0.18 + bg * 0.010;
      const center = riverWorld.getPosition(u);
      const normal = riverWorld.getNormal(u);
      const halfWidth = riverWorld.getWidth(u) * 0.5;
      const side = bg % 2 === 0 ? 1 : -1;
      const inlandDist = 2.4 + (bg % 3) * 2.8;

      const bx = center.x + normal.x * side * (halfWidth + inlandDist);
      const bz = center.z + normal.z * side * (halfWidth + inlandDist);

      scene.add(environmentDetailSystem.createBambooGrove(bx, bz, 6 + (bg % 3) * 2, bg));
    }

    // 4. Highland River Pines on upper valley bluffs and ridges
    for (let pn = 0; pn < 16; pn++) {
      const u = 0.32 + pn * 0.018;
      const center = riverWorld.getPosition(u);
      const normal = riverWorld.getNormal(u);
      const halfWidth = riverWorld.getWidth(u) * 0.5;
      const side = pn % 2 === 0 ? 1 : -1;
      const inlandDist = 16.0 + (pn % 4) * 6.5; // High up on mountain terraces

      const px = center.x + normal.x * side * (halfWidth + inlandDist);
      const pz = center.z + normal.z * side * (halfWidth + inlandDist);
      const scale = 0.95 + (pn % 3) * 0.22;

      scene.add(environmentDetailSystem.createHighlandPine(px, pz, scale, pn));
    }

    // =========================================================================
    // 6.3. GEOLOGICAL FORMATIONS & GROUND SCATTER
    // =========================================================================

    // Karst Limestone Cliff Towers in Mountain Valley & Gorge (u in [0.35, 0.48])
    for (let mv = 0; mv < 14; mv++) {
      const u = 0.35 + mv * 0.012;
      const center = riverWorld.getPosition(u);
      const normal = riverWorld.getNormal(u);
      const halfWidth = riverWorld.getWidth(u) * 0.5;
      const side = mv % 2 === 0 ? 1 : -1;
      const inlandDist = 14.0 + (mv % 3) * 5.0;

      const cx = center.x + normal.x * side * (halfWidth + inlandDist);
      const cz = center.z + normal.z * side * (halfWidth + inlandDist);
      const radius = 7.5 + (mv % 3) * 2.5;
      const height = 24.0 + (mv % 4) * 6.0;

      scene.add(environmentDetailSystem.createKarstCliffTower(cx, cz, radius, height, mv));
    }

    // Shoreline Boulders with wet/dry waterline transitions
    for (let rk = 0; rk < 28; rk++) {
      const u = (rk / 28) * 0.88 + 0.02;
      const center = riverWorld.getPosition(u);
      const normal = riverWorld.getNormal(u);
      const halfWidth = riverWorld.getWidth(u) * 0.5;
      const side = rk % 2 === 0 ? 1 : -1;

      const rx = center.x + normal.x * side * (halfWidth + 0.6);
      const rz = center.z + normal.z * side * (halfWidth + 0.6);
      const radius = 1.1 + (rk % 4) * 0.35;

      scene.add(environmentDetailSystem.createShorelineBoulder(rx, rz, radius, rk));
    }

    // Shoreline Pebble Beds & River Reeds along shallow silt bars
    const scatterLocations = [0.04, 0.12, 0.22, 0.38, 0.52, 0.68, 0.82];
    scatterLocations.forEach((uScat, idx) => {
      const center = riverWorld.getPosition(uScat);
      const normal = riverWorld.getNormal(uScat);
      const halfWidth = riverWorld.getWidth(uScat) * 0.5;
      const side = idx % 2 === 0 ? 1 : -1;

      // Reeds right at the waterline
      const reedX = center.x + normal.x * side * (halfWidth - 0.4);
      const reedZ = center.z + normal.z * side * (halfWidth - 0.4);
      scene.add(environmentDetailSystem.createRiverReeds(reedX, reedZ, 10 + (idx % 3) * 4));

      // Floating water lilies in calm bank eddies
      if (idx % 2 === 0) {
        const lilyX = center.x + normal.x * side * (halfWidth - 1.2);
        const lilyZ = center.z + normal.z * side * (halfWidth - 1.2);
        scene.add(realisticAssetManager.createRealisticWaterLilies(lilyX, lilyZ, 5 + (idx % 3)));
      }

      // Pebble bed on the sand bar
      const pebX = center.x + normal.x * side * (halfWidth + 1.2);
      const pebZ = center.z + normal.z * side * (halfWidth + 1.2);
      scene.add(environmentDetailSystem.createShorelinePebbleBed(pebX, pebZ, 12, 2.4));
    });

    // Stop Lanterns at canonical stops (Authentic Pagoda Water Lanterns)
    const stopLanterns: Array<{ mesh: THREE.Object3D; stop: typeof CANONICAL_RIVER_STOPS[0] }> = [];
    CANONICAL_RIVER_STOPS.slice(0, 5).forEach((stop) => {
      const p = riverWorld.getPosition(stop.u);
      const normal = riverWorld.getNormal(stop.u);
      const halfWidth = riverWorld.getWidth(stop.u) * 0.5;

      const lanternGroup = realisticAssetManager.createAuthenticWaterLantern();
      lanternGroup.position.set(
        p.x + normal.x * (halfWidth - 2.5),
        0.35,
        p.z + normal.z * (halfWidth - 2.5)
      );

      scene.add(lanternGroup);
      stopLanterns.push({ mesh: lanternGroup, stop });
    });

    // 6.5. PHYSICAL OBSTACLE MESHES (TEST CASES A, B, C, D & WORLD PROXIES)
    scene.add(collisionSystem.createObstacleVisualMeshes());

    // =========================================================================
    // 6.6. ENVIRONMENTAL MICRO-EVENTS (Subtle, sparse, lightweight life)
    // =========================================================================
    // 1. Distant Mountain Birds soaring in thermal currents high above the gorge
    const birdCount = 3;
    const birdsGroup = new THREE.Group();
    const birdMeshes: THREE.Mesh[] = [];
    const birdWingGeo = new THREE.PlaneGeometry(1.6, 0.42);
    birdWingGeo.rotateX(-Math.PI / 2);
    const birdMat = new THREE.MeshBasicMaterial({ color: 0x242e2b, side: THREE.DoubleSide });

    for (let b = 0; b < birdCount; b++) {
      const birdMesh = new THREE.Mesh(birdWingGeo, birdMat);
      birdsGroup.add(birdMesh);
      birdMeshes.push(birdMesh);
    }
    scene.add(birdsGroup);

    // 2. Drifting River Surface Leaves (peach petals & willow leaves caught in current)
    const leafCount = 36;
    const leavesGroup = new THREE.Group();
    const leafGeo = new THREE.PlaneGeometry(0.18, 0.10);
    leafGeo.rotateX(-Math.PI / 2);
    const willowLeafMat = new THREE.MeshStandardMaterial({
      color: 0x6e804f,
      roughness: 0.72,
      side: THREE.DoubleSide,
    });
    const peachPetalMat = new THREE.MeshStandardMaterial({
      color: 0xedb4a6,
      roughness: 0.65,
      side: THREE.DoubleSide,
    });

    interface DriftingLeaf {
      mesh: THREE.Mesh;
      relativeU: number;
      lateralRatio: number;
      driftPhase: number;
      speedMult: number;
    }
    const driftingLeaves: DriftingLeaf[] = [];

    for (let l = 0; l < leafCount; l++) {
      const isPetal = l % 3 === 0;
      const mesh = new THREE.Mesh(leafGeo, isPetal ? peachPetalMat : willowLeafMat);
      mesh.scale.set(0.8 + (l % 4) * 0.15, 1, 0.8 + (l % 4) * 0.15);
      leavesGroup.add(mesh);
      driftingLeaves.push({
        mesh,
        relativeU: -0.04 + (l / leafCount) * 0.08,
        lateralRatio: ((l * 1.37) % 1.7) - 0.85,
        driftPhase: l * 0.8,
        speedMult: 0.85 + (l % 5) * 0.08,
      });
    }
    scene.add(leavesGroup);

    // 3. Misty Gorge Wisp Ribbon (Low-lying morning mist hovering over gorge bend u = 0.43)
    const gorgeMistCenter = riverWorld.getPosition(0.43);
    const gorgeMistGeo = new THREE.PlaneGeometry(18.0, 38.0);
    gorgeMistGeo.rotateX(-Math.PI / 2);
    const gorgeMistMat = new THREE.MeshBasicMaterial({
      color: 0xd4e5e2,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    const gorgeMistMesh = new THREE.Mesh(gorgeMistGeo, gorgeMistMat);
    gorgeMistMesh.position.set(gorgeMistCenter.x, 0.75, gorgeMistCenter.z);
    scene.add(gorgeMistMesh);

    // 7. DEBUG VISUALIZATION (?journeydebug=1)
    if (isDebugEnabled) {
      scene.add(riverWorld.createDebugVisualizationGroup());
      scene.add(collisionSystem.createDebugVisualization());
    }

    // 9. CINEMATIC WORLD-SPACE CAMERA & RENDER PIPELINE OPTIMIZATION
    const boatNavigator = new BoatNavigationSystem(isHeroRef.current ? 0.01 : progressRef.current);
    const cinematicCamera = new CinematicCameraSystem();
    let lastFrameTime = performance.now();
    let lastPublishedU = -1;
    let lastPublishTime = 0;
    let lastDebugPublishTime = 0;
    let animationFrameId: number | null = null;
    let isLoopRunning = false;
    let lastReportedStop = -1;
    let lastStrokeState: string = 'rest';
    let activeStopNoticeNumber = -1;

    // Preallocated scratch vectors for render loop to eliminate garbage collection micro-pauses
    const _starBladeLocal = new THREE.Vector3(2.5, -0.05, -0.35);
    const _portBladeLocal = new THREE.Vector3(-2.5, -0.05, -0.35);
    const _starBladeWorld = new THREE.Vector3();
    const _portBladeWorld = new THREE.Vector3();
    const _sternPos = new THREE.Vector3();
    const _targetFogColor = new THREE.Color(0xd7e6e5);

    let mouseX = 0;
    let mouseY = 0;
    let isPointerDown = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let userPanX = 0;
    let userPanY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isPointerDown = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      dragStartX = clientX;
      dragStartY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouseX = (clientX / window.innerWidth) * 2 - 1;
      mouseY = -(clientY / window.innerHeight) * 2 + 1;

      if (isPointerDown) {
        const deltaX = (clientX - dragStartX) * 0.005;
        const deltaY = (clientY - dragStartY) * 0.003;
        userPanX += deltaX;
        userPanY += deltaY;
        dragStartX = clientX;
        dragStartY = clientY;
      }
    };

    const handlePointerUp = () => {
      isPointerDown = false;
    };

    const canvasDom = renderer.domElement;
    canvasDom.addEventListener('mousedown', handlePointerDown);
    canvasDom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      // Keep the canvas mounted behind the chapter reader, but stop its costly
      // simulation and WebGL draw calls while the scene is fully covered.
      if (isPausedRef.current || document.visibilityState === 'hidden') {
        isLoopRunning = false;
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min(Math.max((now - lastFrameTime) / 1000, 0.001), 0.066);
      lastFrameTime = now;
      const elapsedTime = now / 1000;

      // Auto-cruise calculation
      if (isAutoCruiseRef.current && !isHeroRef.current) {
        let nextP = progressRef.current + 0.0006;
        if (nextP > 1.0) nextP = 0.0;
        progressRef.current = nextP;
      }

      // Target progress from scroll/guided sailing
      const targetProgress = isHeroRef.current ? 0.01 : Math.max(0, Math.min(progressRef.current, 1));
      
      // Controlled interactive lateral offset (damped and constrained to navigable corridor)
      const requestedOffset = userPanX * 3.0;

      // Update Boat via Authoritative BoatNavigationSystem
      const boatState = boatNavigator.update(targetProgress, dt, requestedOffset, elapsedTime);

      // Throttled UI progress synchronization to prevent React re-renders during high-FPS sailing
      if (onProgressUpdate && !isHeroRef.current) {
        if (Math.abs(boatState.u - lastPublishedU) > 0.0035 || (now - lastPublishTime > 100) || boatState.isArrived) {
          lastPublishedU = boatState.u;
          lastPublishTime = now;
          onProgressUpdate(
            boatState.u,
            boatState.isArrived,
            boatState.velocity,
            boatState.distanceToTarget,
            boatState.navigationPhase,
            boatState.actualTravelTime
          );
        }
      }

      // Expose authoritative navigation telemetry on window for automated tests & debug inspections
      if (typeof window !== 'undefined') {
        const stopEntry = boatState.nearestStop;
        const currentChId = stopEntry ? `chapter-${stopEntry.chapterNumber}` : 'chapter-7';
        const targetStopNumber = boatState.targetU <= 0.12 ? 7 : boatState.targetU <= 0.17 ? 8 : boatState.targetU <= 0.22 ? 9 : boatState.targetU <= 0.27 ? 10 : 11;
        const targetChId = `chapter-${targetStopNumber}`;

        (window as unknown as { __riverNavigationTelemetry?: Record<string, unknown>; __riverAssetManifest?: typeof ASSET_MANIFEST }).__riverNavigationTelemetry = {
          currentChapterId: currentChId,
          targetChapterId: targetChId,
          currentU: boatState.u,
          targetU: boatState.targetU,
          navigationState: boatState.navigationPhase,
          forwardVelocity: boatState.velocity,
          distanceToTarget: boatState.distanceToTarget,
          arrivalThreshold: boatState.arrivalThreshold,
          scrollLocked: boatState.navigationPhase !== 'stopped',
          actualTravelTime: boatState.actualTravelTime,
          cameraMode: 'ELEVATED_THIRD_PERSON_FOLLOW',
          velocityU: boatState.velocityU,
          isArrived: boatState.isArrived,
        };
        (window as unknown as { __riverAssetManifest?: typeof ASSET_MANIFEST }).__riverAssetManifest = ASSET_MANIFEST;
      }

      // Update active water ripples from oar contact
      ripples.forEach((rip) => {
        if (!rip.active) return;
        const age = (elapsedTime - rip.spawnTime) / rip.maxLife;
        if (age >= 1.0) {
          rip.active = false;
          rip.mesh.visible = false;
        } else {
          const scale = 1.0 + age * 4.6;
          rip.mesh.scale.set(scale, scale, 1);
          const fade = Math.sin((1.0 - age) * Math.PI * 0.5);
          (rip.mesh.material as THREE.MeshBasicMaterial).opacity = fade * 0.32;
        }
      });

      // Apply boat world position & orientation
      boatGroup.position.copy(boatState.worldPosition);
      boatGroup.quaternion.copy(boatState.quaternion);
      boatGroup.updateMatrixWorld();

      // Kinematic Human Rowing Animation: Synchronized 4-Phase Stroke Cycle
      const p = boatState.strokePhase;
      let torsoLean = 0.08;
      let sweepAngle = 0.0;
      let pitchAngle = 0.0;

      if (boatState.isRowingActive) {
        if (boatState.strokeState === 'catch') {
          // Phase 1: Catch / Reach forward (blades airborne, leaning forward)
          const alpha = Math.min(1.0, Math.max(0.0, p / 0.22));
          torsoLean = THREE.MathUtils.lerp(0.08, 0.24, alpha);
          sweepAngle = THREE.MathUtils.lerp(0.0, 0.42, alpha);
          pitchAngle = THREE.MathUtils.lerp(0.0, 0.16, alpha);
        } else if (boatState.strokeState === 'drive') {
          // Phase 2: Drive / Power Stroke (blades submerged in water, pulling backward with strength)
          const beta = Math.min(1.0, Math.max(0.0, (p - 0.22) / (0.65 - 0.22)));
          torsoLean = THREE.MathUtils.lerp(0.24, -0.14, Math.sin(beta * Math.PI * 0.5));
          sweepAngle = THREE.MathUtils.lerp(0.42, -0.50, beta);
          pitchAngle = -0.12 - 0.06 * Math.sin(beta * Math.PI);
        } else if (boatState.strokeState === 'release') {
          // Phase 3: Release (blades lift out of water cleanly, torso holds finish)
          const gamma = Math.min(1.0, Math.max(0.0, (p - 0.65) / (0.73 - 0.65)));
          torsoLean = -0.14;
          sweepAngle = -0.50;
          pitchAngle = THREE.MathUtils.lerp(-0.12, 0.16, gamma);
        } else {
          // Phase 4: Recovery & Glide (blades feather above water, boat glides on momentum)
          const delta = Math.min(1.0, Math.max(0.0, (p - 0.73) / (1.00 - 0.73)));
          torsoLean = THREE.MathUtils.lerp(-0.14, 0.08, delta);
          sweepAngle = THREE.MathUtils.lerp(-0.50, 0.0, delta);
          pitchAngle = THREE.MathUtils.lerp(0.16, 0.04, delta);
        }
      } else {
        // Rest / Settled / Idle: Relaxed upright seated pose, oars resting level near water
        torsoLean = 0.08 + Math.sin(elapsedTime * 1.5) * 0.015;
        sweepAngle = 0.0;
        pitchAngle = 0.0;
      }

      // Apply kinematics to paddler and sweep oars
      paddlerGroup.rotation.x = torsoLean;
      oar1Group.rotation.y = sweepAngle;
      oar1Group.rotation.x = pitchAngle;
      oar1Group.rotation.z = Math.PI / 3.4;

      oar2Group.rotation.y = -sweepAngle;
      oar2Group.rotation.x = pitchAngle;
      oar2Group.rotation.z = -Math.PI / 3.4;

      // Detect stroke phase transitions for audio & localized water contact ripples
      if (boatState.strokeState !== lastStrokeState) {
        if (boatState.strokeState === 'drive' && lastStrokeState !== 'drive') {
          // Oars enter water: trigger soft water dip sound + localized water ripple rings
          riverAudio.triggerOarEvent('catch', 0.85);

          _starBladeWorld.copy(_starBladeLocal).applyMatrix4(boatGroup.matrixWorld);
          _portBladeWorld.copy(_portBladeLocal).applyMatrix4(boatGroup.matrixWorld);

          spawnOarRipple(_starBladeWorld.x, boatState.waterElevation, _starBladeWorld.z);
          spawnOarRipple(_portBladeWorld.x, boatState.waterElevation, _portBladeWorld.z);
        } else if (boatState.strokeState === 'release') {
          // Oars lift out of water: delicate water droplets
          riverAudio.triggerOarEvent('release', 0.75);
        }
        lastStrokeState = boatState.strokeState;
      }

      // Midway through power stroke drive: trigger authentic wooden thole-pin creak & displacement whoosh
      if (boatState.strokeState === 'drive' && p > 0.36 && p < 0.44) {
        riverAudio.triggerOarEvent('drive', 0.9);
      }

      // Update sound modulation from calm physical velocity
      riverAudio.updateSpeed(boatState.velocity / 2.75);

      // Update soft historical trajectory wake (stern positioned 3.2m behind boat center, reuse vector)
      _sternPos.copy(boatState.worldPosition).addScaledVector(boatState.tangent, -3.2);
      wakeTrail.update(_sternPos, boatState.tangent, boatState.velocity, elapsedTime);

      // Water shader updates
      waterMat.uniforms.uTime.value = elapsedTime;
      waterMat.uniforms.uBoatPos.value.copy(boatState.worldPosition);
      waterMat.uniforms.uBoatForward.value.copy(boatState.tangent);
      waterMat.uniforms.uBoatNormal.value.copy(boatState.normal);
      waterMat.uniforms.uBoatSpeed.value = boatState.velocity;
      waterMat.uniforms.uWakeCount.value = wakeTrail.getActiveCount();

      // Update directional sunlight and shadow frustum center to track boat world position
      sunLight.target.position.copy(boatState.worldPosition);
      sunLight.position.set(
        boatState.worldPosition.x + 65,
        boatState.worldPosition.y + 80,
        boatState.worldPosition.z - 95
      );

      lanternLight.intensity = 2.0 + Math.sin(elapsedTime * 12.0) * 0.15;

      // Update Distant Birds (Soaring in slow thermal circles high above the gorge)
      const gorgeSkyCenter = riverWorld.getPosition(0.42);
      birdMeshes.forEach((bm, bIdx) => {
        const bAngle = elapsedTime * 0.22 + bIdx * 2.094;
        const bRadius = 18.0 + bIdx * 6.0;
        bm.position.set(
          gorgeSkyCenter.x + Math.cos(bAngle) * bRadius,
          54.0 + Math.sin(bAngle * 2.0) * 1.8 + bIdx * 3.0,
          gorgeSkyCenter.z + Math.sin(bAngle) * bRadius
        );
        bm.rotation.y = -bAngle - Math.PI / 2;
        bm.rotation.z = Math.sin(bAngle * 3.0) * 0.18;
      });

      // Update Drifting Surface Leaves (flow with river current, wrap gracefully around boat)
      driftingLeaves.forEach((leaf) => {
        leaf.relativeU -= dt * 0.0032 * leaf.speedMult;
        if (leaf.relativeU < -0.045) {
          leaf.relativeU += 0.09;
        } else if (leaf.relativeU > 0.045) {
          leaf.relativeU -= 0.09;
        }

        const sampleU = Math.max(0.001, Math.min(0.999, boatState.u + leaf.relativeU));
        const centerPos = riverWorld.getPosition(sampleU);
        const normalVec = riverWorld.getNormal(sampleU);
        const rWidth = riverWorld.getWidth(sampleU);
        const lateralDist = leaf.lateralRatio * (rWidth * 0.42);

        const wobble = Math.sin(elapsedTime * 1.8 + leaf.driftPhase) * 0.22;
        leaf.mesh.position.set(
          centerPos.x + normalVec.x * (lateralDist + wobble),
          0.022,
          centerPos.z + normalVec.z * (lateralDist + wobble)
        );
        leaf.mesh.rotation.y = leaf.driftPhase + Math.sin(elapsedTime * 0.8 + leaf.driftPhase) * 0.4;
      });

      // Subtle breath of the gorge mist ribbon
      (gorgeMistMesh.material as THREE.MeshBasicMaterial).opacity = 0.14 + Math.sin(elapsedTime * 0.5) * 0.035;
      gorgeMistMesh.rotation.z = Math.sin(elapsedTime * 0.15) * 0.04;

      // Chapter Atmosphere Pacing: smoothly modulate lighting & fog based on progress u
      let targetFogDensity = 0.0038;
      let targetSunIntensity = 2.1;
      let targetHemiIntensity = 0.65;

      if (boatState.u < 0.15) {
        // Awakening (Ch. 1): Soft crisp dawn mist
        _targetFogColor.setHex(0xd7e6e5);
        targetFogDensity = 0.0038;
        targetSunIntensity = 2.05;
      } else if (boatState.u < 0.32) {
        // Curiosity & Bamboo Forest (Ch. 2): Dappled morning light
        _targetFogColor.setHex(0xdbece6);
        targetFogDensity = 0.0033;
        targetSunIntensity = 2.15;
      } else if (boatState.u < 0.48) {
        // Conflict / Mountain Gorge (Ch. 4): Dramatic canyon shadows & cool river mist
        _targetFogColor.setHex(0xc5d7d4);
        targetFogDensity = 0.0046;
        targetSunIntensity = 2.3;
      } else if (boatState.u < 0.72) {
        // Insight & Transformation (Ch. 5 & 6): Open vista, warm afternoon light
        _targetFogColor.setHex(0xeae0d4);
        targetFogDensity = 0.0029;
        targetSunIntensity = 2.05;
      } else {
        // Reflection (Ch. 7): Serene golden hour twilight, tranquil minimal distraction
        _targetFogColor.setHex(0xedd9c6);
        targetFogDensity = 0.0026;
        targetSunIntensity = 1.85;
      }

      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.lerp(_targetFogColor, dt * 1.5);
        scene.fog.density += (targetFogDensity - scene.fog.density) * dt * 1.5;
      }
      sunLight.intensity += (targetSunIntensity - sunLight.intensity) * dt * 1.5;
      hemiLight.intensity += (targetHemiIntensity - hemiLight.intensity) * dt * 1.5;

      // Update sound atmosphere hooks based on river progression
      riverAudio.updateAtmosphere(boatState.u);

      // 9. CINEMATIC WORLD-SPACE CAMERA SYSTEM
      cinematicCamera.update(camera, {
        boatPosition: boatState.worldPosition,
        boatForward: boatState.tangent,
        boatNormal: boatState.normal,
        boatSpeed: boatState.velocity,
        currentU: boatState.u,
        mode: cameraModeRef.current,
        dt,
        elapsedTime,
        userPanX,
        userPanY,
        mouseX,
        mouseY,
        isHeroMode: isHeroRef.current,
      });

      // Bob stop lanterns
      stopLanterns.forEach((sl, idx) => {
        sl.mesh.position.y = 0.35 + Math.sin(elapsedTime * 1.7 + idx) * 0.05;
      });

      // Chapter Stop Arrival Detection
      const activeStop = boatState.nearestStop;

      if (activeStop) {
        // Show gentle floating landmark toast when near stop (guarded to prevent re-renders)
        if (activeStopNoticeNumber !== activeStop.chapterNumber) {
          activeStopNoticeNumber = activeStop.chapterNumber;
          setActiveStopNotice({
            number: activeStop.chapterNumber,
            title: activeStop.title,
            kicker: activeStop.regionName,
          });
        }

        if (lastReportedStop !== activeStop.chapterNumber) {
          // Arrived at destination stop: either physics settled at stop, or target was this stop and within tolerance
          const isTargetingThisStop = Math.abs(boatState.targetU - activeStop.u) <= 0.025;
          const isPhysicallyAtStop = Math.abs(boatState.u - activeStop.u) <= 0.018;
          const isSettledAtStop = boatState.isArrived || (isPhysicallyAtStop && Math.abs(boatState.velocityU) < 0.002);

          if (isTargetingThisStop && isSettledAtStop) {
            lastReportedStop = activeStop.chapterNumber;
            riverAudio.triggerChime();
            if (onReachStop && activeStop.chapterNumber <= 11) {
              onReachStop(activeStop.chapterNumber);
            }
          }
        }
      } else {
        if (lastReportedStop !== -1) {
          lastReportedStop = -1;
        }
        if (activeStopNoticeNumber !== -1) {
          activeStopNoticeNumber = -1;
          setActiveStopNotice(null);
        }
      }

      // Update Debug Telemetry & Visualization if ?journeydebug=1
      if (isDebugEnabled && now - lastDebugPublishTime >= 120) {
        lastDebugPublishTime = now;
        collisionSystem.updateDebugVisualization(
          boatState.worldPosition,
          boatState.quaternion,
          boatState.normal,
          boatState.telemetry
        );

        setDebugData({
          u: boatState.u,
          posX: boatState.worldPosition.x,
          posY: boatState.worldPosition.y,
          posZ: boatState.worldPosition.z,
          tangentX: boatState.tangent.x,
          tangentZ: boatState.tangent.z,
          width: riverWorld.getWidth(boatState.u),
          depth: riverWorld.getDepth(boatState.u),
          velocity: boatState.velocity,
          lateralOffset: boatState.lateralOffset,
          maxLateralOffset: boatState.maxLateralOffset,
          leftBankDist: boatState.leftBankDistance,
          rightBankDist: boatState.rightBankDistance,
          activeStop: activeStop ? `${activeStop.regionName} (Ch. ${activeStop.chapterNumber})` : 'Cruising navigable corridor',
          bankingAngleDeg: boatState.bankingAngleDeg,
          pitchAngleDeg: boatState.pitchAngleDeg,
          acceleration: boatState.acceleration,
          telemetry: boatState.telemetry,
        });
      }

      renderer.render(scene, camera);
    };

    const startAnimationLoop = () => {
      if (isLoopRunning || isPausedRef.current || document.visibilityState === 'hidden') return;
      isLoopRunning = true;
      animationFrameId = requestAnimationFrame(animate);
    };
    const stopAnimationLoop = () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      isLoopRunning = false;
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') stopAnimationLoop();
      else startAnimationLoop();
    };

    animationLoopRef.current = { start: startAnimationLoop, stop: stopAnimationLoop };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    startAnimationLoop();

    return () => {
      stopAnimationLoop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      animationLoopRef.current = {};
      canvasDom.removeEventListener('mousedown', handlePointerDown);
      canvasDom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      envMap.dispose();
      envTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [qualityTier, isDebugEnabled]);

  return (
    <div className="relative w-full h-full select-none">
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Debug Telemetry Overlay (?journeydebug=1) */}
      {isDebugEnabled && debugData && (
        <div className="absolute top-20 left-6 z-40 bg-[#16231F]/95 border border-[#00e5ff]/50 text-[#EEF3F1] p-3.5 rounded-xl font-mono text-[11px] backdrop-blur-md shadow-2xl pointer-events-none max-w-sm space-y-1.5 leading-snug">
          <div className="flex items-center justify-between border-b border-[#00e5ff]/40 pb-1 mb-1.5 text-[#00e5ff] font-bold">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${debugData.telemetry.minClearance < 1.0 ? 'bg-red-500 animate-ping' : debugData.telemetry.isAvoiding ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              COLLISION & AVOIDANCE HUD
            </span>
            <span>1 unit = 1m</span>
          </div>

          <div className="grid grid-cols-2 gap-x-2 text-[10px] pb-1 border-b border-white/10">
            <div><span className="text-[#c99a4b] font-semibold">Progress u:</span> {debugData.u.toFixed(4)}</div>
            <div><span className="text-[#c99a4b] font-semibold">Velocity:</span> {debugData.velocity.toFixed(2)} m/s</div>
            <div><span className="text-[#c99a4b] font-semibold">Acceleration:</span> {debugData.acceleration.toFixed(2)} m/s²</div>
            <div><span className="text-[#c99a4b] font-semibold">Roll / Pitch:</span> {debugData.bankingAngleDeg.toFixed(1)}° / {debugData.pitchAngleDeg.toFixed(1)}°</div>
            <div><span className="text-[#c99a4b] font-semibold">River W/D:</span> {debugData.width.toFixed(1)}m / {debugData.depth.toFixed(1)}m</div>
            <div><span className="text-[#c99a4b] font-semibold">Banks L|R:</span> {debugData.leftBankDist.toFixed(1)}m | {debugData.rightBankDist.toFixed(1)}m</div>
          </div>

          <div className="text-[10px] space-y-0.5">
            <div>
              <span className="text-[#00e5ff] font-semibold">Boat Hull Clearance:</span>{' '}
              <span className={debugData.telemetry.minClearance < 1.0 ? 'text-red-400 font-bold' : debugData.telemetry.minClearance < 2.0 ? 'text-amber-300' : 'text-emerald-400'}>
                {debugData.telemetry.minClearance > 50 ? '> 50m' : `${debugData.telemetry.minClearance.toFixed(2)}m`}
              </span>
            </div>
            <div>
              <span className="text-[#00e5ff] font-semibold">Nearest Obstacle:</span>{' '}
              <span className="text-white truncate">
                {debugData.telemetry.nearestObstacle ? debugData.telemetry.nearestObstacle.name : 'Channel Clear'}
              </span>
            </div>
            <div>
              <span className="text-[#00e5ff] font-semibold">Avoidance Vector:</span>{' '}
              <span className={debugData.telemetry.isAvoiding ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                {debugData.telemetry.avoidanceOffset > 0 ? '+' : ''}{debugData.telemetry.avoidanceOffset.toFixed(2)}m ({debugData.telemetry.isAvoiding ? 'ACTIVE STEERING' : 'NORMAL CORRIDOR'})
              </span>
            </div>
          </div>

          {/* 5-Step Look-Ahead Samples */}
          <div className="pt-1 border-t border-white/10">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
              Look-Ahead Horizon (s0..s4):
            </div>
            <div className="flex gap-1">
              {debugData.telemetry.lookAheadSamples.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex-1 text-center py-0.5 rounded text-[9px] font-mono ${
                    s.blocked
                      ? 'bg-red-950 border border-red-500 text-red-300'
                      : s.clearance < 1.8
                      ? 'bg-amber-950 border border-amber-500 text-amber-300'
                      : 'bg-emerald-950 border border-emerald-600/50 text-emerald-300'
                  }`}
                >
                  s{idx}:{s.clearance > 15 ? '>15' : s.clearance.toFixed(1)}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-[#00e5ff] truncate pt-0.5">
            <span className="text-[#c99a4b] font-semibold">Stop:</span> {debugData.activeStop}
          </div>
        </div>
      )}

      {/* Floating Stop Indicator when arriving at a chapter */}
      {activeStopNotice && !isHeroMode && (
        <div className="river-arrival-notice absolute bottom-16 left-1/2 -translate-x-1/2 z-30 animate-memory pointer-events-auto">
          <div className="river-arrival-notice__surface bg-[#FFFDF9] border border-[#163C3A]/15 rounded-2xl p-5 md:p-6 text-center shadow-xl max-w-sm md:max-w-md">
            <span className="text-xs uppercase tracking-[0.16em] text-[#85590A] block mb-1.5 font-semibold">
              {activeStopNotice.kicker}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#163C3A] font-normal mb-3 leading-snug">
              {activeStopNotice.title}
            </h3>
            {activeStopNotice.number <= 11 ? (
              <button
                onClick={() => onReachStop && onReachStop(activeStopNotice.number)}
                className="bg-[#163C3A] text-[#FFFDF8] px-6 py-2.5 rounded-full font-semibold text-xs tracking-wider uppercase hover:bg-[#2F6F8F] transition-all shadow-sm cursor-pointer"
              >
                Explore Chapter {activeStopNotice.number}
              </button>
            ) : (
              <a
                href="/case-studies/"
                className="inline-block bg-[#163C3A] text-[#FFFDF8] px-6 py-2.5 rounded-full font-semibold text-xs tracking-wider uppercase hover:bg-[#2F6F8F] transition-all cursor-pointer shadow-sm"
              >
                Explore 6 Case Studies
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
