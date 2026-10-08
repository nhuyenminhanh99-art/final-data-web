import * as THREE from 'three';

export interface WakePoint {
  position: THREE.Vector3;
  direction: THREE.Vector3;
  speed: number;
  birthTime: number;
}

/**
 * Historical Trajectory Wake System
 * Records the boat's actual past path in world space.
 * Feeds a uniform ring buffer to the water shader to generate
 * realistic Kelvin wake waves that curve and dissipate behind the boat.
 */
export class WakeTrailSystem {
  public static readonly MAX_POINTS = 16;
  public static readonly LIFETIME = 2.4; // Soft disturbed water trail dissipates quickly behind slow rowboat

  // Fixed pool of preallocated records to eliminate garbage collection in 60fps loop
  private readonly pool: WakePoint[] = [];
  private activeCount: number = 0;
  private lastEmitTime: number = 0;
  private readonly lastEmitPos: THREE.Vector3 = new THREE.Vector3(9999, 9999, 9999);

  // GPU uniform arrays
  public readonly uniformPoints: THREE.Vector4[] = [];
  public readonly uniformDirs: THREE.Vector4[] = [];

  constructor() {
    for (let i = 0; i < WakeTrailSystem.MAX_POINTS; i++) {
      this.pool.push({
        position: new THREE.Vector3(),
        direction: new THREE.Vector3(),
        speed: 0,
        birthTime: 0,
      });
      this.uniformPoints.push(new THREE.Vector4(0, 0, 0, 0));
      this.uniformDirs.push(new THREE.Vector4(0, 0, 0, 1.0));
    }
  }

  /**
   * Updates wake trail buffer from boat position, heading, and speed with zero heap allocations
   */
  public update(
    sternPos: THREE.Vector3,
    forwardDir: THREE.Vector3,
    speed: number,
    currentTime: number
  ): void {
    const distFromLast = sternPos.distanceTo(this.lastEmitPos);
    const timeSinceLast = currentTime - this.lastEmitTime;

    // Emit a new historical point if boat has moved sufficiently or enough time passed
    if (speed > 0.12 && (distFromLast > 0.65 || (timeSinceLast > 0.22 && distFromLast > 0.3))) {
      // Shift elements down in fixed pool to make room at index 0 without creating new objects
      const maxCount = WakeTrailSystem.MAX_POINTS;
      const lastObj = this.pool[maxCount - 1];
      for (let i = maxCount - 1; i > 0; i--) {
        this.pool[i] = this.pool[i - 1];
      }
      this.pool[0] = lastObj;
      lastObj.position.copy(sternPos);
      lastObj.direction.copy(forwardDir).normalize();
      lastObj.speed = speed;
      lastObj.birthTime = currentTime;

      if (this.activeCount < maxCount) {
        this.activeCount++;
      }

      this.lastEmitPos.copy(sternPos);
      this.lastEmitTime = currentTime;
    }

    // Prune expired points from tail
    while (this.activeCount > 0) {
      const tailIdx = this.activeCount - 1;
      if (currentTime - this.pool[tailIdx].birthTime >= WakeTrailSystem.LIFETIME) {
        this.activeCount--;
      } else {
        break;
      }
    }

    // Pack points into uniform arrays
    for (let i = 0; i < WakeTrailSystem.MAX_POINTS; i++) {
      if (i < this.activeCount) {
        const pt = this.pool[i];
        const age = Math.max(
          0,
          Math.min(1.0, (currentTime - pt.birthTime) / WakeTrailSystem.LIFETIME)
        );
        // w component of point = speed attenuated by age decay
        const effectiveSpeed = pt.speed * (1.0 - age);
        this.uniformPoints[i].set(pt.position.x, pt.position.y, pt.position.z, effectiveSpeed);
        // w component of dir = normalized age in [0, 1]
        this.uniformDirs[i].set(pt.direction.x, pt.direction.y, pt.direction.z, age);
      } else {
        this.uniformPoints[i].set(0, 0, 0, 0);
        this.uniformDirs[i].set(0, 0, 0, 1.0);
      }
    }
  }

  public getActiveCount(): number {
    return this.activeCount;
  }
}
