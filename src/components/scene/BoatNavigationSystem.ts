import * as THREE from 'three';
import { riverWorld, RiverStop, CANONICAL_RIVER_STOPS } from './RiverWorld';
import { collisionSystem, CollisionTelemetry } from './CollisionSystem';

export interface BoatNavigationState {
  u: number;
  targetU: number;
  velocityU: number;
  isArrived: boolean;
  worldPosition: THREE.Vector3;
  quaternion: THREE.Quaternion;
  tangent: THREE.Vector3;
  normal: THREE.Vector3;
  velocity: number;
  acceleration: number;
  lateralOffset: number;
  maxLateralOffset: number;
  bankingAngleDeg: number;
  pitchAngleDeg: number;
  waterElevation: number;
  leftBankDistance: number;
  rightBankDistance: number;
  nearestStop: RiverStop | null;
  telemetry: CollisionTelemetry;
  strokePhase: number;       // 0.0 to 1.0 cyclic rowing stroke phase
  strokeState: 'catch' | 'drive' | 'release' | 'glide' | 'rest';
  isRowingActive: boolean;
  propulsionSurge: number;   // 0.0 to 1.0 instantaneous propulsion pull factor
  actualTravelTime: number;
  isTrajectoryActive: boolean;
  trajectoryDuration: number;
  distanceToTarget: number;
  arrivalThreshold: number;
  navigationPhase: 'idle' | 'navigating' | 'arriving' | 'stopped';
}

/**
 * Authoritative Physical Boat Motion Model
 * Implements:
 * 1. Heavy Wooden Mass & Momentum: Human-powered propulsion with stroke-driven surges & glide phases
 * 2. Damped Heading & Authentic Slow Yaw: Heavy keel resists rapid angular turns, smoothly aligns with corridor
 * 3. Minimal Natural Roll: Sub-degree tilt (< 0.85°), no canoe/motorboat banking
 * 4. Micro Pitch: Natural bow lift on stroke pull, gentle settling on glide
 * 5. Water Surface Float: Samples dynamic water surface height with calibrated hull immersion offset
 * 6. Slow Rowing Rhythm: Stroke -> Glide -> Stroke -> Glide
 */
export class BoatNavigationSystem {
  // Longitudinal progress & momentum states
  private currentU: number = 0.0;
  private uVelocity: number = 0.0;     // du/dt (progress units / sec)
  private uAcceleration: number = 0.0; // d^2u/dt^2
  private smoothedLinearSpeed: number = 0.0; // meters / sec

  // Dynamic 3-second Trajectory Execution State
  private lastTargetU: number = -1.0;
  private trajectoryStartU: number = 0.0;
  private trajectoryTargetU: number = 0.0;
  private trajectoryElapsedSec: number = 0.0;
  private trajectoryDurationSec: number = 3.0;
  private isTrajectoryActive: boolean = false;
  private navigationStartTimeMs: number = 0;
  private actualTravelTimeSec: number = 0.0;

  // Rowing cycle states
  private strokeTimer: number = 0.0;
  private isRowingActive: boolean = false;
  private strokePhase: number = 0.0;
  private currentStrokeState: 'catch' | 'drive' | 'release' | 'glide' | 'rest' = 'rest';
  private propulsionSurge: number = 0.0;

  // Lateral corridor states
  private currentLateralOffset: number = 0.0;
  private lateralVelocity: number = 0.0;

  // Rotational & attitude states
  private currentHeadingQuaternion: THREE.Quaternion = new THREE.Quaternion();
  private currentBanking: number = 0.0; // radians (roll around local Z)
  private currentPitch: number = 0.0;   // radians (pitch around local X)

  private lastPosition: THREE.Vector3 = new THREE.Vector3();
  private isInitialized: boolean = false;

