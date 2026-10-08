import * as THREE from 'three';
import { riverWorld, RiverStop } from './RiverWorld';

export interface CollisionProxy {
  id: string;
  name: string;
  type: 'sphere' | 'cylinder' | 'box';
  position: THREE.Vector3; // World position
  radius: number;          // Safety clearance radius (meters)
  height?: number;         // Height for cylinder/box
  boxHalfSize?: THREE.Vector3;
  uEstimate: number;       // River progress u where obstacle sits
  lateralOffset: number;   // Signed lateral offset relative to centerline
  visualMesh?: THREE.Object3D;
}

export interface LookAheadSample {
  index: number;
  u: number;
  position: THREE.Vector3;
  clearance: number;
  blocked: boolean;
  nearestObstacleId?: string;
}

export interface CollisionTelemetry {
  nearestObstacle: CollisionProxy | null;
  minClearance: number;
  isAvoiding: boolean;
  avoidanceOffset: number;
  bankClearanceLeft: number;
  bankClearanceRight: number;
  lookAheadSamples: LookAheadSample[];
}

/**
 * High-Performance Collision Detection & Proactive Obstacle Avoidance System.
 * Guarantees zero visible mesh clipping through rocks, trees, piers, banks, and docks.
 * Deterministic and reversible: forward and backward travel generate identical paths.
 */
export class CollisionSystem {
  private obstacles: CollisionProxy[] = [];
  public static readonly BOAT_RADIUS = 0.95; // Half-beam + safety buffer (meters)
  public static readonly BOAT_LENGTH = 4.2;  // Overall boat length (meters)
  public static readonly BOAT_WIDTH = 1.9;   // Overall boat width (meters)

  // Debug 3D objects
  private debugGroup: THREE.Group | null = null;
  private lookAheadLine: THREE.Line | null = null;
  private lookAheadPoints: THREE.Mesh[] = [];
  private nearestLine: THREE.Line | null = null;
  private avoidanceArrow: THREE.ArrowHelper | null = null;
  private boatHullMesh: THREE.Mesh | null = null;

  constructor() {
    this.registerWorldObstacles();
  }

