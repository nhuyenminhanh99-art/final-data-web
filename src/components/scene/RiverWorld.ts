import * as THREE from 'three';

/**
 * World-space authoritative River and Terrain System for "The River of Insights"
 * Standard Scale: 1 world unit = 1 meter
 */

export interface RiverStop {
  u: number;
  chapterNumber: number;
  title: string;
  regionName: string;
  description: string;
}

export const CANONICAL_RIVER_STOPS: RiverStop[] = [
  { u: 0.10, chapterNumber: 7, title: 'Analytics and Leadership', regionName: 'Peach Village', description: 'The four leadership foundations and three pivotal organizational roles.' },
  { u: 0.15, chapterNumber: 8, title: 'Competing on Analytics', regionName: 'Bamboo Forest', description: 'Analytics maturity stages and centralized vs embedded team structures.' },
  { u: 0.20, chapterNumber: 9, title: "The Analytics Leader's 90-Day Playbook", regionName: 'Mountain Valley', description: 'The 30-60-90 day strategic roadmap and quick-win prioritization.' },
  { u: 0.25, chapterNumber: 10, title: 'Making It Happen', regionName: 'Lantern Bridge', description: 'Stakeholder alignment, change management and structured persuasion.' },
  { u: 0.30, chapterNumber: 11, title: 'Common Pitfalls', regionName: 'Forgotten Garden', description: 'The 36 organizational pitfalls across sponsors, leads and analysts.' },
];

export class RiverWorld {
  public static readonly SPLINE_POINTS: THREE.Vector3[] = [
    new THREE.Vector3(0, 0, 0),         // u = 0.00: Start / Hero
    new THREE.Vector3(7, 0, -18),       // u = 0.05: Gentle entrance bend
    new THREE.Vector3(-7, 0, -36),      // u = 0.10: Peach Village (Stop 1, Ch 7)
    new THREE.Vector3(-14, 0, -62),     // u = 0.17: Meander left
    new THREE.Vector3(5, 0, -90),       // u = 0.25: Bamboo Forest (Stop 2, Ch 8)
    new THREE.Vector3(14, 0, -118),     // u = 0.32: Canyon bend
    new THREE.Vector3(6, 0, -145),      // u = 0.40: Mountain Valley (Stop 3, Ch 9)
    new THREE.Vector3(-10, 0, -172),    // u = 0.48: Gorge bend
    new THREE.Vector3(-15, 0, -200),    // u = 0.55: Lantern Bridge (Stop 4, Ch 10)
    new THREE.Vector3(-4, 0, -228),     // u = 0.62: Scenic widening
    new THREE.Vector3(12, 0, -255),     // u = 0.70: Forgotten Garden (Stop 5, Ch 11)
    new THREE.Vector3(6, 0, -282),      // u = 0.78: Harbour approaches
    new THREE.Vector3(0, 0, -305),      // u = 0.85: The Harbour (Stop 6, Ch 12)
    new THREE.Vector3(0, 0, -330),      // u = 1.00: Open Bay Horizon
  ];

  public readonly centerlineSpline: THREE.CatmullRomCurve3;
  public readonly totalLengthMeters: number;

  constructor() {
    this.centerlineSpline = new THREE.CatmullRomCurve3(RiverWorld.SPLINE_POINTS, false, 'centripetal', 0.5);
    this.totalLengthMeters = this.centerlineSpline.getLength();
  }

  /**
   * Evaluates canonical river position P(u) at progress u.
   * Seamlessly extrapolates upstream (u < 0) and downstream (u > 1)
   */
  public getPosition(u: number): THREE.Vector3 {
    if (u < 0) {
      const p0 = this.centerlineSpline.getPointAt(0);
      const t0 = this.centerlineSpline.getTangentAt(0).normalize();
      return p0.clone().add(t0.clone().multiplyScalar(u * this.totalLengthMeters));
    } else if (u > 1) {
      const p1 = this.centerlineSpline.getPointAt(1);
      const t1 = this.centerlineSpline.getTangentAt(1).normalize();
      return p1.clone().add(t1.clone().multiplyScalar((u - 1) * this.totalLengthMeters));
    }
    return this.centerlineSpline.getPointAt(u);
  }

