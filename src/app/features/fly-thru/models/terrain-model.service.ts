import { Injectable } from '@angular/core';
import { makeRandomGenerator } from '../../../shared/core/random-generator';
import { Utility } from '../../../shared/classes/utility';
import { MeshData } from '../rendering/mesh-rendering.service';

/** Container for singleton terrain model, its generator, and queries. */
@Injectable({ providedIn: 'root' })
export class TerrainModelService {
  public static readonly HALF_GRID_COUNT = 32;
  public static readonly GRID_COUNT = 2 * TerrainModelService.HALF_GRID_COUNT;
  public static readonly POST_COUNT = TerrainModelService.GRID_COUNT + 1;
  public static readonly ELEVATION_PERTURBATION = 18;
  public static readonly PERTURBATION_DECAY = 1.8;
  public static readonly TERRAIN_HALF_SIZE = 192;
  public static readonly METERS_PER_GRID = TerrainModelService.TERRAIN_HALF_SIZE / TerrainModelService.HALF_GRID_COUNT;

  public static readonly halfGapWidth = 24.0;
  public static readonly bankSlope = 2.0;
  public static readonly waterLevel = -26.0;
  public static readonly blufSetback = TerrainModelService.halfGapWidth * 0.2;
  public static readonly stoneTextureSize = 0.3;
  public static readonly tBlufAtBridge = TerrainModelService.halfGapWidth + TerrainModelService.blufSetback;
  public static readonly tInflection = TerrainModelService.halfGapWidth - TerrainModelService.blufSetback;
  public static readonly blufCoeff =
    (-0.5 * TerrainModelService.bankSlope) /
    (TerrainModelService.tInflection - (TerrainModelService.blufSetback + TerrainModelService.halfGapWidth));
  public static readonly yGorgeBottom = -TerrainModelService.halfGapWidth * TerrainModelService.bankSlope;
  public static readonly tWaterEdge =
    (TerrainModelService.waterLevel - TerrainModelService.yGorgeBottom) / TerrainModelService.bankSlope;
  public static readonly roadCutSlope = 1;
  public static readonly epsPaint = 0.05;

  private readonly random0to1 = makeRandomGenerator(2093415, 3205892098, 239837, 13987483);

  public readonly fractalElevations: Float32Array[];

  constructor() {
    this.fractalElevations = this.buildFractalTerrain(TerrainModelService.POST_COUNT);
  }

  /**
   * Creates or re-fills a square array of elevation posts with random fractal terrain
   * using the diamond/square algorithm.
   */
  public buildFractalTerrain(arg: number | Float32Array[]): Float32Array[] {
    // Make the first random() zero so the center of terrain isn't a crazy elevation.
    let randomCount = 0;
    const random = () => randomCount++ === 0 ? 0 : 2 * this.random0to1() - 1; 
    // Create square array or use existing one.
    const y = typeof arg === 'number' ? Utility.createArray(() => new Float32Array(arg), arg) : arg;
    const size = y.length;
    const iMax = size - 1;
    y[0][0] = y[iMax][0] = y[iMax][iMax] = y[0][iMax] = 0;
    let dy = TerrainModelService.ELEVATION_PERTURBATION;
    // Perturb successively halved subgrids. Example: Initially we have a 1x1 and we perturb
    // the center (in the square phase) and edge midpoints (in the diamond phase).
    const decay = TerrainModelService.PERTURBATION_DECAY;
    let halfStride = iMax >>> 1;
    for (let stride = iMax; stride > 1; stride = halfStride, halfStride >>>= 1, dy /= decay) {
      // Square phase.
      for (let i = 0; i < iMax; i += stride) {
        for (let j = 0; j < iMax; j += stride) {
          const avg = 0.25 * (y[i][j] + y[i + stride][j] + y[i][j + stride] + y[i + stride][j + stride]);
          y[i + halfStride][j + halfStride] = avg + random() * dy;
        }
      }
      // Diamond phase. More cases here because diamonds are partial at terrain edges.
      for (let i = 0; i < size; i += stride) {
        for (let j = halfStride; j < size; j += stride) {
          let e = y[i][j - halfStride] + y[i][j + halfStride];
          const iNorth = i - halfStride;
          const iSouth = i + halfStride;
          let n = 2;
          if (iNorth >= 0) {
            e += y[iNorth][j];
            n++;
          }
          if (iSouth < size) {
            e += y[iSouth][j];
            n++;
          }
          y[i][j] = e / n + random() * dy;
        }
      }
      for (let i = halfStride; i < size; i += stride) {
        for (let j = 0; j < size; j += stride) {
          let e = y[i - halfStride][j] + y[i + halfStride][j];
          const jWest = j - halfStride;
          const jEast = j + halfStride;
          let n = 2;
          if (jWest >= 0) {
            e += y[i][jWest];
            n++;
          }
          if (jEast < size) {
            e += y[i][jEast];
            n++;
          }
          y[i][j] = e / n + random() * dy;
        }
      }
    }
    return y;
  }