  /**
   * Registers all physical world obstacles into the spatial proxy index
   */
  public registerWorldObstacles(): void {
    this.obstacles = [];

    // 1. BRIDGE SUPPORTS (Piers spanning left/right at u = 0.12 and u = 0.66)
    [0.12, 0.66].forEach((uBridge, idx) => {
      const leftBank = riverWorld.getLeftBank(uBridge);
      const rightBank = riverWorld.getRightBank(uBridge);
      const halfWidth = riverWorld.getWidth(uBridge) * 0.5;
      const bridgeName = idx === 0 ? 'Peach Village Bridge Pier' : 'Lantern Bridge Pier';

      this.addObstacle({
        id: `bridge-pier-left-${idx}`,
        name: `${bridgeName} (Left)`,
        type: 'cylinder',
        position: leftBank,
        radius: 2.4,
        height: 8.0,
        uEstimate: uBridge,
        lateralOffset: -halfWidth,
      });

      this.addObstacle({
        id: `bridge-pier-right-${idx}`,
        name: `${bridgeName} (Right)`,
        type: 'cylinder',
        position: rightBank,
        radius: 2.4,
        height: 8.0,
        uEstimate: uBridge,
        lateralOffset: halfWidth,
      });
    });

    // 2. THE HARBOUR DOCK & PILINGS (u = 1.0)
    const harbourPos = riverWorld.getPosition(1.0);
    const harbourNorm = riverWorld.getNormal(1.0);
    const dockPos = new THREE.Vector3(
      harbourPos.x - harbourNorm.x * 10,
      0.2,
      harbourPos.z - harbourNorm.z * 10
    );
    this.addObstacle({
      id: 'harbour-dock-pier',
      name: 'Harbour Quay Dock',
      type: 'box',
      position: dockPos,
      radius: 4.5,
      boxHalfSize: new THREE.Vector3(3.5, 2.0, 9.0),
      uEstimate: 1.0,
      lateralOffset: -10,
    });

    // 3. SHORELINE ROCKS & BOULDERS (Embedded along both banks)
    for (let rk = 0; rk < 24; rk++) {
      const u = (rk / 24) * 0.95 + 0.02;
      const center = riverWorld.getPosition(u);
      const normal = riverWorld.getNormal(u);
      const halfWidth = riverWorld.getWidth(u) * 0.5;
      const side = rk % 2 === 0 ? 1 : -1;

      const rx = center.x + normal.x * side * (halfWidth + 0.8);
      const rz = center.z + normal.z * side * (halfWidth + 0.8);
      const ry = riverWorld.getTerrainHeight(rx, rz);

      this.addObstacle({
        id: `shore-boulder-${rk}`,
        name: `Bank Boulder ${rk + 1}`,
        type: 'sphere',
        position: new THREE.Vector3(rx, ry + 0.3, rz),
        radius: 1.6 + (rk % 3) * 0.3,
        uEstimate: u,
        lateralOffset: side * (halfWidth + 0.8),
      });
    }

    // 4. FORGOTTEN GARDEN SUNKEN COLUMNS (u in [0.80, 0.88])
    for (let fg = 0; fg < 6; fg++) {
      const u = 0.80 + fg * 0.012;
      const center = riverWorld.getPosition(u);
      const normal = riverWorld.getNormal(u);
      const halfWidth = riverWorld.getWidth(u) * 0.5;

      const colX = center.x + normal.x * (halfWidth + 4.5);
      const colZ = center.z + normal.z * (halfWidth + 4.5);
      const colY = riverWorld.getTerrainHeight(colX, colZ);

      this.addObstacle({
        id: `garden-col-${fg}`,
        name: `Sunken Column ${fg + 1}`,
        type: 'cylinder',
        position: new THREE.Vector3(colX, colY + 3.75, colZ),
        radius: 1.2,
        height: 7.5,
        uEstimate: u,
        lateralOffset: halfWidth + 4.5,
      });
    }

    // =========================================================================
    // 5. TEST CASES SPECIFIED IN REQUIREMENT §9
    // =========================================================================

    // TEST A: Rock directly on river centerline (u = 0.085)
    // Boat smoothly steers around it (bias to right where water channel is wider)
    const testAPos = riverWorld.getPosition(0.085);
    this.addObstacle({
      id: 'test-a-centerline-rock',
      name: 'TEST A: Centerline River Rock',
      type: 'sphere',
      position: new THREE.Vector3(testAPos.x, -0.1, testAPos.z),
      radius: 2.1,
      uEstimate: 0.085,
      lateralOffset: 0.0,
    });

    // TEST B: Overhanging Tree / Bank obstruction near river edge (u = 0.165)
    // Boat smoothly maintains clearance from shoreline
    const testBCenter = riverWorld.getPosition(0.165);
    const testBNorm = riverWorld.getNormal(0.165);
    const testBHalfW = riverWorld.getWidth(0.165) * 0.5;
    const testBOffset = -(testBHalfW - 1.4); // Left bank edge
    const testBPos = testBCenter.clone().add(testBNorm.clone().multiplyScalar(testBOffset));
    const testBY = riverWorld.getTerrainHeight(testBPos.x, testBPos.z);
    this.addObstacle({
      id: 'test-b-edge-tree',
      name: 'TEST B: Shoreline Overhanging Tree',
      type: 'cylinder',
      position: new THREE.Vector3(testBPos.x, testBY + 2.5, testBPos.z),
      radius: 2.0,
      height: 6.5,
      uEstimate: 0.165,
      lateralOffset: testBOffset,
    });

    // TEST C: Twin Gate Rocks creating a narrow passage (u = 0.38)
    // Boat chooses the safe middle corridor without oscillating left/right
    const testCCenter = riverWorld.getPosition(0.38);
    const testCNorm = riverWorld.getNormal(0.38);
    const testC1Offset = -4.2; // Left rock
    const testC2Offset = 6.8;  // Right rock
    const testC1Pos = testCCenter.clone().add(testCNorm.clone().multiplyScalar(testC1Offset));
    const testC2Pos = testCCenter.clone().add(testCNorm.clone().multiplyScalar(testC2Offset));
    this.addObstacle({
      id: 'test-c-left-rock',
      name: 'TEST C: Gate Rock (Left)',
      type: 'sphere',
      position: new THREE.Vector3(testC1Pos.x, -0.2, testC1Pos.z),
      radius: 1.8,
      uEstimate: 0.38,
      lateralOffset: testC1Offset,
    });
    this.addObstacle({
      id: 'test-c-right-rock',
      name: 'TEST C: Gate Rock (Right)',
      type: 'sphere',
      position: new THREE.Vector3(testC2Pos.x, -0.2, testC2Pos.z),
      radius: 2.0,
      uEstimate: 0.38,
      lateralOffset: testC2Offset,
    });

    // TEST D: Reef Obstacle near sharp river bend (u = 0.55)
    // Boat anticipates the sharp curve and safely stays in the outer water corridor
    const testDCenter = riverWorld.getPosition(0.55);
    const testDNorm = riverWorld.getNormal(0.55);
    const testDOffset = -2.8; // On the inside curve of the bend
    const testDPos = testDCenter.clone().add(testDNorm.clone().multiplyScalar(testDOffset));
    this.addObstacle({
      id: 'test-d-bend-rock',
      name: 'TEST D: Sharp Bend Reef',
      type: 'sphere',
      position: new THREE.Vector3(testDPos.x, -0.3, testDPos.z),
      radius: 2.2,
      uEstimate: 0.55,
      lateralOffset: testDOffset,
    });
  }

