import * as THREE from 'three';
import { riverWorld } from './RiverWorld';
import { collisionSystem } from './CollisionSystem';

export interface CameraInputState {
  boatPosition: THREE.Vector3;
  boatForward: THREE.Vector3;
  boatNormal: THREE.Vector3;
  boatSpeed: number;
  currentU: number;
  mode: 'rider' | 'follow' | 'bow' | 'aerial';
  dt: number;
  elapsedTime: number;
  userPanX: number;
  userPanY: number;
  mouseX: number;
  mouseY: number;
  isHeroMode?: boolean;
}

/**
 * World-Space Cinematic Camera System
 * 
 * Features:
 * 1. World-Space Physical Camera: Coexists in the unified coordinate system with river & terrain.
 * 2. Look-Ahead Target: Gazes 8.5–14.0m ahead along the upcoming river corridor.
 * 3. Curve Anticipation: Senses upcoming river curvature and swings outward to reveal the vista ahead.
 * 4. Cinematic Composition: Uses lower-third framing (20–35% viewport height, boat in lower third).
 * 5. Hero Mode Framing: Frames boat in lower-right third, keeping text column completely unobstructed.
 * 6. Multi-Layer Damping: Critical exponential damping for position, target, and orientation (zero snapping).
 * 7. Lightweight Collision Avoidance: Guarantees clearance above terrain, water, and obstacles.
 */
export class CinematicCameraSystem {
  // Current smoothed world transforms
  private currentPosition: THREE.Vector3 = new THREE.Vector3();
  private currentTarget: THREE.Vector3 = new THREE.Vector3();
  private currentQuaternion: THREE.Quaternion = new THREE.Quaternion();
  private isInitialized: boolean = false;

  // Preallocated scratch vectors & matrices to eliminate GC frame spikes (60fps steady)
  private readonly _tempBoatNormal: THREE.Vector3 = new THREE.Vector3();
  private readonly _desiredPos: THREE.Vector3 = new THREE.Vector3();
  private readonly _desiredTarget: THREE.Vector3 = new THREE.Vector3();
  private readonly _tempForward: THREE.Vector3 = new THREE.Vector3();
  private readonly _tempRight: THREE.Vector3 = new THREE.Vector3();
  private readonly _tempUp: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  private readonly _tempCorrectedUp: THREE.Vector3 = new THREE.Vector3();
  private readonly _lookMatrix: THREE.Matrix4 = new THREE.Matrix4();
  private readonly _targetQuat: THREE.Quaternion = new THREE.Quaternion();
  private readonly _deltaT: THREE.Vector3 = new THREE.Vector3();

  // Smoothed framing offsets
  private smoothedLateralBias: number = 0.0;
  private smoothedElevation: number = 3.2;
  private smoothedDistance: number = 8.2;

  // Damping constants (rad/s)
  private static readonly POS_DAMPING = 3.4;      // Smooth position following
  private static readonly TARGET_DAMPING = 4.0;   // Look target tracking
  private static readonly ROT_DAMPING = 3.6;      // Orientation slerp damping
  private static readonly BIAS_DAMPING = 2.4;     // Smooth framing transition
  private static readonly MIN_GROUND_CLEARANCE = 1.85; // Meters above terrain
  private static readonly MIN_WATER_CLEARANCE = 1.35;  // Meters above water

  constructor() {}

  /**
   * Resets the camera system to an immediate valid world pose
   */
  public reset(boatPos: THREE.Vector3, boatForward: THREE.Vector3, isHeroMode: boolean = false): void {
    const boatNormal = this._tempBoatNormal.set(boatForward.z, 0, -boatForward.x).normalize();

    if (isHeroMode) {
      const trailingDist = 13.2;
      const elevation = 4.6;
      const lateralShift = -4.2;

      this.currentPosition.copy(boatPos)
        .addScaledVector(boatForward, -trailingDist)
        .addScaledVector(boatNormal, lateralShift);
      this.currentPosition.y = Math.max(this.currentPosition.y + elevation, 2.5);

      this.currentTarget.copy(boatPos)
        .addScaledVector(boatForward, 8.5)
        .addScaledVector(boatNormal, 1.2);
      this.currentTarget.y += 1.8;
    } else {
      // ELEVATED THIRD-PERSON FOLLOW CAMERA (Above & Slightly Behind Boat)
      const trailingDist = 8.6;
      const elevation = 5.8;
      const lateralShift = 0.8;

      this.currentPosition.copy(boatPos)
        .addScaledVector(boatForward, -trailingDist)
        .addScaledVector(boatNormal, lateralShift);
      this.currentPosition.y = Math.max(this.currentPosition.y + elevation, 3.8);

      const lookAheadDist = 4.8;
      this.currentTarget.copy(boatPos)
        .addScaledVector(boatForward, lookAheadDist);
      this.currentTarget.y += 1.1;
    }

    this.computeLookQuaternionInto(this.currentPosition, this.currentTarget, this.currentQuaternion);
    this.smoothedLateralBias = 0.0;
    this.isInitialized = true;
  }

