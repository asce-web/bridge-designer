import { Injectable } from '@angular/core';
import { BridgeService } from '../../../shared/services/bridge.service';
import { MeshData } from '../rendering/mesh-rendering.service';
import { Geometry } from '../../../shared/classes/graphics';
import { TerrainModelService } from './terrain-model.service';
import { SiteConstants } from '../../../shared/classes/site.model';

@Injectable({ providedIn: 'root' })
export class PierModelService {
  private static readonly PILLOW_HEIGHT = 0.4;
  private static readonly BASE_HEIGHT = 1.4;
  private static readonly BASE_TAPER = 1;
  /**
   * The maximum tex-S value. Should be an integer to avoid a seam.
   * The tex-S coord is the counter-clockwise scaled perimeter distance from the
   * rear (negative z) edge.
   */
  private static readonly TEX_S_MAX = 12;

  private static readonly pierHalfWidth = 0.5;
  private static readonly pierCusp = 0.3;
  private static readonly pierTaper = 1.1;
  private static readonly pierBaseShoulder = 0.5;

  private readonly positions = new Float32Array(186);
  private readonly normals = new Float32Array(186);
  private readonly texCoords = new Float32Array(124);
  private readonly indices = new Uint16Array(108);

  constructor(private readonly bridgeService: BridgeService) {
    console.log(this.bridgeService.designConditions.isPier);
  }