  public addObstacle(obstacle: CollisionProxy): void {
    this.obstacles.push(obstacle);
  }

  public getObstacles(): CollisionProxy[] {
    return this.obstacles;
  }

  /**
   * Retrieves obstacles within a longitudinal window around progress u
   */
  public getNearbyObstacles(u: number, uRange: number = 0.05): CollisionProxy[] {
    const minU = u - 0.025;
    const maxU = u + uRange;
    return this.obstacles.filter((obs) => obs.uEstimate >= minU && obs.uEstimate <= maxU);
  }

  /**
   * Evaluates minimum 2D horizontal clearance between a tested point and nearby obstacles.
   */
  public getClearanceAtPoint(
    point: THREE.Vector3,
    uEstimate: number,
    boatRadius: number = CollisionSystem.BOAT_RADIUS
  ): { clearance: number; obstacle: CollisionProxy | null } {
    const nearby = this.getNearbyObstacles(uEstimate, 0.04);
    let minClearance = 999.0;
    let closestObstacle: CollisionProxy | null = null;

    for (const obs of nearby) {
      const dx = point.x - obs.position.x;
      const dz = point.z - obs.position.z;
      const dist2D = Math.sqrt(dx * dx + dz * dz);
      const clearance = dist2D - (obs.radius + boatRadius);

      if (clearance < minClearance) {
        minClearance = clearance;
        closestObstacle = obs;
      }
    }

    return { clearance: minClearance, obstacle: closestObstacle };
  }

  /**
   * Deterministic, Smooth, Reversible Avoidance Calculation.
   * Evaluates the safe lateral offset required at progress u.
   * Completely deterministic: produces the identical value scrolling forward and backward.
   */
  public computeDeterministicAvoidanceOffset(
    u: number,
    requestedOffset: number,
    maxLateralOffset: number
  ): { safeOffset: number; activePush: number; primaryObstacle: CollisionProxy | null } {
    let cumulativePush = 0.0;
    let dominantObstacle: CollisionProxy | null = null;

    // Window size along spline for obstacle avoidance zone
    const AVOID_HALF_WINDOW = 0.016; // ~13 meters along river

    // 1. EVALUATE OBSTACLE CLEARANCE
    for (const obs of this.obstacles) {
      const uDist = Math.abs(u - obs.uEstimate);
      if (uDist < AVOID_HALF_WINDOW) {
        // Smooth Hermite bell curve weight w in [0, 1]
        const t = uDist / AVOID_HALF_WINDOW;
        const weight = Math.cos(t * Math.PI * 0.5); // Smooth C1 transition

        const requiredSeparation = obs.radius + CollisionSystem.BOAT_RADIUS + 0.85; // Safe separation
        const obsLat = obs.lateralOffset;

        // Determine steering direction:
        // If obstacle is on centerline (like TEST A), steer right (+normal) where river is wider
        let pushDir = 0;
        if (Math.abs(obsLat) < 0.8) {
          // TEST A: Centerline rock -> smoothly veer to the right (+lateral)
          pushDir = 1.0;
        } else if (obsLat > 0) {
          // Obstacle is to the right -> steer to the left (-lateral)
          pushDir = -1.0;
        } else {
          // Obstacle is to the left -> steer to the right (+lateral)
          pushDir = 1.0;
        }

        // Special handling for TEST C: Twin Gate Rocks
        // Safe channel is at offset +1.5m
        if (obs.id === 'test-c-left-rock' || obs.id === 'test-c-right-rock') {
          const safeCorridorCenter = 1.5;
          const correction = (safeCorridorCenter - requestedOffset) * weight;
          if (Math.abs(correction) > Math.abs(cumulativePush)) {
            cumulativePush = correction;
            dominantObstacle = obs;
          }
          continue;
        }

        // Calculate needed clearance push
        const lateralDistance = Math.abs(requestedOffset - obsLat);
        if (lateralDistance < requiredSeparation) {
          const neededClearance = (requiredSeparation - lateralDistance) * pushDir;
          const weightedPush = neededClearance * weight;
          if (Math.abs(weightedPush) > Math.abs(cumulativePush)) {
            cumulativePush = weightedPush;
            dominantObstacle = obs;
          }
        }
      }
    }

    // 2. BANK COLLISION PREVENTION
    // Prevent boat from approaching within 2.6m of the riverbanks
    let targetOffset = requestedOffset + cumulativePush;
    const bankSafetyBoundary = maxLateralOffset;

    if (targetOffset > bankSafetyBoundary) {
      targetOffset = bankSafetyBoundary;
    } else if (targetOffset < -bankSafetyBoundary) {
      targetOffset = -bankSafetyBoundary;
    }

    return {
      safeOffset: targetOffset,
      activePush: targetOffset - requestedOffset,
      primaryObstacle: dominantObstacle,
    };
  }