  /**
   * Evaluates normalized tangent T(u) along river flow
   */
  public getTangent(u: number): THREE.Vector3 {
    if (u < 0) {
      return this.centerlineSpline.getTangentAt(0).normalize();
    } else if (u > 1) {
      return this.centerlineSpline.getTangentAt(1).normalize();
    }
    return this.centerlineSpline.getTangentAt(u).normalize();
  }

  /**
   * Evaluates normalized horizontal normal N(u) pointing to right bank
   */
  public getNormal(u: number): THREE.Vector3 {
    const tangent = this.getTangent(u);
    // N = normalize(T x UP) = (T.z, 0, -T.x)
    return new THREE.Vector3(tangent.z, 0, -tangent.x).normalize();
  }

  /**
   * Evaluates physical river width W(u) in meters
   */
  public getWidth(u: number): number {
    if (u < 0) {
      // Upstream headwaters spring lake
      return 22 + Math.min(Math.abs(u) * 90, 16);
    } else if (u > 1) {
      // Harbour expands into vast coastal bay
      return 38 + (u - 1) * 380;
    }
    // Canonical width along navigable corridor
    if (u >= 0.82) {
      const t = (u - 0.82) / 0.18;
      return 24 + t * 14; // 24m -> 38m
    } else if (u >= 0.50 && u <= 0.60) {
      const dist = Math.abs(u - 0.55) / 0.05;
      return 15 + dist * 5; // 15m to 20m
    } else if (u >= 0.20 && u <= 0.30) {
      return 17;
    } else if (u <= 0.14) {
      return 21;
    }
    return 22;
  }

  /**
   * Evaluates physical river depth D(u) in meters
   */
  public getDepth(u: number): number {
    if (u < 0) return 3.2;
    if (u > 1) return 4.8;
    if (u >= 0.50 && u <= 0.60) {
      return 4.6;
    } else if (u >= 0.80) {
      return 4.2;
    }
    return 3.2;
  }

  /**
   * Evaluates world position of Left Bank at u
   */
  public getLeftBank(u: number): THREE.Vector3 {
    const p = this.getPosition(u);
    const n = this.getNormal(u);
    const halfWidth = this.getWidth(u) * 0.5;
    return p.clone().sub(n.clone().multiplyScalar(halfWidth));
  }

  /**
   * Evaluates world position of Right Bank at u
   */
  public getRightBank(u: number): THREE.Vector3 {
    const p = this.getPosition(u);
    const n = this.getNormal(u);
    const halfWidth = this.getWidth(u) * 0.5;
    return p.clone().add(n.clone().multiplyScalar(halfWidth));
  }