  /**
   * Evaluates signed river curvature ahead of progress u (approx 14m ahead)
   * Positive = upcoming right turn, Negative = upcoming left turn
   */
  private getAnticipatedCurvature(u: number): number {
    const uAhead = Math.min(1.0, u + 0.017); // ~14m along 820m river
    const tAhead = riverWorld.getTangent(uAhead);
    const tCurrent = riverWorld.getTangent(u);
    const normal = riverWorld.getNormal(u);

    this._deltaT.copy(tAhead).sub(tCurrent);
    return this._deltaT.dot(normal);
  }

  /**
   * Updates camera pose in world coordinates with look-ahead, anticipation, and collision avoidance
   */
  public update(camera: THREE.PerspectiveCamera, state: CameraInputState): void {
    const dt = Math.max(0.001, Math.min(state.dt, 0.066));

    if (!this.isInitialized) {
      this.reset(state.boatPosition, state.boatForward);
    }

    const {
      boatPosition,
      boatForward,
      boatNormal,
      currentU,
      mode,
      userPanX,
      userPanY,
      mouseX,
      mouseY,
    } = state;

    // =========================================================================
    // 1. EVALUATE LOOK-AHEAD TARGET & CAMERA POSITION BY MODE
    // =========================================================================
    const desiredTarget = this._desiredTarget;
    const desiredPosition = this._desiredPos;

    if (mode === 'bow') {
      // BOW MODE: First-person view from lantern bow gazing out over water
      desiredPosition.copy(boatPosition).addScaledVector(boatForward, 0.75);
      desiredPosition.y += 0.82;

      const lookAheadDist = 8.0;
      desiredTarget.copy(boatPosition).addScaledVector(boatForward, lookAheadDist);
      desiredTarget.y += 0.95 + mouseY * 0.75;
      desiredTarget.addScaledVector(boatNormal, mouseX * 1.5);

    } else if (mode === 'aerial') {
      // AERIAL DRONE MODE: High-altitude cinematic bird's eye vista
      desiredPosition.copy(boatPosition).addScaledVector(boatForward, -14.0);
      desiredPosition.y += 15.0;

      desiredTarget.copy(boatPosition).addScaledVector(boatForward, 7.0);
      desiredTarget.y += 0.5;

    } else if (state.isHeroMode) {
      // HERO MODE FRAMING (Landing page hero banner):
      const trailingDist = 13.2;
      const elevation = 4.6;
      const lateralShift = -4.2;

      desiredPosition.copy(boatPosition)
        .addScaledVector(boatForward, -trailingDist)
        .addScaledVector(boatNormal, lateralShift);
      desiredPosition.y += elevation;

      desiredTarget.copy(boatPosition)
        .addScaledVector(boatForward, 8.5)
        .addScaledVector(boatNormal, 1.2 + mouseX * 1.2);
      desiredTarget.y += 1.8 + mouseY * 0.5;

    } else {
      // =======================================================================
      // ELEVATED THIRD-PERSON FOLLOW CAMERA (Above & Slightly Behind the Boat)
      // =======================================================================
      let baseTrailing = 8.6;
      let baseElevation = 5.8;
      let baseLookAhead = 4.8;
      let targetHeightOffset = 1.1;

      if (currentU >= 0.36 && currentU <= 0.48) {
        // Narrow Gorge: slightly lower, emphasize looming canyon walls
        const gorgeWeight = 1.0 - Math.abs(currentU - 0.42) / 0.06;
        baseElevation -= gorgeWeight * 0.4;
        baseTrailing -= gorgeWeight * 0.4;
      } else if (currentU >= 0.52 && currentU <= 0.65) {
        // Wide Insight Reach: expansive vista breathing room
        const vistaWeight = 1.0 - Math.abs(currentU - 0.58) / 0.07;
        baseElevation += vistaWeight * 0.45;
        baseTrailing += vistaWeight * 0.6;
        baseLookAhead += vistaWeight * 0.8;
      } else if (currentU >= 0.80) {
        // Final Reflection Basin: serene expansive horizon
        const refWeight = Math.min(1.0, (currentU - 0.80) / 0.15);
        baseElevation += refWeight * 0.5;
        baseTrailing += refWeight * 0.7;
      }

      const trailingDist = baseTrailing;
      const elevation = baseElevation;

      // Anticipate upcoming river curves to gently frame the sweeping waterway ahead
      const curvature = this.getAnticipatedCurvature(currentU);
      const curveBias = -curvature * 1.6;
      const lateralOffset = 0.8 + curveBias + userPanX * 1.2;

      desiredPosition.copy(boatPosition)
        .addScaledVector(boatForward, -trailingDist)
        .addScaledVector(boatNormal, lateralOffset);
      desiredPosition.y = boatPosition.y + elevation - userPanY * 0.4;

      // Look-at Target
      const lookAheadDist = baseLookAhead;
      desiredTarget.copy(boatPosition)
        .addScaledVector(boatForward, lookAheadDist)
        .addScaledVector(boatNormal, mouseX * 1.6);
      desiredTarget.y = boatPosition.y + targetHeightOffset + mouseY * 0.6;
    }

    // =========================================================================
    // 2. CAMERA COLLISION AVOIDANCE (Terrain, Water & Obstacles)
    // =========================================================================
    if (mode !== 'bow') {
      // A. Terrain Elevation Clearance
      const terrainHeight = riverWorld.getTerrainHeight(desiredPosition.x, desiredPosition.z);
      const minTerrainY = terrainHeight + CinematicCameraSystem.MIN_GROUND_CLEARANCE;
      const minWaterY = CinematicCameraSystem.MIN_WATER_CLEARANCE;
      const minSafeY = Math.max(minTerrainY, minWaterY);

      if (desiredPosition.y < minSafeY) {
        desiredPosition.y = minSafeY;
      }

      // B. Obstacle Clearance (Only if camera elevation is near obstacle height)
      const nearbyObstacles = collisionSystem.getNearbyObstacles(currentU, 0.05);
      for (const obs of nearbyObstacles) {
        const dx = desiredPosition.x - obs.position.x;
        const dz = desiredPosition.z - obs.position.z;
        const dist2D = Math.sqrt(dx * dx + dz * dz);
        const safeMargin = obs.radius + 1.4;

        if (dist2D < safeMargin && dist2D > 0.01 && desiredPosition.y < obs.position.y + obs.radius + 1.5) {
          const pushRatio = (safeMargin - dist2D) / dist2D;
          desiredPosition.x += dx * pushRatio;
          desiredPosition.z += dz * pushRatio;
          desiredPosition.y = Math.max(desiredPosition.y, obs.position.y + 1.2);
        }
      }

      // C. Bridge Passage Clearance (u = 0.12 and u = 0.66)
      if (Math.abs(currentU - 0.12) < 0.02) {
        const duckWeight = Math.cos((Math.abs(currentU - 0.12) / 0.02) * Math.PI * 0.5);
        desiredPosition.y = THREE.MathUtils.lerp(desiredPosition.y, Math.min(desiredPosition.y, 3.6), duckWeight);
      } else if (Math.abs(currentU - 0.66) < 0.02) {
        const duckWeight = Math.cos((Math.abs(currentU - 0.66) / 0.02) * Math.PI * 0.5);
        desiredPosition.y = THREE.MathUtils.lerp(desiredPosition.y, Math.min(desiredPosition.y, 3.6), duckWeight);
      }
    }

    // =========================================================================
    // 3. DAMPED INTEGRATION (Position, Target, and Orientation)
    // =========================================================================
    const posBlend = 1.0 - Math.exp(-CinematicCameraSystem.POS_DAMPING * dt);
    this.currentPosition.lerp(desiredPosition, posBlend);

    const targetBlend = 1.0 - Math.exp(-CinematicCameraSystem.TARGET_DAMPING * dt);
    this.currentTarget.lerp(desiredTarget, targetBlend);

    // Damped orientation slerp (never snaps, smooth sweeping pan)
    this.computeLookQuaternionInto(this.currentPosition, this.currentTarget, this._targetQuat);
    const rotBlend = 1.0 - Math.exp(-CinematicCameraSystem.ROT_DAMPING * dt);
    this.currentQuaternion.slerp(this._targetQuat, rotBlend);

    // Apply to Three.js camera
    camera.position.copy(this.currentPosition);
    camera.quaternion.copy(this.currentQuaternion);
  }

  /**
   * Computes clean orientation quaternion looking from eye position to target into destination quaternion
   */
  private computeLookQuaternionInto(eye: THREE.Vector3, target: THREE.Vector3, outQuat: THREE.Quaternion): void {
    const forward = this._tempForward.copy(target).sub(eye).normalize();
    if (forward.lengthSq() < 0.0001) {
      forward.set(0, 0, -1);
    }

    const up = this._tempUp.set(0, 1, 0);
    const right = this._tempRight.crossVectors(up, forward).normalize();
    const correctedUp = this._tempCorrectedUp.crossVectors(forward, right).normalize();

    // Negate forward into forward for view space (-Z forward convention)
    forward.negate();
    this._lookMatrix.makeBasis(right, correctedUp, forward);
    outQuat.setFromRotationMatrix(this._lookMatrix);
  }

  public getCurrentPosition(): THREE.Vector3 {
    return this.currentPosition;
  }

  public getCurrentTarget(): THREE.Vector3 {
    return this.currentTarget;
  }
}