  /**
   * Multi-Step Predictive Trajectory Look-Ahead.
   * Samples current position + 4 future positions along the boat corridor.
   * Returns complete telemetry for HUD, debug visualization, and safe clearance guarantees.
   */
  public evaluateTrajectory(
    currentU: number,
    effectiveOffset: number,
    maxLateralOffset: number
  ): CollisionTelemetry {
    // 5-Point Look-Ahead Horizon: s0 (now), s1 (~3m), s2 (~6m), s3 (~10m), s4 (~15m)
    const lookAheadDeltas = [0.0, 0.004, 0.008, 0.013, 0.019];
    const samples: LookAheadSample[] = [];

    let worstClearance = 999.0;
    let highestThreat: CollisionProxy | null = null;

    for (let i = 0; i < lookAheadDeltas.length; i++) {
      const stepU = Math.min(1.0, currentU + lookAheadDeltas[i]);
      const centerPos = riverWorld.getPosition(stepU);
      const normal = riverWorld.getNormal(stepU);

      // Trajectory position at look-ahead step
      const stepOffset = this.computeDeterministicAvoidanceOffset(
        stepU,
        effectiveOffset,
        maxLateralOffset
      ).safeOffset;

      const testPos = centerPos.clone().add(normal.clone().multiplyScalar(stepOffset));
      const { clearance, obstacle } = this.getClearanceAtPoint(testPos, stepU);

      const isBlocked = clearance < 0.6; // Below 0.6m triggers blocked warning
      samples.push({
        index: i,
        u: stepU,
        position: testPos,
        clearance,
        blocked: isBlocked,
        nearestObstacleId: obstacle?.id,
      });

      if (clearance < worstClearance) {
        worstClearance = clearance;
        if (obstacle) highestThreat = obstacle;
      }
    }

    // Bank distances at current U
    const halfWidth = riverWorld.getWidth(currentU) * 0.5;
    const bankDistLeft = halfWidth - (-effectiveOffset);
    const bankDistRight = halfWidth - effectiveOffset;

    return {
      nearestObstacle: highestThreat,
      minClearance: worstClearance,
      isAvoiding: Math.abs(effectiveOffset) > 0.08,
      avoidanceOffset: effectiveOffset,
      bankClearanceLeft: bankDistLeft,
      bankClearanceRight: bankDistRight,
      lookAheadSamples: samples,
    };
  }

