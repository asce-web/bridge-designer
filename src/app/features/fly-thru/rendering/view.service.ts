import { Injectable } from '@angular/core';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { BridgeService } from '../../../shared/services/bridge.service';
import { Utility } from '../../../shared/classes/utility';
import { TerrainService } from '../models/terrain.service';
import { InterpolationService } from './interpolation.service';

export const enum ViewMode {
  FLYING,
  DRIVING,
}

@Injectable({ providedIn: 'root' })
export class ViewService {
  /** Max radians of look up-down angle. */
  private static readonly MAX_TILT = 0.5 * Math.PI * 0.75;
  /** Height of driver's eye above road surface. */
  private static readonly DRIVER_EYE_HEIGHT = 2.4;
  /* Distance from front axel (reference point) forward to driver's eye. */
  private static readonly DRIVER_EYE_LEAD = 0.6;

  private readonly up = vec3.fromValues(0, 1, 0);
  private readonly eye = vec3.create();
  private readonly center = vec3.create();
  private readonly eyeMin = vec3.create();
  private readonly eyeMax = vec3.create();
  private thetaEye: number = 0;
  private phiEye: number = 0;
  private thetaEyeRate: number = 0;
  private phiEyeRate: number = 0;
  private xzEyeVelocity: number = 0;
  private yEyeVelocity: number = 0;
  private phiDriverHead: number = 0;
  private thetaDriverHead: number = 0;
  public isIgnoringBoundaries: boolean = false;
  public isMovingLaterally: boolean = false;
  public isDriving: boolean = false;

  constructor(
    private readonly bridgeService: BridgeService,
    private readonly interpolationService: InterpolationService,
    private readonly terrainService: TerrainService,
  ) {}

  /** Apply a heuristic to set a reasonable view of the current bridge. */
  public resetView(): void {
    const extent = this.bridgeService.getWorldExtent();
    this.eye[2] = 1.2 * Math.max(extent.width, 1.75 * extent.height);
    this.eye[0] = this.center[0] = extent.x0 + 0.5 * extent.width;
    // Direct gaze at middle of vertical extent.
    this.center[1] = extent.y0 + 0.5 * extent.height;
    // Always put eye at height of a person on the road.
    this.eye[1] = 1;
    // Move eye right a bit to account for slant of river.
    this.eye[0] -= this.eye[2] * 0.1;
    this.center[2] = 0.0;
    this.yEyeVelocity = 0;

    // The angles are actually the independent values, so compute them here.
    this.thetaEye = Math.atan2(this.center[0] - this.eye[0], this.eye[2] - this.center[2]);
    this.thetaEyeRate = 0;

    this.phiEye = Math.atan2(this.center[1] - this.eye[1], this.eye[2] - this.center[2]);
    this.phiEyeRate = 0;
  }

  /** Set all view limits except for minimum y, which depends on terrain at the current eye location. */
  public setFixedViewLimits(): void {
    const conditions = this.bridgeService.designConditions;
    this.eyeMin[0] = -100.0;
    this.eyeMax[0] = 100 + conditions.spanLength;

    this.eyeMax[1] = conditions.overMargin + 15.0;
    this.eyeMin[2] = -100.0;
    this.eyeMax[2] = 100.0;
  }

  public updateView(elapsedSecs: number) {
    this.phiEye = Utility.clamp(
      this.phiEye + this.phiEyeRate * elapsedSecs,
      -ViewService.MAX_TILT,
      ViewService.MAX_TILT,
    );
    const dy = Math.sin(this.phiEye);
    const cosPhiEye = Math.cos(this.phiEye);
    this.thetaEye = Utility.normalizeAngle(this.thetaEye + this.thetaEyeRate * elapsedSecs);
    const dx = +cosPhiEye * Math.sin(this.thetaEye);
    const dz = -cosPhiEye * Math.cos(this.thetaEye);
    if (this.isIgnoringBoundaries) {
      if (this.isMovingLaterally) {
        this.eye[0] -= dz * this.xzEyeVelocity * elapsedSecs;
        this.eye[2] += dx * this.xzEyeVelocity * elapsedSecs;
      } else {
        this.eye[0] += dx * this.xzEyeVelocity * elapsedSecs;
        this.eye[2] += dz * this.xzEyeVelocity * elapsedSecs;
      }
      this.eye[1] += this.yEyeVelocity * elapsedSecs;
    } else {
      if (this.isMovingLaterally) {
        this.eye[0] = Utility.clamp(
          this.eye[0] - dz * this.xzEyeVelocity * elapsedSecs,
          this.eyeMin[0],
          this.eyeMax[0],
        );
        this.eye[2] = Utility.clamp(
          this.eye[2] + dx * this.xzEyeVelocity * elapsedSecs,
          this.eyeMin[2],
          this.eyeMax[2],
        );
      } else {
        this.eye[0] = Utility.clamp(
          this.eye[0] + dx * this.xzEyeVelocity * elapsedSecs,
          this.eyeMin[0],
          this.eyeMax[0],
        );
        this.eye[2] = Utility.clamp(
          this.eye[2] + dz * this.xzEyeVelocity * elapsedSecs,
          this.eyeMin[2],
          this.eyeMax[2],
        );
      }
      this.eyeMin[1] = this.terrainService.getElevationAt(this.eye[0], this.eye[2]) + 1.8;
      this.eye[1] = Utility.clamp(this.eye[1] + this.yEyeVelocity * elapsedSecs, this.eyeMin[1], this.eyeMax[1]);
    }
    this.center[0] = this.eye[0] + dx;
    this.center[1] = this.eye[1] + dy;
    this.center[2] = this.eye[2] + dz;
  }

  private loadPt = vec2.create();
  private loadLookDir = vec2.create();
  private eyeDriver = vec3.create();
  private centerDriver = vec3.create();

  public getLookAtMatrix(m: mat4 = mat4.create()): mat4 {
    if (this.isDriving) {
      this.interpolationService.getLoadPt(this.loadPt);
      this.interpolationService.getLoadLookDir(this.loadLookDir);
      mat4.identity(m);
      mat4.rotateX(m, m, -this.phiDriverHead);
      mat4.rotateY(m, m, this.thetaDriverHead);
      vec3.set(
        this.eyeDriver,
        this.loadPt[0] + ViewService.DRIVER_EYE_LEAD,
        this.loadPt[1] + ViewService.DRIVER_EYE_HEIGHT,
        0,
      );
      vec3.set(
        this.centerDriver,
        this.loadPt[0] + this.loadLookDir[0],
        this.loadPt[1] + this.loadLookDir[1] + ViewService.DRIVER_EYE_HEIGHT,
        0,
      );
      return mat4.lookAt(m, this.eyeDriver, this.centerDriver, this.up);
    }
    return mat4.lookAt(m, this.eye, this.center, this.up);
  }
}
