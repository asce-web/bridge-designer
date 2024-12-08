import { Injectable } from '@angular/core';
import { Point2DInterface } from '../classes/graphics';

@Injectable({ providedIn: 'root' })
export class DesignGridService {
  /** Mutable grid. */
  public readonly grid = new DesignGrid();

  /** Alternate constant finest grid.  */
  public readonly constantFinestGrid: Readonly<DesignGrid> = Object.freeze(new DesignGrid());
}

export enum DesignGridDensity {
  ERROR = -1, // Result of failed conversions.
  FINE = 0,
  MEDIUM = 1,
  COARSE = 2,
}

export class DesignGrid {
  /** Allowable snap grid densities expressed in grid coordinate units, indexed on density. Invariant: multiple == 2^density. */
  private static readonly SNAP_MULTIPLES = [1, 2, 4];
  /** Max allowed (coarsest) snap multiple. */
  private static readonly MAX_SNAP_MULTIPLE = this.SNAP_MULTIPLES[DesignGridDensity.COARSE];
  /** Fine grid size in world coordinate meters. */
  public static readonly FINE_GRID_SIZE = 0.25;

  private _snapMultiple: number = DesignGrid.MAX_SNAP_MULTIPLE;

  constructor(density?: DesignGridDensity) {
    if (density !== undefined) {
      this._snapMultiple = DesignGrid.SNAP_MULTIPLES[density];
    }
  }

  public set snapMultiple(theSnapMultiple: number) {
    if (DesignGrid.SNAP_MULTIPLES.findIndex((value) => value === theSnapMultiple) < 0) {
      throw new Error('Bad snap multiple: ' + theSnapMultiple);
    }
    this._snapMultiple == theSnapMultiple;
  }

  public get snapMultiple(): number {
    return this._snapMultiple;
  }

  public set density(theDensity: DesignGridDensity) {
    this._snapMultiple = DesignGrid.SNAP_MULTIPLES[theDensity];
  }

  public get density(): DesignGridDensity {
    return DesignGrid.getDensityFromSnapMultiple(this._snapMultiple);
  }

  public isCoarser(density: DesignGridDensity) {
    return DesignGrid.SNAP_MULTIPLES[density] < this._snapMultiple;
  }

  public xformWorldToGrid(coord: number): number {
    return this.snapMultiple * Math.round(coord / (DesignGrid.FINE_GRID_SIZE * this.snapMultiple));
  }

  public xformGridToWorld(coord: number): number {
    return coord * DesignGrid.FINE_GRID_SIZE;
  }

  public xformWorldToGridPoint(dst: Point2DInterface, src: Point2DInterface): void {
    dst.x = this.xformWorldToGrid(src.x);
    dst.y = this.xformWorldToGrid(src.y);
  }

  public xformGridToWorldPoint(dst: Point2DInterface, src: Point2DInterface): void {
    dst.x = this.xformGridToWorld(src.x);
    dst.y = this.xformGridToWorld(src.y);
  }

  public static getDensityFromSnapMultiple(snapMultiple: number): DesignGridDensity {
    return DesignGrid.SNAP_MULTIPLES.findIndex((value) => value === snapMultiple);
  }

  public static getSnapMultipleOfGrid(coord: number): number {
    const lsb = coord & ~(coord - 1);
    return lsb == 0 || lsb > DesignGrid.MAX_SNAP_MULTIPLE ? DesignGrid.MAX_SNAP_MULTIPLE : lsb;
  }

  public static getSnapMultipleOfWorld(coord: number): number {
    return this.getSnapMultipleOfGrid(Math.round(coord / DesignGrid.FINE_GRID_SIZE));
  }

  /** Returns the coarsest grid density that includes the given coordinate. */
  public static getDensityOfGrid(coord: number): DesignGridDensity {
    return this.getDensityFromSnapMultiple(this.getSnapMultipleOfGrid(coord));
  }
}
