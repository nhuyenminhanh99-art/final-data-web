import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { riverAudio } from './RiverAudio';

interface RiverCanvasProps {
  progress: number; // 0.0 to 1.0 along the river
  onReachStop?: (chapterNumber: number) => void;
  onSelectLantern?: (caseStudyId: string) => void;
  isHeroMode?: boolean; // Hero mode on Home page
  qualityTier?: 'high' | 'medium' | 'lite';
}

export const RiverCanvas: React.FC<RiverCanvasProps> = ({
  progress,
  onReachStop,
  isHeroMode = false,
  qualityTier = 'high',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  const isHeroRef = useRef(isHeroMode);
  const [activeStopNotice, setActiveStopNotice] = useState<{
    number: number;
    title: string;
    kicker: string;
  } | null>(null);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    isHeroRef.current = isHeroMode;
  }, [isHeroMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. SCENE SETUP - BRIGHT MORNING PALETTE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xddeeed); // Bright morning pale sky
    scene.fog = new THREE.FogExp2(0xe2eeea, 0.0065); // Soft morning mist, bright & luminous

    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.1,
      900
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: qualityTier === 'high',
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, qualityTier === 'high' ? 1.75 : 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15; // Bright, clean exposure per section 6B
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. LIGHTING - BRIGHT SUNSHINE & SKY BOUNCE
    // Bright sky hemisphere light (pale sky above, soft misty earth below)
    const hemiLight = new THREE.HemisphereLight(0xdbecee, 0xe8efe7, 1.4);
    scene.add(hemiLight);

    // Warm morning sun (35-degree angle, golden-warm white)
    const sunLight = new THREE.DirectionalLight(0xfff6e4, 2.4);
    sunLight.position.set(45, 60, -90);
    scene.add(sunLight);

    // Subtle fill light from river reflections
    const riverReflectionLight = new THREE.DirectionalLight(0xaad3cf, 0.8);
    riverReflectionLight.position.set(-30, -10, 40);
    scene.add(riverReflectionLight);

    // 3. RIVER SPLINE PATH (~650 units long)
    const curvePoints = [
      new THREE.Vector3(0, 0, 0),         // Start / Home Hero
      new THREE.Vector3(12, 0, -50),      // Gentle bend 1
      new THREE.Vector3(-10, 0, -110),    // Peach Village (Stop 1 ~ 0.12)
      new THREE.Vector3(-22, 0, -170),    // River curve
      new THREE.Vector3(6, 0, -230),      // Bamboo Forest (Stop 2 ~ 0.30)
      new THREE.Vector3(25, 0, -290),     // Canyon opening
      new THREE.Vector3(8, 0, -350),      // Mountain Valley (Stop 3 ~ 0.48)
      new THREE.Vector3(-14, 0, -410),    // Mountain gorge
      new THREE.Vector3(-28, 0, -470),    // Lantern Bridge (Stop 4 ~ 0.66)
      new THREE.Vector3(0, 0, -530),      // River widening
      new THREE.Vector3(22, 0, -590),     // Forgotten Garden (Stop 5 ~ 0.84)
      new THREE.Vector3(8, 0, -650),      // Approach
      new THREE.Vector3(0, 0, -700),      // The Harbour (Final stop ~ 1.0)
    ];
    const riverSpline = new THREE.CatmullRomCurve3(curvePoints);

    // 4. REALISTIC WATER SURFACE WITH FRESNEL SHADER
    const waterGeo = new THREE.PlaneGeometry(180, 900, qualityTier === 'high' ? 80 : 40, 160);
    const waterMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDeepWaterColor: { value: new THREE.Color(0x1a4642) },  // Rich translucent jade depth
        uShallowWaterColor: { value: new THREE.Color(0x357872) }, // Bright turquoise jade midtone
        uSkyReflectionColor: { value: new THREE.Color(0xdceef0) }, // Pale morning sky
        uSunColor: { value: new THREE.Color(0xfffae8) },         // Warm sun specular glint
        uBoatPos: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Gerstner-style multi-frequency sum of sine waves for realistic liquid flow
          float w1 = sin(pos.y * 0.09 + uTime * 1.6) * 0.28;
          float w2 = cos(pos.x * 0.14 + uTime * 2.1 + pos.y * 0.04) * 0.16;
          float w3 = sin((pos.x + pos.y) * 0.06 + uTime * 1.0) * 0.20;
          float micro = sin(pos.y * 0.4 + uTime * 4.0) * 0.04;
          pos.z += w1 + w2 + w3 + micro;

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;

          // Analytical normal approximation for micro-ripples
          float nx = -0.14 * sin(pos.x * 0.14 + uTime * 2.1);
          float ny = -0.09 * cos(pos.y * 0.09 + uTime * 1.6);
          vNormal = normalize(normalMatrix * vec3(nx * 0.6, ny * 0.6, 1.0));

          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uDeepWaterColor;
        uniform vec3 uShallowWaterColor;
        uniform vec3 uSkyReflectionColor;
        uniform vec3 uSunColor;
        uniform vec3 uBoatPos;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          
          // Fresnel calculation
          float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.2);

          // Deep jade to shallow gradient
          vec3 waterBase = mix(uDeepWaterColor, uShallowWaterColor, 0.45);
          // Blend with sky reflection by fresnel
          vec3 finalColor = mix(waterBase, uSkyReflectionColor, fresnel * 0.85);

          // Sun specular glints (sharp bright morning reflections)
          vec3 sunDir = normalize(vec3(0.5, 0.8, -0.8));
          vec3 halfVec = normalize(viewDir + sunDir);
          float spec = pow(max(dot(vNormal, halfVec), 0.0), 64.0);
          finalColor += uSunColor * spec * 0.9;

          // Boat wake ripple (subtle white foam ring near boat)
          float distToBoat = length(vWorldPosition.xz - uBoatPos.xz);
          if (distToBoat < 4.2 && distToBoat > 1.0) {
            float wakeWave = sin(distToBoat * 5.0 - vWorldPosition.y * 4.0) * 0.5 + 0.5;
            float wakeAlpha = smoothstep(4.2, 1.5, distToBoat) * wakeWave * 0.25;
            finalColor = mix(finalColor, vec3(0.95, 0.98, 0.96), wakeAlpha);
          }

          gl_FragColor = vec4(finalColor, 0.94);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.15, -350);
    scene.add(water);

    // 5. PHOTOREALISTIC WOODEN ROWBOAT (Modeled closely on user's reference image!)
    const boatGroup = new THREE.Group();

    // Weathered timber material with warm aged tone
    const woodTextureMat = new THREE.MeshStandardMaterial({
      color: 0x5a3e2a, // Weathered aged cedar / teak
      roughness: 0.88,
      metalness: 0.05,
    });

    const darkTrimWoodMat = new THREE.MeshStandardMaterial({
      color: 0x3d2719, // Dark gunwales and keel
      roughness: 0.85,
    });

    // Hull: Curved plank geometry
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-1.0, -2.6);
    hullShape.quadraticCurveTo(-1.45, 0, -0.9, 2.5);
    hullShape.quadraticCurveTo(0, 3.4, 0.9, 2.5);
    hullShape.quadraticCurveTo(1.45, 0, 1.0, -2.6);
    hullShape.quadraticCurveTo(0, -2.9, -1.0, -2.6);

    const hullExtrudeSettings = {
      depth: 0.72,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.18,
      bevelThickness: 0.18,
    };
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, hullExtrudeSettings);
    hullGeo.rotateX(Math.PI / 2);

    const hullMesh = new THREE.Mesh(hullGeo, woodTextureMat);
    hullMesh.position.y = 0.24;
    boatGroup.add(hullMesh);

    // Inner floorboards
    const floorGeo = new THREE.BoxGeometry(1.4, 0.12, 4.4);
    const floorMesh = new THREE.Mesh(floorGeo, woodTextureMat);
    floorMesh.position.set(0, 0.16, 0);
    boatGroup.add(floorMesh);

    // Gunwale trim rails (outer boat lip)
    const gunwaleGeo = new THREE.TorusGeometry(1.6, 0.06, 6, 24, Math.PI);
    const gunwale1 = new THREE.Mesh(gunwaleGeo, darkTrimWoodMat);
    gunwale1.rotation.x = Math.PI / 2;
    gunwale1.rotation.z = Math.PI / 2;
    gunwale1.scale.set(0.7, 1.6, 1.0);
    gunwale1.position.set(0, 0.62, 0.1);
    boatGroup.add(gunwale1);

    // Wooden thwarts (seating benches)
    const thwartGeo = new THREE.BoxGeometry(1.65, 0.08, 0.5);
    const thwart1 = new THREE.Mesh(thwartGeo, woodTextureMat);
    thwart1.position.set(0, 0.44, -0.5);
    const thwart2 = new THREE.Mesh(thwartGeo, woodTextureMat);
    thwart2.position.set(0, 0.44, 0.9);
    boatGroup.add(thwart1, thwart2);

    // Weathered burlap cloth / folded sack resting on the bench (as seen in user image!)
    const sackGeo = new THREE.BoxGeometry(0.65, 0.14, 0.42);
    const sackMat = new THREE.MeshStandardMaterial({
      color: 0x9b8567, // Natural burlap / sackcloth
      roughness: 0.95,
    });
    const sackMesh = new THREE.Mesh(sackGeo, sackMat);
    sackMesh.position.set(0.35, 0.52, -0.5);
    sackMesh.rotation.y = 0.15;
    boatGroup.add(sackMesh);

    // Coiled mooring rope on the bow bench
    const ropeGeo = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xb5a489, roughness: 0.95 });
    const ropeMesh = new THREE.Mesh(ropeGeo, ropeMat);
    ropeMesh.rotation.x = Math.PI / 2;
    ropeMesh.position.set(0.3, 0.52, -0.85);
    boatGroup.add(ropeMesh);

    // Wooden oars resting across the gunwale
    const oarShaftGeo = new THREE.CylinderGeometry(0.038, 0.045, 3.4, 8);
    const oarBladeGeo = new THREE.BoxGeometry(0.18, 0.03, 0.9);

    // Oar 1
    const oar1Group = new THREE.Group();
    const oar1Shaft = new THREE.Mesh(oarShaftGeo, woodTextureMat);
    const oar1Blade = new THREE.Mesh(oarBladeGeo, woodTextureMat);
    oar1Blade.position.set(0, -1.35, 0);
    oar1Group.add(oar1Shaft, oar1Blade);
    oar1Group.position.set(0.85, 0.46, -0.2);
    oar1Group.rotation.z = Math.PI / 3.4;
    oar1Group.rotation.x = 0.18;
    boatGroup.add(oar1Group);

    scene.add(boatGroup);

    // 6. ATMOSPHERIC SUNBEAMS (Crepuscular light rays)
    const godRayGeo = new THREE.CylinderGeometry(0.5, 12, 45, 8, 1, true);
    const godRayMat = new THREE.MeshBasicMaterial({
      color: 0xfffae8,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    for (let gr = 0; gr < 5; gr++) {
      const ray = new THREE.Mesh(godRayGeo, godRayMat);
      ray.position.set((gr - 2) * 18, 20, -80 - gr * 70);
      ray.rotation.x = Math.PI / 4;
      ray.rotation.z = -Math.PI / 6;
      scene.add(ray);
    }

    // 7. MULTI-TIER INSTANCED PEACH BLOSSOM PETALS
    // Layer A: Drifting in the air (fluttering down from trees)
    const airPetalCount = qualityTier === 'high' ? 80 : 40;
    const petalGeo = new THREE.PlaneGeometry(0.28, 0.38);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf3c1be, // Bright delicate spring pink
      roughness: 0.85,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    });
    const airPetals = new THREE.InstancedMesh(petalGeo, petalMat, airPetalCount);

    const dummy = new THREE.Object3D();
    const airPetalData: Array<{
      pos: THREE.Vector3;
      rot: THREE.Vector3;
      speed: number;
      swayFreq: number;
    }> = [];

    for (let i = 0; i < airPetalCount; i++) {
      const p = {
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 45,
          Math.random() * 16 + 1.5,
          -Math.random() * 700
        ),
        rot: new THREE.Vector3(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        speed: 0.035 + Math.random() * 0.05,
        swayFreq: 1.2 + Math.random() * 2.0,
      };
      airPetalData.push(p);

      dummy.position.copy(p.pos);
      dummy.rotation.set(p.rot.x, p.rot.y, p.rot.z);
      dummy.updateMatrix();
      airPetals.setMatrixAt(i, dummy.matrix);
    }
    airPetals.instanceMatrix.needsUpdate = true;
    scene.add(airPetals);

    // Layer B: Floating petals on the water surface (like in the reference photo!)
    const waterPetalCount = qualityTier === 'high' ? 60 : 30;
    const waterPetals = new THREE.InstancedMesh(petalGeo, petalMat, waterPetalCount);
    const waterPetalData: Array<{ pos: THREE.Vector3; baseZ: number; sway: number }> = [];

    for (let w = 0; w < waterPetalCount; w++) {
      const wp = {
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 28,
          0.02, // Just above water surface
          -Math.random() * 700
        ),
        baseZ: -Math.random() * 700,
        sway: Math.random() * Math.PI * 2,
      };
      waterPetalData.push(wp);

      dummy.position.copy(wp.pos);
      dummy.rotation.set(-Math.PI / 2, 0, Math.random() * Math.PI * 2);
      dummy.scale.set(0.85, 0.85, 0.85);
      dummy.updateMatrix();
      waterPetals.setMatrixAt(w, dummy.matrix);
    }
    waterPetals.instanceMatrix.needsUpdate = true;
    scene.add(waterPetals);

    // 8. RICH SCENIC LANDMARKS & RIVERBANKS

    // Stone Arch Bridge (at Peach Village, like in the photo!)
    const createStoneArchBridge = (zPos: number, xPos: number) => {
      const bridgeGroup = new THREE.Group();
      bridgeGroup.position.set(xPos, 0, zPos);

      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x6e7874, // Weathered river stone
        roughness: 0.92,
      });

      // Arch ring
      const archGeo = new THREE.TorusGeometry(10, 1.4, 8, 20, Math.PI);
      const archMesh = new THREE.Mesh(archGeo, stoneMat);
      archMesh.rotation.z = Math.PI;
      archMesh.rotation.y = Math.PI / 2;
      archMesh.position.set(0, 1.8, 0);
      bridgeGroup.add(archMesh);

      // Deck walkway
      const deckGeo = new THREE.BoxGeometry(4.2, 0.6, 24);
      const deckMesh = new THREE.Mesh(deckGeo, stoneMat);
      deckMesh.position.set(0, 5.2, 0);
      bridgeGroup.add(deckMesh);

      return bridgeGroup;
    };

    // Realistic Peach Blossom Tree Builder
    const createPeachTree = (x: number, y: number, z: number, scale = 1.0) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, y, z);
      treeGroup.scale.set(scale, scale, scale);

      // Gnarled wood trunk
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x483526, roughness: 0.9 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, 5.5, 7), trunkMat);
      trunk.position.y = 2.75;
      trunk.rotation.z = (Math.random() - 0.5) * 0.15;
      treeGroup.add(trunk);

      // Blossom clusters (rich pink foliage)
      const blossomMat = new THREE.MeshStandardMaterial({
        color: 0xf5b5b1, // Soft peach pink
        roughness: 0.88,
      });
      const greenMat = new THREE.MeshStandardMaterial({
        color: 0x58784b, // Fresh spring leaves
        roughness: 0.85,
      });

      for (let c = 0; c < 6; c++) {
        const cluster = new THREE.Mesh(
          new THREE.DodecahedronGeometry(1.4 + (c % 2) * 0.4, 1),
          c % 3 === 0 ? greenMat : blossomMat
        );
        cluster.position.set(
          Math.sin(c * 1.1) * 2.2,
          4.8 + (c % 3) * 0.9,
          Math.cos(c * 1.1) * 2.2
        );
        treeGroup.add(cluster);
      }

      return treeGroup;
    };

    // Earthen mossy riverbanks
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x44533c, roughness: 0.95 });
    for (let b = 0; b < 24; b++) {
      const bank = new THREE.Mesh(
        new THREE.DodecahedronGeometry(6 + (b % 3) * 2, 1),
        earthMat
      );
      const side = b % 2 === 0 ? 1 : -1;
      bank.position.set(side * (18 + (b % 4) * 3), 0.8, -b * 30);
      bank.scale.set(1.5, 0.4, 2.2);
      scene.add(bank);
    }

    // 8.5. MODERN GLASS TOWER SKYLINE ON THE HORIZON (Right side horizon matching Moodboard §4.1)
    const glassTowerMat = new THREE.MeshStandardMaterial({
      color: 0x85abbb,
      roughness: 0.1,
      metalness: 0.7,
      transparent: true,
      opacity: 0.85,
    });
    const glassTowerGroup = new THREE.Group();
    for (let gt = 0; gt < 14; gt++) {
      const towerHeight = 28 + (gt % 5) * 8 + Math.random() * 12;
      const towerWidth = 5 + (gt % 3) * 2;
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(towerWidth, towerHeight, towerWidth),
        glassTowerMat
      );
      tower.position.set(
        50 + (gt % 4) * 12 + Math.random() * 8,
        towerHeight / 2 - 2,
        -180 - gt * 32
      );
      glassTowerGroup.add(tower);
    }
    scene.add(glassTowerGroup);

    // 8.6. FLOATING HOLOGRAPHIC DATA PANELS (Hovering along river path matching Moodboard §4.1)
    const dataPanelGeo = new THREE.PlaneGeometry(5, 3.2);
    const dataPanelMat = new THREE.MeshStandardMaterial({
      color: 0x2f6f8f,
      emissive: 0x2f6f8f,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      roughness: 0.2,
    });
    const dataPanels: THREE.Mesh[] = [];
    for (let dp = 0; dp < 3; dp++) {
      const panel = new THREE.Mesh(dataPanelGeo, dataPanelMat);
      panel.position.set(12 + dp * 4, 3.5 + dp * 0.8, -40 - dp * 90);
      panel.rotation.y = -Math.PI / 6;
      scene.add(panel);
      dataPanels.push(panel);
    }

    // 8.7. FLOATING CHAPTER STOP LANTERNS (Placed at the 5 Lands)
    const chapterLanternMat = new THREE.MeshStandardMaterial({
      color: 0xc99a4b,
      emissive: 0xc99a4b,
      emissiveIntensity: 1.8,
    });
    const stopLanterns: Array<{ mesh: THREE.Mesh; chapterNum: number }> = [
      { mesh: new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.7, 6), chapterLanternMat), chapterNum: 7 },
      { mesh: new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.7, 6), chapterLanternMat), chapterNum: 8 },
      { mesh: new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.7, 6), chapterLanternMat), chapterNum: 9 },
      { mesh: new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.7, 6), chapterLanternMat), chapterNum: 10 },
      { mesh: new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.7, 6), chapterLanternMat), chapterNum: 11 },
    ];
    stopLanterns[0].mesh.position.set(-6, 0.4, -110);
    stopLanterns[1].mesh.position.set(2, 0.4, -230);
    stopLanterns[2].mesh.position.set(4, 0.4, -350);
    stopLanterns[3].mesh.position.set(-18, 0.4, -470);
    stopLanterns[4].mesh.position.set(14, 0.4, -590);

    stopLanterns.forEach((sl) => {
      scene.add(sl.mesh);
      const light = new THREE.PointLight(0xc99a4b, 1.8, 14);
      light.position.set(0, 0.5, 0);
      sl.mesh.add(light);
    });

    // Land 1: Peach Village (-10, 0, -110)
    scene.add(createStoneArchBridge(-115, -10));
    for (let pt = 0; pt < 10; pt++) {
      const side = pt % 2 === 0 ? 1 : -1;
      scene.add(createPeachTree(side * (11 + pt * 2), 0.5, -90 - pt * 6, 1.0 + (pt % 3) * 0.2));
    }

    // Land 2: Bamboo Forest (6, 0, -230)
    const bambooGeo = new THREE.CylinderGeometry(0.09, 0.13, 15, 6);
    const bambooMat = new THREE.MeshStandardMaterial({ color: 0x4a7a50, roughness: 0.8 });
    for (let bf = 0; bf < 40; bf++) {
      const bStalk = new THREE.Mesh(bambooGeo, bambooMat);
      const side = bf % 2 === 0 ? 1 : -1;
      bStalk.position.set(side * (8 + Math.random() * 16), 7.5, -210 - Math.random() * 45);
      bStalk.rotation.z = (Math.random() - 0.5) * 0.08;
      scene.add(bStalk);
    }

    // Land 3: Mountain Valley (8, 0, -350)
    const cliffMat = new THREE.MeshStandardMaterial({ color: 0x47514d, roughness: 0.95 });
    for (let mv = 0; mv < 10; mv++) {
      const cliff = new THREE.Mesh(new THREE.ConeGeometry(9 + mv * 2, 32 + mv * 5, 5), cliffMat);
      const side = mv % 2 === 0 ? 1 : -1;
      cliff.position.set(side * (22 + mv * 3), 15, -330 - mv * 8);
      scene.add(cliff);
    }

    // Land 4: Lantern Bridge (-28, 0, -470)
    scene.add(createStoneArchBridge(-470, -28));

    // Land 5: Forgotten Garden (22, 0, -590)
    const columnMat = new THREE.MeshStandardMaterial({ color: 0x858e89, roughness: 0.9 });
    for (let fg = 0; fg < 6; fg++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 8, 8), columnMat);
      col.position.set(12 + fg * 3.5, 4, -575 - fg * 7);
      if (fg % 2 === 1) col.rotation.z = 0.2;
      scene.add(col);
    }

    // Land 6: The Harbour (0, 0, -700)
    const dockGeo = new THREE.BoxGeometry(7, 0.45, 20);
    const dock = new THREE.Mesh(dockGeo, darkTrimWoodMat);
    dock.position.set(-6, 0.15, -700);
    scene.add(dock);

    // 6 Floating lanterns in Harbour for the case studies
    const floatingLanterns: THREE.Mesh[] = [];
    for (let fl = 0; fl < 6; fl++) {
      const flMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.4, 0.6, 6),
        new THREE.MeshStandardMaterial({
          color: 0xe3b65c, // Soft gold sunlight
          emissive: 0xe3b65c,
          emissiveIntensity: 1.2,
        })
      );
      const angle = (fl / 6) * Math.PI * 2;
      flMesh.position.set(Math.cos(angle) * 8, 0.3, -700 + Math.sin(angle) * 8);
      scene.add(flMesh);
      floatingLanterns.push(flMesh);
    }

    // 9. ANIMATION & CAMERA LOOP
    let currentDampedProgress = isHeroRef.current ? 0.01 : progressRef.current;
    let clock = new THREE.Clock();
    let animationFrameId: number;
    let lastReportedStop = -1;

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Progress smoothing
      const targetProgress = isHeroRef.current ? 0.01 : Math.max(0, Math.min(progressRef.current, 1));
      const delta = targetProgress - currentDampedProgress;
      currentDampedProgress += delta * 0.045;

      // Update Audio speed
      const boatVelocity = Math.abs(delta) * 28;
      riverAudio.updateSpeed(boatVelocity);

      // Water shader time update
      waterMat.uniforms.uTime.value = elapsedTime;

      // Boat position along curve
      const boatPos = riverSpline.getPointAt(currentDampedProgress);
      const tangent = riverSpline.getTangentAt(currentDampedProgress);

      // Realistic boat idle physics (heave, pitch, roll)
      const heave = Math.sin(elapsedTime * 1.6) * 0.025;
      const pitch = Math.sin(elapsedTime * 1.1) * 0.018;
      const roll = Math.cos(elapsedTime * 1.3) * 0.022;

      boatGroup.position.set(boatPos.x, boatPos.y + heave, boatPos.z);
      boatGroup.lookAt(boatPos.clone().add(tangent));
      boatGroup.rotation.z += roll;
      boatGroup.rotation.x += pitch;

      waterMat.uniforms.uBoatPos.value.copy(boatGroup.position);

      // Camera third-person tracking with smooth lerp
      const camOffset = tangent.clone().multiplyScalar(-6.2);
      camOffset.y += 2.2;
      const targetCamPos = boatPos.clone().add(camOffset);
      targetCamPos.x += mouseX * 0.6;
      targetCamPos.y += mouseY * 0.3;

      camera.position.lerp(targetCamPos, 0.055);
      const lookTarget = boatPos.clone().add(tangent.clone().multiplyScalar(4.5));
      lookTarget.y += 0.9;
      camera.lookAt(lookTarget);

      // Animate floating holographic data panels
      dataPanels.forEach((dp, dpIdx) => {
        dp.position.y = 3.5 + Math.sin(elapsedTime * 1.4 + dpIdx) * 0.25;
      });

      // Animate Air Petals
      for (let i = 0; i < airPetalCount; i++) {
        const ap = airPetalData[i];
        ap.pos.y -= ap.speed;
        ap.pos.x += Math.sin(elapsedTime * ap.swayFreq + i) * 0.04;
        ap.rot.x += 0.015;
        ap.rot.y += 0.02;

        if (ap.pos.y < 0) {
          ap.pos.y = 14 + Math.random() * 3;
          ap.pos.x = boatPos.x + (Math.random() - 0.5) * 40;
          ap.pos.z = boatPos.z - Math.random() * 45;
        }

        dummy.position.copy(ap.pos);
        dummy.rotation.set(ap.rot.x, ap.rot.y, ap.rot.z);
        dummy.updateMatrix();
        airPetals.setMatrixAt(i, dummy.matrix);
      }
      airPetals.instanceMatrix.needsUpdate = true;

      // Animate Water Petals (bobbing with water wave)
      for (let w = 0; w < waterPetalCount; w++) {
        const wp = waterPetalData[w];
        dummy.position.set(
          wp.pos.x + Math.sin(elapsedTime * 0.8 + w) * 0.1,
          0.02 + Math.sin(elapsedTime * 1.5 + w) * 0.04,
          wp.pos.z
        );
        dummy.rotation.set(-Math.PI / 2, 0, wp.sway + Math.sin(elapsedTime * 0.4) * 0.1);
        dummy.scale.set(0.85, 0.85, 0.85);
        dummy.updateMatrix();
        waterPetals.setMatrixAt(w, dummy.matrix);
      }
      waterPetals.instanceMatrix.needsUpdate = true;

      // Bob stop lanterns
      stopLanterns.forEach((sl, sIdx) => {
        sl.mesh.position.y = 0.4 + Math.sin(elapsedTime * 1.7 + sIdx) * 0.06;
      });

      // Bob floating lanterns
      floatingLanterns.forEach((lantern, lIdx) => {
        lantern.position.y = 0.3 + Math.sin(elapsedTime * 1.8 + lIdx) * 0.05;
      });

      // Chapter Stop Detection
      const stops = [
        { p: 0.12, ch: 7, title: 'Analytics and Leadership', kicker: 'Peach Village' },
        { p: 0.30, ch: 8, title: 'Competing on Analytics', kicker: 'Bamboo Forest' },
        { p: 0.48, ch: 9, title: "The Analytics Leader's 90-Day Playbook", kicker: 'Mountain Valley' },
        { p: 0.66, ch: 10, title: 'Making It Happen', kicker: 'Lantern Bridge' },
        { p: 0.84, ch: 11, title: 'Common Pitfalls', kicker: 'Forgotten Garden' },
        { p: 1.0, ch: 12, title: 'Case Studies Harbour', kicker: 'The Harbour' },
      ];

      const active = stops.find((s) => Math.abs(currentDampedProgress - s.p) < 0.035);
      if (active) {
        if (lastReportedStop !== active.ch) {
          lastReportedStop = active.ch;
          setActiveStopNotice({
            number: active.ch,
            title: active.title,
            kicker: active.kicker,
          });
          if (onReachStop && active.ch <= 11) {
            onReachStop(active.ch);
          }
        }
      } else {
        if (lastReportedStop !== -1) {
          lastReportedStop = -1;
          setActiveStopNotice(null);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [qualityTier]);

  return (
    <div className="relative w-full h-full select-none">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />

      {/* Floating Stop Indicator when arriving at a chapter - Styled for Bright Theme */}
      {activeStopNotice && !isHeroMode && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 animate-memory pointer-events-auto">
          <div className="bg-white/92 border border-[#2F6F6A]/30 rounded-2xl p-4 md:p-6 text-center backdrop-blur-md shadow-2xl max-w-sm md:max-w-md">
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-[#85590A] block mb-1 font-semibold">
              ✦ {activeStopNotice.kicker} ✦
            </span>
            <h3 className="text-xl md:text-2xl font-serif text-[#1E2B26] mb-3">
              {activeStopNotice.title}
            </h3>
            {activeStopNotice.number <= 11 ? (
              <button
                onClick={() => onReachStop && onReachStop(activeStopNotice.number)}
                className="bg-[#1F4F4B] text-[#F7F3EA] px-6 py-2.5 rounded-full font-medium text-xs tracking-wider uppercase hover:bg-[#2F6F6A] transition-all shadow-lg shadow-[#1F4F4B]/20 cursor-pointer"
              >
                Open Chapter {activeStopNotice.number}
              </button>
            ) : (
              <a
                href="/case-studies/"
                className="inline-block bg-[#1F4F4B] text-[#F7F3EA] px-6 py-2.5 rounded-full font-medium text-xs tracking-wider uppercase hover:bg-[#2F6F6A] transition-all cursor-pointer"
              >
                Explore All Case Studies
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