  // Physical constants calibrated for a heavy handcrafted wooden river rowboat (~550kg displacement)
  private static readonly SPLINE_LENGTH = 335.0;         // River length (meters)
  private static readonly NOMINAL_LEG_DURATION = 3.0;    // Target chapter-to-chapter duration in seconds
  private static readonly STROKE_CYCLE_PERIOD = 1.48;    // Calm, rhythmic rowing stroke period (~2 strokes per 3s leg)

  private static readonly YAW_DAMPING_LAMBDA = 1.85;     // Slow yaw response (rad/s) for heavy boat pivoting through water
  private static readonly BANK_DAMPING_LAMBDA = 2.2;     // Roll damping (rad/s)
  private static readonly PITCH_DAMPING_LAMBDA = 3.2;    // Pitch damping (rad/s)
  private static readonly LATERAL_DAMPING_LAMBDA = 2.4;  // Heavy lateral corridor adjustment damping

  private static readonly BOAT_SAFETY_MARGIN = 2.6;      // Margin from riverbank edge (meters)
  private static readonly CALIBRATED_HULL_OFFSET = 0.00;  // Waterline sits exactly at mesh y=0 (keel submerged, 70% hull visibly floating above water)

  constructor(initialU: number = 0.0) {
    this.reset(initialU);
  }

  /**
   * Resets the navigator to a specific progress u and computes deterministic initial transform
   */
  public reset(u: number, lateralOffset: number = 0.0): void {
    this.currentU = Math.max(0, Math.min(u, 1.0));
    this.uVelocity = 0.0;
    this.uAcceleration = 0.0;
    this.smoothedLinearSpeed = 0.0;
    this.currentBanking = 0.0;
    this.currentPitch = 0.0;
    this.isTrajectoryActive = false;
    this.lastTargetU = this.currentU;
    this.trajectoryStartU = this.currentU;
    this.trajectoryTargetU = this.currentU;
    this.actualTravelTimeSec = 0.0;

    const maxOffset = this.getMaxLateralOffset(this.currentU);
    const { safeOffset } = collisionSystem.computeDeterministicAvoidanceOffset(
      this.currentU,
      lateralOffset,
      maxOffset
    );
    this.currentLateralOffset = safeOffset;
    this.lateralVelocity = 0.0;

    const pos = this.computePositionAt(this.currentU, this.currentLateralOffset);
    const forward = this.computeTrajectoryForwardVector(this.currentU, lateralOffset);

    this.currentHeadingQuaternion = this.computeTargetQuaternionFromForward(forward);
    this.lastPosition.copy(pos);
    this.isInitialized = true;
  }

  /**
   * Evaluates the maximum allowable lateral offset at progress u
   * Ensures boat cannot cross river bank boundaries
   */
  public getMaxLateralOffset(u: number): number {
    const halfWidth = riverWorld.getWidth(u) * 0.5;
    return Math.max(0.6, halfWidth - BoatNavigationSystem.BOAT_SAFETY_MARGIN);
  }

  /**
   * Samples water surface height at any world coordinates (x, z) at time t.
   * Matches the Gerstner liquid wave displacement in the water shader.
   */
  public static getWaterHeight(x: number, z: number, time: number): number {
    const w1 = Math.sin(z * 0.08 + time * 1.5) * 0.16;
    const w2 = Math.cos(x * 0.12 + time * 1.9 + z * 0.035) * 0.10;
    const micro = Math.sin(z * 0.4 + time * 3.8) * 0.025;
    return (w1 + w2 + micro) * 0.55;
  }

  /**
   * Calculates signed horizontal river curvature kappa at progress u.
   * Positive = curving right (+N), Negative = curving left (-N).
   */
  public getRiverCurvature(u: number): number {
    const deltaU = 0.007;
    const uAhead = Math.min(1.0, u + deltaU);
    const uBehind = Math.max(0.0, u - deltaU);

    const tAhead = riverWorld.getTangent(uAhead);
    const tBehind = riverWorld.getTangent(uBehind);
    const normal = riverWorld.getNormal(u);

    const deltaT = tAhead.clone().sub(tBehind);
    const segmentLength = Math.max(1.0, (uAhead - uBehind) * BoatNavigationSystem.SPLINE_LENGTH);
    return deltaT.dot(normal) / segmentLength;
  }