  /** Build mesh data for the pier of the current bridge, if any. Model origin center of pier top. */
  public buildMeshDataForPier(): MeshData {
    let ip = 0,
      ii = 0,
      it = 0;
    // The structure never varies except in vertical size and depth (bridge width), so
    // we can use static arrays. Could have done with a static model and vertical scaling
    // model transform acting also on the tex coords in the shader to avoid distortion.
    // But this seems more robust.
    const positions = this.positions;
    const normals = this.normals;
    const texCoords = this.texCoords;
    const indices = this.indices;

    const addPrism = (y: number, w: number, h: number, d: number, c: number, taper: number): void => {
      // top polygon as triangle fan counter-clockwise from the top
      const topPolygonCenterVertexIndex = ip / 3;
      positions[ip] = positions[ip + 2] = 0;
      positions[ip + 1] = y;
      normals[ip + 1] = 1;
      ip += 3;
      texCoords[it] = texCoords[it + 1] = 0;
      it += 2;
      // prettier-ignore
      { 
        positions[ip +  0] = 0; positions[ip +  1] = y; positions[ip +  2] =-(d + c); // 0
        positions[ip +  3] =-w; positions[ip +  4] = y; positions[ip +  5] =-d;       // 1
        positions[ip +  6] =-w; positions[ip +  7] = y; positions[ip +  8] = d;       // 2
        positions[ip +  9] = 0; positions[ip + 10] = y; positions[ip + 11] = d + c;   // 3
        positions[ip + 12] = w; positions[ip + 13] = y; positions[ip + 14] = d;       // 4
        positions[ip + 15] = w; positions[ip + 16] = y; positions[ip + 17] =-d;       // 5
      }
      // Accumulate perimeter lengths of top polygon. For this we need only two edge lengths.
      const d0 = Geometry.distance2D(positions[ip + 0], positions[ip + 2], positions[ip + 3], positions[ip + 5]);
      const d1 = Geometry.distance2D(positions[ip + 3], positions[ip + 5], positions[ip + 6], positions[ip + 8]);
      // This contains the full perimeter of arc lengths with 0 and TEX_S_MAX both assigned to the
      // same point, which is where the tex-s coordinates start and end.
      const arcLengths = [0, d0, d1, d0, d0, d1, d0];
      arcLengths.reduce((prev, current, i, a) => (a[i] = prev + current));
      const arcScale = PierModelService.TEX_S_MAX / arcLengths[arcLengths.length - 1];
      for (let i = 0; i < arcLengths.length; ++i) {
        arcLengths[i] *= arcScale;
      }

      // Add the normals and texCoords for positions above.
      const topPolygonVertexCount = 6;
      for (let i = 0, i2 = 0, i3 = 0; i < topPolygonVertexCount; ++i, i2 += 2, i3 += 3) {
        normals[ip + i3 + 1] = 1;
        // Tex coords are x-z rotated pi/2 to better match the the wide faces.
        texCoords[it + i2 + 0] = -positions[ip + i3 + 2] * arcScale;
        texCoords[it + i2 + 1] = positions[ip + i3 + 0] * arcScale;
      }

      // side quads counter-clockwise from the top
      // In variable names, p connotes "leading," q "trailing" in traversal around CCW polygons.
      // The loop builds the q-->p quad 5-->0 quad first, which needs arc length indices qa-->pa
      // of 5-->6. Successive quads are normal: 0-->1, 1--2, ... 4-->5.
      const topPolygonIp = ip;
      ip += topPolygonVertexCount * 3;
      it += topPolygonVertexCount * 2;
      const sideQuadsVertexIndex = ip / 3;
      for (
        let i = 0, q = (topPolygonVertexCount - 1) * 3, p = 0, pa = topPolygonVertexCount, qa = pa - 1;
        i < topPolygonVertexCount;
        ++i, q = p, p += 3, pa = (pa + 1) % topPolygonVertexCount, qa = pa - 1
      ) {
        // trailing top
        const qtx = positions[topPolygonIp + q + 0];
        const qty = positions[topPolygonIp + q + 1];
        const qtz = positions[topPolygonIp + q + 2];
        // leading top
        const ptx = positions[topPolygonIp + p + 0];
        const pty = positions[topPolygonIp + p + 1];
        const ptz = positions[topPolygonIp + p + 2];
        // trailing bottom
        const qbx = taper * qtx;
        const qby = y - h;
        const qbz = taper * qtz;
        // leading bottom
        const pbx = taper * ptx;
        const pby = y - h;
        const pbz = taper * ptz;
        // trailing and leading s-tex coord
        const qsTex = arcLengths[qa];
        const psTex = arcLengths[pa];
        const tTopTex = qty * arcScale;
        const tBottomTex = qby * arcScale;

        // add quad of vertices in counter-clockwise order
        positions[ip + 0] = qtx;
        positions[ip + 1] = qty;
        positions[ip + 2] = qtz;

        positions[ip + 3] = qbx;
        positions[ip + 4] = qby;
        positions[ip + 5] = qbz;

        positions[ip + 6] = pbx;
        positions[ip + 7] = pby;
        positions[ip + 8] = pbz;

        positions[ip + 9] = ptx;
        positions[ip + 10] = pty;
        positions[ip + 11] = ptz;

        texCoords[it + 0] = qsTex;
        texCoords[it + 1] = tTopTex;

        texCoords[it + 2] = qsTex;
        texCoords[it + 3] = tBottomTex;

        texCoords[it + 4] = psTex;
        texCoords[it + 5] = tBottomTex;

        texCoords[it + 6] = psTex;
        texCoords[it + 7] = tTopTex;

        // For normal, arbitrarily choose normalize((pt - qt) X (pb - qt)).
        // (pb - qt)
        const btx = qtx - pbx;
        const bty = qty - pby;
        const btz = qtz - pbz;
        // (pt - qt)
        const ttx = ptx - qtx;
        const tty = pty - qty;
        const ttz = ptz - qtz;
        // cross
        let nx = btz * tty - bty * ttz;
        let ny = btx * ttz - btz * ttx;
        let nz = bty * ttx - btx * tty;
        // scale
        const s = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
        nx *= s;
        ny *= s;
        nz *= s;
        // Set all vertices of the quad.
        for (let i = 0; i < 12; i += 3) {
          normals[ip + i + 0] = nx;
          normals[ip + i + 1] = ny;
          normals[ip + i + 2] = nz;
        }
        ip += 12;
        it += 8;
      }
      // Indicies for top triangle fan
      for (let i = 0, q = topPolygonVertexCount, p = 1; i < topPolygonVertexCount; ++i, q = p++) {
        indices[ii++] = topPolygonCenterVertexIndex;
        indices[ii++] = topPolygonCenterVertexIndex + q;
        indices[ii++] = topPolygonCenterVertexIndex + p;
      }
      // Outer surface quads, two triangles each.
      for (let i = 0, p = 0; i < topPolygonVertexCount; ++i, p += 4) {
        indices[ii++] = sideQuadsVertexIndex + p;
        indices[ii++] = sideQuadsVertexIndex + p + 2;
        indices[ii++] = sideQuadsVertexIndex + p + 3;
        indices[ii++] = sideQuadsVertexIndex + p + 2;
        indices[ii++] = sideQuadsVertexIndex + p;
        indices[ii++] = sideQuadsVertexIndex + p + 1;
      }
    };
    // Stack the two prisms.
    const conditions = this.bridgeService.designConditions;
    const halfDepth = this.bridgeService.bridgeHalfWidth;
    const yWater = TerrainModelService.WATER_LEVEL + SiteConstants.GAP_DEPTH - conditions.deckElevation;
    const yPierTop = conditions.isHiPier ? 0 : -conditions.underClearance;
    const pierHeight = yPierTop - yWater;
    addPrism(
      -PierModelService.PILLOW_HEIGHT,
      PierModelService.pierHalfWidth,
      pierHeight - PierModelService.BASE_HEIGHT - PierModelService.PILLOW_HEIGHT,
      halfDepth,
      PierModelService.pierCusp,
      PierModelService.pierTaper,
    );
    addPrism(
      PierModelService.BASE_HEIGHT - pierHeight,
      PierModelService.pierHalfWidth * PierModelService.pierTaper + PierModelService.pierBaseShoulder,
      PierModelService.BASE_HEIGHT,
      halfDepth * PierModelService.pierTaper + PierModelService.pierBaseShoulder * 0.5,
      PierModelService.pierCusp * PierModelService.pierTaper + PierModelService.pierBaseShoulder * 0.5,
      PierModelService.BASE_TAPER,
    );
    return { positions, normals, texCoords, indices };
  }
}