  /**
   * Analytical terrain height function H(x, z).
   * Defines a continuous, carved terrain depression containing the river.
   * Returns exact elevation in meters above water level (water level is y = 0).
   */
  public getTerrainHeight(x: number, z: number): number {
    // 1. Find nearest progress u on spline via sampling and local refinement
    const nearest = this.getClosestSplineParameter(x, z);
    const p = this.getPosition(nearest.u);
    const halfWidth = this.getWidth(nearest.u) * 0.5;
    const distToCenter = nearest.distance;

    // Organic shoreline micro-undulation (deterministic, zero random jitter)
    const shorelineNoise = Math.sin(z * 0.08 + x * 0.05) * 0.6 + Math.cos(z * 0.15) * 0.3;
    const effectiveHalfWidth = Math.max(4, halfWidth + shorelineNoise);

    if (distToCenter < effectiveHalfWidth) {
      // Inside river channel bed: below water level
      const depth = this.getDepth(nearest.u);
      const ratio = distToCenter / effectiveHalfWidth;
      // Parabolic riverbed trough
      return -depth * (1.0 - ratio * ratio);
    }

    // On the riverbank or land
    const distFromWater = distToCenter - effectiveHalfWidth;

    // Gentle shoreline slope up to 1.5m elevation over first 4m
    let elevation = 0;
    if (distFromWater < 4.0) {
      const t = distFromWater / 4.0;
      elevation = t * 1.5;
    } else if (distFromWater < 14.0) {
      // Bank terrace rising to 3.2m
      const t = (distFromWater - 4.0) / 10.0;
      elevation = 1.5 + t * 1.7;
    } else {
      // Surrounding hills / valley bluffs
      const extraDist = distFromWater - 14.0;
      let regionHillHeight = 8.0;

      // Region-specific topography:
      // Mountain Valley (u ~ 0.40) & Lantern Gorge (u ~ 0.55) have high dramatic cliffs (24-32m)
      if (nearest.u >= 0.35 && nearest.u <= 0.62) {
        regionHillHeight = 26.0;
      } else if (nearest.u >= 0.18 && nearest.u <= 0.32) {
        regionHillHeight = 12.0; // Bamboo forest foothills
      }

      const hillFactor = Math.min(extraDist / 25.0, 1.0);
      elevation = 3.2 + hillFactor * regionHillHeight;
    }

    // Deterministic organic terrain contour
    const macroNoise = Math.sin(x * 0.07 + z * 0.04) * 0.8 + Math.cos(x * 0.12 - z * 0.06) * 0.5;
    return Math.max(0.1, elevation + macroNoise);
  }

  /**
   * Fast nearest spline parameter finder (deterministic, accurate within 0.1m)
   */
  public getClosestSplineParameter(x: number, z: number): { u: number; distance: number } {
    const samples = 150;
    let closestU = 0;
    let minSqDist = Infinity;

    for (let i = 0; i <= samples; i++) {
      const u = i / samples;
      const pt = this.centerlineSpline.getPointAt(u);
      const dx = pt.x - x;
      const dz = pt.z - z;
      const sqDist = dx * dx + dz * dz;
      if (sqDist < minSqDist) {
        minSqDist = sqDist;
        closestU = u;
      }
    }

    // Local refinement
    const step = 1.0 / (samples * 4);
    const uMin = Math.max(0, closestU - step * 2);
    const uMax = Math.min(1, closestU + step * 2);
    for (let u = uMin; u <= uMax; u += step * 0.5) {
      const pt = this.centerlineSpline.getPointAt(u);
      const dx = pt.x - x;
      const dz = pt.z - z;
      const sqDist = dx * dx + dz * dz;
      if (sqDist < minSqDist) {
        minSqDist = sqDist;
        closestU = u;
      }
    }

    return { u: closestU, distance: Math.sqrt(minSqDist) };
  }