  /**
   * Helper to compute safe lateral offset at any arbitrary u along the spline
   */
  private computeSafeOffsetAt(u: number, requestedOffset: number): number {
    const maxOffset = this.getMaxLateralOffset(u);
    const naturalMeander = Math.sin(u * 16.0) * 0.75;
    const nominalOffset = requestedOffset + naturalMeander;
    return collisionSystem.computeDeterministicAvoidanceOffset(u, nominalOffset, maxOffset).safeOffset;
  }

  /**
   * Advances the physical boat motion for deltaTime seconds
   */
  public update(
    targetU: number,
    deltaTime: number,
    requestedLateralOffset: number = 0.0,
    timeOfDaySeconds: number = 0.0
  ): BoatNavigationState {
    const dt = Math.max(0.001, Math.min(deltaTime, 0.066)); // Stable physics timestep

    if (!this.isInitialized) {
      this.reset(targetU);
    }

    // =========================================================================
    // 1. MASS & MOMENTUM (Calculated Distance -> Dynamic ~3.0s Trajectory)
    // =========================================================================
    const clampedTargetU = Math.max(0, Math.min(targetU, 1.0));

    // Detect target shift and initialize smooth minimum-jerk trajectory
    if (Math.abs(clampedTargetU - this.lastTargetU) > 0.0035) {
      this.lastTargetU = clampedTargetU;
      this.trajectoryStartU = this.currentU;
      this.trajectoryTargetU = clampedTargetU;
      this.trajectoryElapsedSec = 0.0;
      this.navigationStartTimeMs = performance.now();

      const distM = Math.abs(this.trajectoryTargetU - this.trajectoryStartU) * BoatNavigationSystem.SPLINE_LENGTH;
      if (distM > 0.25) {
        // Leg duration calibrated to ~3.0 seconds for chapter-to-chapter transitions
        this.trajectoryDurationSec = Math.max(1.8, Math.min(3.2, BoatNavigationSystem.NOMINAL_LEG_DURATION));
        this.isTrajectoryActive = true;
      } else {
        this.isTrajectoryActive = false;
      }
    }

    let isArrived = false;

    if (this.isTrajectoryActive) {
      this.trajectoryElapsedSec += dt;
      const tau = Math.min(1.0, this.trajectoryElapsedSec / this.trajectoryDurationSec);

      // Smooth C2 Quintic Easing: minimum jerk, zero initial & final velocity/acceleration
      const s = 6.0 * Math.pow(tau, 5) - 15.0 * Math.pow(tau, 4) + 10.0 * Math.pow(tau, 3);
      const sPrime = 30.0 * Math.pow(tau, 4) - 60.0 * Math.pow(tau, 3) + 30.0 * Math.pow(tau, 2);
      const sDoublePrime = 120.0 * Math.pow(tau, 3) - 180.0 * Math.pow(tau, 2) + 60.0 * tau;

      const deltaU = this.trajectoryTargetU - this.trajectoryStartU;
      this.currentU = this.trajectoryStartU + deltaU * s;
      this.uVelocity = (deltaU * sPrime) / this.trajectoryDurationSec;
      const linearSpeed = this.uVelocity * BoatNavigationSystem.SPLINE_LENGTH;
      const linearAccel = (deltaU * sDoublePrime * BoatNavigationSystem.SPLINE_LENGTH) / (this.trajectoryDurationSec * this.trajectoryDurationSec);
      this.uAcceleration = linearAccel / BoatNavigationSystem.SPLINE_LENGTH;

      // Rowing animation active during transit, resting gracefully during the final deceleration (tau >= 0.88)
      if (tau < 0.88) {
        this.isRowingActive = true;
        this.strokeTimer += dt;
        const cyclePeriod = BoatNavigationSystem.STROKE_CYCLE_PERIOD;
        this.strokePhase = (this.strokeTimer % cyclePeriod) / cyclePeriod;

        if (this.strokePhase < 0.22) {
          this.currentStrokeState = 'catch';
          this.propulsionSurge = 0.0;
        } else if (this.strokePhase < 0.65) {
          this.currentStrokeState = 'drive';
          const driveProgress = (this.strokePhase - 0.22) / (0.65 - 0.22);
          this.propulsionSurge = Math.sin(driveProgress * Math.PI);
        } else if (this.strokePhase < 0.73) {
          this.currentStrokeState = 'release';
          this.propulsionSurge = 0.0;
        } else {
          this.currentStrokeState = 'glide';
          this.propulsionSurge = 0.0;
        }
      } else {
        // Natural settling glide into the chapter stop
        this.isRowingActive = false;
        this.currentStrokeState = 'rest';
        this.propulsionSurge = 0.0;
        this.strokePhase = THREE.MathUtils.lerp(this.strokePhase, 0.0, 0.15);
      }

      if (tau >= 1.0) {
        this.isTrajectoryActive = false;
        this.currentU = this.trajectoryTargetU;
        this.uVelocity = 0.0;
        this.uAcceleration = 0.0;
        this.currentStrokeState = 'rest';
        this.isRowingActive = false;
        this.strokePhase = 0.0;
        this.propulsionSurge = 0.0;
        this.actualTravelTimeSec = (performance.now() - this.navigationStartTimeMs) / 1000;
        isArrived = true;
      }
    } else {
      // Stopped / Settled at chapter stop: floating gently with subtle water motion
      this.uVelocity = 0.0;
      this.uAcceleration = 0.0;
      this.isRowingActive = false;
      this.currentStrokeState = 'rest';
      this.strokePhase = THREE.MathUtils.lerp(this.strokePhase, 0.0, 0.15);
      this.propulsionSurge = 0.0;
      isArrived = true;
    }

    this.currentU = Math.max(0, Math.min(this.currentU, 1.0));

    // Linear speed in meters/second for visual effects (wake, sound, banking)
    const effectiveLinearSpeed = Math.abs(this.uVelocity * BoatNavigationSystem.SPLINE_LENGTH);
    this.smoothedLinearSpeed = THREE.MathUtils.lerp(this.smoothedLinearSpeed, effectiveLinearSpeed, 0.15);

    // =========================================================================
    // 2. CONSTRAINED LATERAL CORRIDOR & COLLISION AVOIDANCE
    // =========================================================================
    const maxOffset = this.getMaxLateralOffset(this.currentU);
    const safeTargetOffset = this.computeSafeOffsetAt(this.currentU, requestedLateralOffset);

    const lateralBlend = 1.0 - Math.exp(-BoatNavigationSystem.LATERAL_DAMPING_LAMBDA * dt);
    this.currentLateralOffset += (safeTargetOffset - this.currentLateralOffset) * lateralBlend;
    this.currentLateralOffset = Math.max(-maxOffset, Math.min(this.currentLateralOffset, maxOffset));

    // =========================================================================
    // 3. BOAT WORLD POSITION & WATER FLOAT (Natural Seat on Water Surface)
    // =========================================================================
    const worldPos = this.computePositionAt(this.currentU, this.currentLateralOffset);

    // Dynamic water surface height at boat center
    const waterElevation = BoatNavigationSystem.getWaterHeight(
      worldPos.x,
      worldPos.z,
      timeOfDaySeconds
    );
    // Sit firmly and naturally in the water at calibrated waterline
    worldPos.y = waterElevation + BoatNavigationSystem.CALIBRATED_HULL_OFFSET;

    // =========================================================================
    // 4. ROTATION WITH AUTHENTIC SLOW YAW RESPONSE (Heavy Keel In Water)
    // =========================================================================
    const riverTangent = riverWorld.getTangent(this.currentU);
    const riverNormal = riverWorld.getNormal(this.currentU);

    // Target trajectory forward vector
    const trajectoryForward = this.computeTrajectoryForwardVector(
      this.currentU,
      requestedLateralOffset
    );
    const targetHeadingQuat = this.computeTargetQuaternionFromForward(trajectoryForward);

    // Heavy yaw response: heavy wooden hull resists instant rotational snapping, turns gradually
    const yawSlerpFactor = 1.0 - Math.exp(-BoatNavigationSystem.YAW_DAMPING_LAMBDA * dt);
    this.currentHeadingQuaternion.slerp(targetHeadingQuat, yawSlerpFactor);

    // =========================================================================
    // 5. MINIMAL NATURAL ROLL (Sub-degree tilt < 0.85°, No Canoe Banking)
    // =========================================================================
    const curvature = this.getRiverCurvature(this.currentU);
    // Heavy flat-bottom sampan rolls minimally in curves (no high-speed motorcycle banking)
    const rawBanking = -curvature * (this.smoothedLinearSpeed * 0.08);
    // Strictly clamped to maximum 0.85 degrees (0.0148 radians)
    const MAX_BANK_RAD = 0.0148;
    const targetBanking = Math.max(-MAX_BANK_RAD, Math.min(rawBanking, MAX_BANK_RAD));

    const bankBlend = 1.0 - Math.exp(-BoatNavigationSystem.BANK_DAMPING_LAMBDA * dt);
    this.currentBanking += (targetBanking - this.currentBanking) * bankBlend;

    // =========================================================================
    // 6. MICRO PITCH (Natural Bow Dynamics on Stroke Pull & Water Surface)
    // =========================================================================
    // Stroke pull causes slight bow lift (+0.25°), recovery causes subtle settling
    const strokePitch = this.propulsionSurge * 0.0045; // ~0.25° dynamic bow lift on power stroke

    // Water surface inclination between bow and stern
    const halfBoatLen = 1.8;
    const bowPos = worldPos.clone().add(trajectoryForward.clone().multiplyScalar(halfBoatLen));
    const sternPos = worldPos.clone().sub(trajectoryForward.clone().multiplyScalar(halfBoatLen));
    const hBow = BoatNavigationSystem.getWaterHeight(bowPos.x, bowPos.z, timeOfDaySeconds);
    const hStern = BoatNavigationSystem.getWaterHeight(sternPos.x, sternPos.z, timeOfDaySeconds);
    const wavePitch = -((hBow - hStern) / (halfBoatLen * 2.0)) * 0.15;

    // Total pitch strictly clamped (< 0.8 degrees)
    const MAX_PITCH_RAD = 0.014;
    const targetPitch = Math.max(-MAX_PITCH_RAD, Math.min(strokePitch + wavePitch, MAX_PITCH_RAD));

    const pitchBlend = 1.0 - Math.exp(-BoatNavigationSystem.PITCH_DAMPING_LAMBDA * dt);
    this.currentPitch += (targetPitch - this.currentPitch) * pitchBlend;

    // =========================================================================
    // 7. COMPOSITE ORIENTATION (Heading + Local Pitch + Local Banking)
    // =========================================================================
    const attitudeEuler = new THREE.Euler(this.currentPitch, 0, this.currentBanking, 'YXZ');
    const attitudeQuat = new THREE.Quaternion().setFromEuler(attitudeEuler);
    const finalQuat = this.currentHeadingQuaternion.clone().multiply(attitudeQuat);

    this.lastPosition.copy(worldPos);

    // =========================================================================
    // 8. BANK DISTANCES & TELEMETRY
    // =========================================================================
    const halfWidth = riverWorld.getWidth(this.currentU) * 0.5;
    const leftBankDist = halfWidth - (-this.currentLateralOffset);
    const rightBankDist = halfWidth - this.currentLateralOffset;

    const telemetry = collisionSystem.evaluateTrajectory(
      this.currentU,
      this.currentLateralOffset,
      maxOffset
    );

    const nearestStop = CANONICAL_RIVER_STOPS.find(
      (s) => Math.abs(this.currentU - s.u) < 0.035
    ) || null;

    const distanceToTarget = Math.abs(clampedTargetU - this.currentU) * BoatNavigationSystem.SPLINE_LENGTH;
    const arrivalThreshold = 0.25; // meters
    let navigationPhase: 'idle' | 'navigating' | 'arriving' | 'stopped' = 'stopped';
    if (this.isTrajectoryActive) {
      const tau = Math.min(1.0, this.trajectoryElapsedSec / this.trajectoryDurationSec);
      if (tau >= 1.0 || distanceToTarget <= arrivalThreshold) {
        navigationPhase = 'stopped';
      } else if (tau >= 0.82) {
        navigationPhase = 'arriving';
      } else {
        navigationPhase = 'navigating';
      }
    } else {
      navigationPhase = 'stopped';
    }

    return {
      u: this.currentU,
      targetU: clampedTargetU,
      velocityU: this.uVelocity,
      isArrived,
      worldPosition: worldPos,
      quaternion: finalQuat,
      tangent: riverTangent,
      normal: riverNormal,
      velocity: this.smoothedLinearSpeed,
      acceleration: this.uAcceleration * BoatNavigationSystem.SPLINE_LENGTH,
      lateralOffset: this.currentLateralOffset,
      maxLateralOffset: maxOffset,
      bankingAngleDeg: this.currentBanking * (180.0 / Math.PI),
      pitchAngleDeg: this.currentPitch * (180.0 / Math.PI),
      waterElevation,
      leftBankDistance: leftBankDist,
      rightBankDistance: rightBankDist,
      nearestStop,
      telemetry,
      strokePhase: this.strokePhase,
      strokeState: this.currentStrokeState,
      isRowingActive: this.isRowingActive,
      propulsionSurge: this.propulsionSurge,
      actualTravelTime: this.actualTravelTimeSec,
      isTrajectoryActive: this.isTrajectoryActive,
      trajectoryDuration: this.trajectoryDurationSec,
      distanceToTarget,
      arrivalThreshold,
      navigationPhase,
    };
  }