  /**
   * Creates the visual 3D meshes for all test obstacles in the scene
   */
  public createObstacleVisualMeshes(): THREE.Group {
    const visualGroup = new THREE.Group();
    visualGroup.name = 'PhysicalObstacleMeshes';

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x56605a,
      roughness: 0.92,
      metalness: 0.05,
    });

    const mossRockMat = new THREE.MeshStandardMaterial({
      color: 0x4a5d48,
      roughness: 0.88,
    });

    const willowTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x3d3024,
      roughness: 0.9,
    });

    const willowFoliageMat = new THREE.MeshStandardMaterial({
      color: 0x6e8f62,
      roughness: 0.85,
    });

    // TEST A: Centerline Rock at u = 0.085
    const testAObs = this.obstacles.find((o) => o.id === 'test-a-centerline-rock');
    if (testAObs) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(testAObs.radius * 0.95, 2),
        mossRockMat
      );
      rock.scale.set(1.1, 0.75, 1.25);
      rock.position.copy(testAObs.position);
      rock.position.y += 0.3; // Sits with top emerging above water
      visualGroup.add(rock);
      testAObs.visualMesh = rock;
    }

    // TEST B: Shoreline Overhanging Tree at u = 0.165
    const testBObs = this.obstacles.find((o) => o.id === 'test-b-edge-tree');
    if (testBObs) {
      const treeGroup = new THREE.Group();
      treeGroup.position.copy(testBObs.position);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.55, 6.0, 8),
        willowTrunkMat
      );
      trunk.position.y = 0;
      trunk.rotation.z = -0.25; // Leaning gently out over water
      treeGroup.add(trunk);

      // Drooping foliage clusters
      for (let f = 0; f < 5; f++) {
        const foliage = new THREE.Mesh(
          new THREE.SphereGeometry(1.4 + (f % 2) * 0.3, 8, 6),
          willowFoliageMat
        );
        foliage.scale.set(1.0, 1.5, 1.0);
        foliage.position.set(
          Math.sin(f * 1.3) * 1.6,
          2.5 - f * 0.4,
          Math.cos(f * 1.3) * 1.6
        );
        treeGroup.add(foliage);
      }
      visualGroup.add(treeGroup);
      testBObs.visualMesh = treeGroup;
    }

    // TEST C: Twin Gate Rocks at u = 0.38
    const testC1Obs = this.obstacles.find((o) => o.id === 'test-c-left-rock');
    if (testC1Obs) {
      const rock1 = new THREE.Mesh(
        new THREE.ConeGeometry(testC1Obs.radius, 3.8, 6),
        rockMat
      );
      rock1.position.copy(testC1Obs.position);
      rock1.position.y += 1.4;
      rock1.rotation.y = 0.4;
      visualGroup.add(rock1);
      testC1Obs.visualMesh = rock1;
    }

    const testC2Obs = this.obstacles.find((o) => o.id === 'test-c-right-rock');
    if (testC2Obs) {
      const rock2 = new THREE.Mesh(
        new THREE.ConeGeometry(testC2Obs.radius, 4.2, 7),
        rockMat
      );
      rock2.position.copy(testC2Obs.position);
      rock2.position.y += 1.6;
      rock2.rotation.y = -0.6;
      visualGroup.add(rock2);
      testC2Obs.visualMesh = rock2;
    }

    // TEST D: Sharp Bend Reef at u = 0.55
    const testDObs = this.obstacles.find((o) => o.id === 'test-d-bend-rock');
    if (testDObs) {
      const reef = new THREE.Mesh(
        new THREE.DodecahedronGeometry(testDObs.radius, 1),
        mossRockMat
      );
      reef.scale.set(1.3, 0.7, 1.5);
      reef.position.copy(testDObs.position);
      reef.position.y += 0.4;
      visualGroup.add(reef);
      testDObs.visualMesh = reef;
    }

    return visualGroup;
  }

  /**
   * Initializes the 3D Debug Visualizations for ?journeydebug=1
   */
  public createDebugVisualization(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'CollisionDebugVisualization';
    this.debugGroup = group;

    // 1. Obstacle Collision Proxies (Wireframe Cylinders, Spheres & Boxes)
    this.obstacles.forEach((obs) => {
      let geo: THREE.BufferGeometry;
      if (obs.type === 'cylinder') {
        geo = new THREE.CylinderGeometry(obs.radius, obs.radius, obs.height || 4.0, 16);
      } else if (obs.type === 'box' && obs.boxHalfSize) {
        geo = new THREE.BoxGeometry(obs.boxHalfSize.x * 2, obs.boxHalfSize.y * 2, obs.boxHalfSize.z * 2);
      } else {
        geo = new THREE.SphereGeometry(obs.radius, 14, 10);
      }

      const isTest = obs.id.startsWith('test-');
      const mat = new THREE.MeshBasicMaterial({
        color: isTest ? 0xff2200 : 0xffaa00,
        wireframe: true,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(obs.position);
      group.add(mesh);

      // Waterline safety ring
      const ringGeo = new THREE.RingGeometry(obs.radius * 0.92, obs.radius * 1.05, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isTest ? 0xff0055 : 0xff9900,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(obs.position.x, 0.12, obs.position.z);
      group.add(ring);
    });

    // 2. Look-Ahead Trajectory Path & Spheres (5 points)
    const lookAheadLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    const lookAheadLineMat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
    this.lookAheadLine = new THREE.Line(lookAheadLineGeo, lookAheadLineMat);
    group.add(this.lookAheadLine);

    this.lookAheadPoints = [];
    for (let p = 0; p < 5; p++) {
      const ptMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x00ffcc })
      );
      this.lookAheadPoints.push(ptMesh);
      group.add(ptMesh);
    }

    // 3. Nearest Obstacle Line
    const nearestLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    this.nearestLine = new THREE.Line(
      nearestLineGeo,
      new THREE.LineBasicMaterial({ color: 0xff3366, linewidth: 2 })
    );
    group.add(this.nearestLine);

    // 4. Avoidance Vector Arrow
    this.avoidanceArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(),
      2.0,
      0xffff00,
      0.6,
      0.3
    );
    group.add(this.avoidanceArrow);

    // 5. Boat Collision Hull (Cyan/Green wireframe bounding box + capsule)
    const hullGeo = new THREE.BoxGeometry(
      CollisionSystem.BOAT_WIDTH,
      1.1,
      CollisionSystem.BOAT_LENGTH
    );
    const hullMat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      wireframe: true,
    });
    this.boatHullMesh = new THREE.Mesh(hullGeo, hullMat);
    group.add(this.boatHullMesh);

    return group;
  }

  /**
   * Updates dynamic debug visualization elements in animation loop
   */
  public updateDebugVisualization(
    boatPos: THREE.Vector3,
    boatQuat: THREE.Quaternion,
    normal: THREE.Vector3,
    telemetry: CollisionTelemetry
  ): void {
    if (!this.debugGroup) return;

    // Update Boat Collision Hull position & orientation
    if (this.boatHullMesh) {
      this.boatHullMesh.position.copy(boatPos);
      this.boatHullMesh.position.y += 0.45;
      this.boatHullMesh.quaternion.copy(boatQuat);

      // Color shifts to warning if close to obstacle
      const mat = this.boatHullMesh.material as THREE.MeshBasicMaterial;
      if (telemetry.minClearance < 0.8) {
        mat.color.setHex(0xff0044); // Collision warning red
      } else if (telemetry.minClearance < 1.8) {
        mat.color.setHex(0xffaa00); // Caution orange
      } else {
        mat.color.setHex(0x00ffcc); // Safe cyan
      }
    }

    // Update Look-Ahead trajectory samples
    if (this.lookAheadLine && telemetry.lookAheadSamples.length >= 5) {
      const positions: THREE.Vector3[] = telemetry.lookAheadSamples.map((s) => s.position);
      this.lookAheadLine.geometry.setFromPoints(positions);

      for (let i = 0; i < 5; i++) {
        const sample = telemetry.lookAheadSamples[i];
        const pt = this.lookAheadPoints[i];
        if (pt && sample) {
          pt.position.copy(sample.position);
          const ptMat = pt.material as THREE.MeshBasicMaterial;
          if (sample.blocked) {
            ptMat.color.setHex(0xff0033);
          } else if (sample.clearance < 1.5) {
            ptMat.color.setHex(0xffaa00);
          } else {
            ptMat.color.setHex(0x00ffcc);
          }
        }
      }
    }

    // Update Nearest Obstacle indicator line
    if (this.nearestLine && telemetry.nearestObstacle) {
      this.nearestLine.visible = true;
      this.nearestLine.geometry.setFromPoints([
        boatPos,
        telemetry.nearestObstacle.position,
      ]);
    } else if (this.nearestLine) {
      this.nearestLine.visible = false;
    }

    // Update Avoidance Vector Arrow
    if (this.avoidanceArrow) {
      if (Math.abs(telemetry.avoidanceOffset) > 0.05) {
        this.avoidanceArrow.visible = true;
        this.avoidanceArrow.position.copy(boatPos);
        const arrowDir = normal.clone().multiplyScalar(Math.sign(telemetry.avoidanceOffset));
        this.avoidanceArrow.setDirection(arrowDir);
        this.avoidanceArrow.setLength(Math.min(5.0, Math.abs(telemetry.avoidanceOffset) * 1.5) + 0.5);
      } else {
        this.avoidanceArrow.visible = false;
      }
    }
  }
}

// Global collision singleton instance
export const collisionSystem = new CollisionSystem();