  /**
   * Generates a coherent, contiguous River Water Ribbon Mesh
   * Swept along the river from headwaters (u = -0.06) to harbour bay (u = 1.10)
   * Extends under riverbanks to completely prevent any geometric gaps or tears
   */
  public createRiverWaterGeometry(): THREE.BufferGeometry {
    const lengthSegments = 260; // Smooth ribbon from upstream lake to harbour
    const widthSegments = 12;   // 12 cross-sections across river width
    const vertexCount = (lengthSegments + 1) * (widthSegments + 1);
    const indexCount = lengthSegments * widthSegments * 6;

    const positions = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const waterDepthAttributes = new Float32Array(vertexCount); // 0 = shallow bank, 1 = deep center
    const indices = new Uint32Array(indexCount);

    const uMin = -0.06;
    const uMax = 1.10;

    let vIdx = 0;
    let uvIdx = 0;
    let dIdx = 0;

    for (let i = 0; i <= lengthSegments; i++) {
      const u = uMin + (i / lengthSegments) * (uMax - uMin);
      const centerPos = this.getPosition(u);
      const normal = this.getNormal(u);
      const halfWidth = this.getWidth(u) * 0.5;

      // Extended water width so water securely underlaps both banks by 4.0m
      const waterHalfWidth = halfWidth + 4.0;

      for (let j = 0; j <= widthSegments; j++) {
        // v goes from -1 (left bank) to +1 (right bank)
        const v = (j / widthSegments) * 2.0 - 1.0;
        const lateralOffset = v * waterHalfWidth;

        // Position: X, Y (water level = 0.0), Z
        positions[vIdx++] = centerPos.x + normal.x * lateralOffset;
        positions[vIdx++] = 0.0; // Waterline plane
        positions[vIdx++] = centerPos.z + normal.z * lateralOffset;

        // UV coordinates: u along river length, v across river width
        uvs[uvIdx++] = u * 48.0;
        uvs[uvIdx++] = (v + 1.0) * 0.5;

        // Depth attribute: 0 at shoreline under bank, 1 at central channel
        const distFromCenter = Math.abs(lateralOffset);
        const centerProximity = Math.max(0.0, 1.0 - (distFromCenter / halfWidth));
        waterDepthAttributes[dIdx++] = centerProximity;
      }
    }

    let iIdx = 0;
    const stride = widthSegments + 1;
    for (let i = 0; i < lengthSegments; i++) {
      for (let j = 0; j < widthSegments; j++) {
        const a = i * stride + j;
        const b = (i + 1) * stride + j;
        const c = (i + 1) * stride + (j + 1);
        const d = i * stride + (j + 1);

        // Quad = two triangles (a, b, d) and (b, c, d)
        indices[iIdx++] = a;
        indices[iIdx++] = b;
        indices[iIdx++] = d;

        indices[iIdx++] = b;
        indices[iIdx++] = c;
        indices[iIdx++] = d;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute('waterDepth', new THREE.BufferAttribute(waterDepthAttributes, 1));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    return geometry;
  }

  /**
   * Generates a coherent Terrain Valley Mesh enclosing the river
   * Swept from u = -0.06 to 1.10 and extending 140 meters inland to eliminate white boundaries
   */
  public createTerrainCorridorGeometry(side: 'left' | 'right'): THREE.BufferGeometry {
    const lengthSegments = 220;
    const lateralSegments = 10;
    const maxInlandDistance = 140.0; // Extends 140 meters inland into natural mountain ridges

    const vertexCount = (lengthSegments + 1) * (lateralSegments + 1);
    const indexCount = lengthSegments * lateralSegments * 6;

    const positions = new Float32Array(vertexCount * 3);
    const colors = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices = new Uint32Array(indexCount);

    const uMin = -0.06;
    const uMax = 1.10;
    const sideSign = side === 'right' ? 1.0 : -1.0;

    let vIdx = 0;
    let cIdx = 0;
    let uvIdx = 0;

    for (let i = 0; i <= lengthSegments; i++) {
      const u = uMin + (i / lengthSegments) * (uMax - uMin);
      const centerPos = this.getPosition(u);
      const normal = this.getNormal(u);
      const halfWidth = this.getWidth(u) * 0.5;

      for (let j = 0; j <= lateralSegments; j++) {
        const t = j / lateralSegments; // 0 = exact bank edge, 1 = deep inland mountain ridge
        const inlandDist = t * t * maxInlandDistance; // Quadratic expansion for smooth near bank & dramatic far ridge
        const totalOffset = sideSign * (halfWidth + inlandDist);

        const worldX = centerPos.x + normal.x * totalOffset;
        const worldZ = centerPos.z + normal.z * totalOffset;

        // Base elevation from continuous terrain height function
        let worldY = this.getTerrainHeight(worldX, worldZ);

        // Ground bank edge at waterline firmly above water plane
        if (j === 0) {
          worldY = Math.max(0.06, worldY);
        }

        // Add progressive mountain ridge rise on outer inland margins
        if (t > 0.3) {
          const ridgeFactor = (t - 0.3) / 0.7;
          worldY += ridgeFactor * ridgeFactor * 26.0;
        }

        // Upstream mountain cirque amphitheater wrapping behind u = 0
        if (u < -0.02) {
          const headwaterRise = Math.abs(u + 0.02) * 220.0;
          worldY += headwaterRise * (0.4 + t * 0.6);
        }

        positions[vIdx++] = worldX;
        positions[vIdx++] = worldY;
        positions[vIdx++] = worldZ;

        // Rich Soil & Vegetation Layering
        let r = 0.22, g = 0.28, b = 0.20;

        if (worldY < 0.6) {
          // Wet dark river silt at shoreline
          const wetFactor = Math.max(0.0, worldY / 0.6);
          r = THREE.MathUtils.lerp(0.12, 0.22, wetFactor);
          g = THREE.MathUtils.lerp(0.10, 0.19, wetFactor);
          b = THREE.MathUtils.lerp(0.08, 0.15, wetFactor);
        } else if (worldY < 2.2) {
          // Sandy loam, dry river gravel and terrace silt
          const terraceFactor = (worldY - 0.6) / 1.6;
          r = THREE.MathUtils.lerp(0.24, 0.23, terraceFactor);
          g = THREE.MathUtils.lerp(0.21, 0.29, terraceFactor);
          b = THREE.MathUtils.lerp(0.16, 0.19, terraceFactor);
        } else {
          // Highland moss, meadow grass, and mountain soil
          const meadowNoise = (Math.sin(worldX * 0.12 + worldZ * 0.08) * 0.5 + 0.5) * 0.08;
          r = 0.20 + meadowNoise * 0.5;
          g = 0.28 + meadowNoise;
          b = 0.18 + meadowNoise * 0.4;

          // Upper high ridges blend into atmospheric foggy mountain tones
          if (worldY > 14.0) {
            const cliffBlend = Math.min((worldY - 14.0) / 18.0, 1.0);
            r = THREE.MathUtils.lerp(r, 0.45, cliffBlend * 0.65);
            g = THREE.MathUtils.lerp(g, 0.52, cliffBlend * 0.65);
            b = THREE.MathUtils.lerp(b, 0.50, cliffBlend * 0.65);
          }
        }

        colors[cIdx++] = r;
        colors[cIdx++] = g;
        colors[cIdx++] = b;

        uvs[uvIdx++] = u * 24.0;
        uvs[uvIdx++] = t;
      }
    }

    let iIdx = 0;
    const stride = lateralSegments + 1;
    for (let i = 0; i < lengthSegments; i++) {
      for (let j = 0; j < lateralSegments; j++) {
        const a = i * stride + j;
        const b = (i + 1) * stride + j;
        const c = (i + 1) * stride + (j + 1);
        const d = i * stride + (j + 1);

        if (side === 'right') {
          indices[iIdx++] = a;
          indices[iIdx++] = b;
          indices[iIdx++] = d;

          indices[iIdx++] = b;
          indices[iIdx++] = c;
          indices[iIdx++] = d;
        } else {
          // Invert winding for left bank so normals point upward
          indices[iIdx++] = a;
          indices[iIdx++] = d;
          indices[iIdx++] = b;

          indices[iIdx++] = b;
          indices[iIdx++] = d;
          indices[iIdx++] = c;
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    return geometry;
  }

  /**
   * Distant Panoramic Mountain Backdrop (Radius ~520m)
   * Wraps around the entire horizon to completely eliminate white voids
   */
  public createDistantMountainBackdrop(): THREE.Mesh {
    const segments = 48;
    const radius = 540.0;
    const center = new THREE.Vector3(0, 0, -375); // Midpoint of river

    const geometry = new THREE.CylinderGeometry(radius, radius * 1.08, 90, segments, 4, true);
    geometry.translate(center.x, 38, center.z);

    // Apply organic mountain peak height variation
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 20) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const peakNoise = Math.sin(x * 0.015 + z * 0.012) * 22.0 + Math.cos(x * 0.035 - z * 0.02) * 12.0;
        pos.setY(i, y + peakNoise);
      }
    }
    geometry.computeVertexNormals();

    const mountainMat = new THREE.MeshBasicMaterial({
      color: 0x98b5b1, // Misty distant mountain tone matching atmospheric fog
      side: THREE.BackSide,
      fog: true,
    });

    return new THREE.Mesh(geometry, mountainMat);
  }

  /**
   * Debug Mode Visualization Generator (?journeydebug=1)
   */
  public createDebugVisualizationGroup(): THREE.Group {
    const debugGroup = new THREE.Group();
    debugGroup.name = 'RiverWorldDebugVisualization';

    // 1. Centerline Spline (Bright Yellow Line)
    const centerPoints = this.centerlineSpline.getPoints(240);
    const centerGeo = new THREE.BufferGeometry().setFromPoints(centerPoints);
    const centerMat = new THREE.LineBasicMaterial({ color: 0xffe600, linewidth: 3 });
    const centerLine = new THREE.Line(centerGeo, centerMat);
    centerLine.position.y = 0.4; // Slightly above water
    debugGroup.add(centerLine);

    // 2. Left Bank Boundary (Cyan Line)
    const leftPoints: THREE.Vector3[] = [];
    const rightPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 240; i++) {
      const u = i / 240;
      const lp = this.getLeftBank(u);
      lp.y = 0.3;
      leftPoints.push(lp);

      const rp = this.getRightBank(u);
      rp.y = 0.3;
      rightPoints.push(rp);
    }

    const leftGeo = new THREE.BufferGeometry().setFromPoints(leftPoints);
    const leftMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 2 });
    debugGroup.add(new THREE.Line(leftGeo, leftMat));