  /**
   * Conceptually: boatPosition = riverCenterPosition + riverNormal * lateralOffset
   */
  public computePositionAt(u: number, lateralOffset: number): THREE.Vector3 {
    const center = riverWorld.getPosition(u);
    const normal = riverWorld.getNormal(u);
    return center.clone().add(normal.clone().multiplyScalar(lateralOffset));
  }

  /**
   * Evaluates the true forward tangent of the avoided trajectory at progress u
   */
  private computeTrajectoryForwardVector(u: number, requestedOffset: number): THREE.Vector3 {
    const deltaU = 0.006;
    const uAhead = Math.min(1.0, u + deltaU);
    const uBehind = Math.max(0.0, u - deltaU);

    const offsetAhead = this.computeSafeOffsetAt(uAhead, requestedOffset);
    const offsetBehind = this.computeSafeOffsetAt(uBehind, requestedOffset);

    const pAhead = this.computePositionAt(uAhead, offsetAhead);
    const pBehind = this.computePositionAt(uBehind, offsetBehind);

    const forward = pAhead.clone().sub(pBehind).normalize();
    if (forward.lengthSq() < 0.001) {
      return riverWorld.getTangent(u);
    }
    return forward;
  }

  /**
   * Computes orientation quaternion aligning boat's forward axis (+Z direction of travel)
   */
  private computeTargetQuaternionFromForward(forward: THREE.Vector3): THREE.Quaternion {
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(up, forward).normalize();
    const correctedUp = new THREE.Vector3().crossVectors(forward, right).normalize();

    const rotMatrix = new THREE.Matrix4().makeBasis(right, correctedUp, forward);
    return new THREE.Quaternion().setFromRotationMatrix(rotMatrix);
  }

  public getCurrentU(): number {
    return this.currentU;
  }
}