  /** Rebuilds the random part of terrain without re-seeding the RNG. */
  public rebuildFractalTerrain() {
    this.buildFractalTerrain(this.fractalElevations);
  }

  /** Returns a mesh for the current terrain. */
  public get mesh(): MeshData {
    const gridFloatCount = 3 * TerrainModelService.POST_COUNT * TerrainModelService.POST_COUNT;
    const positions = new Float32Array(gridFloatCount);
    const normals = new Float32Array(gridFloatCount);
    const gridSquareCount = TerrainModelService.GRID_COUNT * TerrainModelService.GRID_COUNT;
    const indices = new Uint16Array(gridSquareCount * 2 * 3); // Two triangles per grid square.
    // TODO: Use corrected elevations.
    const y = this.fractalElevations;
    // Most negative x- and z-coordinate.
    const xz0 = -TerrainModelService.HALF_GRID_COUNT * TerrainModelService.METERS_PER_GRID;
    const mPerGrid = TerrainModelService.METERS_PER_GRID;

    // Positions from grid x-z and terrain y in column/x-major order.
    const ijMax = y.length - 1;
    let ip = 0;
    for (let j = 0, x = xz0; j <= ijMax; ++j, x += mPerGrid) {
      for (let i = 0, z = xz0; i <= ijMax; ++i, z += mPerGrid) {
        positions[ip++] = x;
        positions[ip++] = y[i][j];
        positions[ip++] = z;
      }
    }
    // Normals by averaging unit normals of adjacent faces.
    ip = 0;
    for (let j = 0; j <= ijMax; ++j) {
      for (let i = 0; i <= ijMax; ++i) {
        const y0 = y[i][j];
        // Adjacent Elevation deltas. Assume off-grid edges are horizontal.
        const da = j < ijMax ? y[i][j + 1] - y0 : 0;
        const db = i > 0 ? y[i - 1][j] - y0 : 0;
        const dc = j > 0 ? y[i][j - 1] - y0 : 0;
        const dd = i < ijMax ? y[i + 1][j] - y0 : 0;

        // All the normal y-coordinates are the same: pq means ab, bc, cd, or da.
        const pqy = mPerGrid * mPerGrid;

        // Find the raw normals.
        let abx = -mPerGrid * da;
        let aby = pqy;
        let abz = mPerGrid * db;

        let bcx = mPerGrid * dc;
        let bcy = pqy;
        let bcz = abz;

        let cdx = bcx;
        let cdy = pqy;
        let cdz = -mPerGrid * dd;

        let dax = abx;
        let day = pqy;
        let daz = cdz;

        // Scale to unit vectors.
        const pqy2 = pqy * pqy;
        const abScale = 1 / Math.sqrt(abx * abx + pqy2 + abz * abz);
        abx *= abScale;
        aby *= abScale;
        abz *= abScale;

        const bcScale = 1 / Math.sqrt(bcx * bcx + pqy2 + bcz * bcz);
        bcx *= bcScale;
        bcy *= bcScale;
        bcz *= bcScale;

        const cdScale = 1 / Math.sqrt(cdx * cdx + pqy2 + cdz * cdz);
        cdx *= cdScale;
        cdy *= cdScale;
        cdz *= cdScale;

        const daScale = 1 / Math.sqrt(dax * dax + pqy2 + daz * daz);
        dax *= daScale;
        day *= daScale;
        daz *= daScale;

        // Add unit vectors and renormalize.
        let nx = abx + bcx + cdx + dax;
        let ny = aby + bcy + cdy + day;
        let nz = abz + bcz + cdz + daz;
        const nScale = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);

        normals[ip++] = nScale * nx;
        normals[ip++] = nScale * ny;
        normals[ip++] = nScale * nz;
      }
    }
    /** Indices by tracing a grid as triangles, two per grid square. */
    ip = 0;
    for (let j = 0, i0 = 0; j < ijMax; ++j, i0 += y.length) {
      for (let i = 0; i < ijMax; ++i) {
        const nw = i0 + i;
        const sw = nw + 1;
        const ne = nw + y.length;
        const se = ne + 1;
        indices[ip++] = nw;
        indices[ip++] = se;
        indices[ip++] = ne;
        indices[ip++] = se;
        indices[ip++] = nw;
        indices[ip++] = sw;
      }
    }
    return { positions, normals, indices };
  }

  public getElevationAt(_x: number, _z: number): number {
    return -10;
  }
}