    const rightGeo = new THREE.BufferGeometry().setFromPoints(rightPoints);
    const rightMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, linewidth: 2 });
    debugGroup.add(new THREE.Line(rightGeo, rightMat));

    // 2.5. Navigable Corridor Boundaries (Lime Green Lines)
    // Constrained bounds that the boat can never cross
    const corridorLeft: THREE.Vector3[] = [];
    const corridorRight: THREE.Vector3[] = [];
    for (let i = 0; i <= 240; i++) {
      const u = i / 240;
      const p = this.getPosition(u);
      const n = this.getNormal(u);
      const halfW = this.getWidth(u) * 0.5;
      const maxOffset = Math.max(0.5, halfW - 2.6);

      const cl = p.clone().sub(n.clone().multiplyScalar(maxOffset));
      cl.y = 0.35;
      corridorLeft.push(cl);

      const cr = p.clone().add(n.clone().multiplyScalar(maxOffset));
      cr.y = 0.35;
      corridorRight.push(cr);
    }
    const cLeftGeo = new THREE.BufferGeometry().setFromPoints(corridorLeft);
    const cLeftMat = new THREE.LineBasicMaterial({ color: 0x00ff66, linewidth: 1.5 });
    debugGroup.add(new THREE.Line(cLeftGeo, cLeftMat));

    const cRightGeo = new THREE.BufferGeometry().setFromPoints(corridorRight);
    const cRightMat = new THREE.LineBasicMaterial({ color: 0x00ff66, linewidth: 1.5 });
    debugGroup.add(new THREE.Line(cRightGeo, cRightMat));

    // 3. Stop Markers (Pillars with glowing rings)
    CANONICAL_RIVER_STOPS.forEach((stop) => {
      const p = this.getPosition(stop.u);
      const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 14, 8);
      const pillarMat = new THREE.MeshBasicMaterial({ color: 0xff0055, wireframe: true });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(p.x, 7, p.z);
      debugGroup.add(pillar);

      // Width indicator ring at stop
      const width = this.getWidth(stop.u);
      const ringGeo = new THREE.RingGeometry(width * 0.48, width * 0.52, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xff9900, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(p.x, 0.5, p.z);
      debugGroup.add(ring);
    });

    return debugGroup;
  }
}

// Singleton world instance
export const riverWorld = new RiverWorld();
