import { Injectable } from '@angular/core';
import { EventBrokerService } from '../../shared/services/event-broker.service';
import { Manifold, Mesh, Vec3 } from 'manifold-3d';
import { cleanup } from 'manifold-3d/lib/garbage-collector.js';
import { Mat2x3, Print3dModelService } from './print-3d-model.service';

export class Printing3dConfig {
  /**
   * @param modelMmPerWorldM model millimeters per world meter
   * @param minFeatureSizeMm minimum printable feature size
   */
  constructor(
    public readonly modelMmPerWorldM: number = 230 / 44,
    public readonly minFeatureSizeMm: number = 1,
    public readonly name: string = '',
    public readonly printDx: number = 250, // width
    public readonly printDy: number = 210, // depth
    public readonly printDz: number = 220, // height
  ) {}
}

/**
 * State of the OBJ file formatter `getObjText(mesh)` allowing several of
 * its return values to be concatenated in a single file.
 */
class ObjFileContext {
  normalIndices: { [key: string]: number } = {};
  baseVertexIndex: number = 0;
  nextNormalIndex: number = 0;
}

@Injectable({ providedIn: 'root' })
export class Printing3dService {
  private config = new Printing3dConfig();

  constructor(
    eventBrokerService: EventBrokerService,
    private readonly print3dModelService: Print3dModelService,
    //objectPlacementService: ObjectPlacementService,
  ) {
    eventBrokerService.print3dRequest.subscribe(() => this.emit3dPrint2());
    //eventBrokerService.print3dRequest.subscribe(() => objectPlacementService.test());
  }

  public setConfig(config: Printing3dConfig) {
    this.config = config;
  }

  private async emit3dPrint2(): Promise<void> {
    // Load Manifold.
    await this.print3dModelService.initialize();

    const modelMmPerWorldM = this.config.modelMmPerWorldM;
    const minFeatureSize = this.config.minFeatureSizeMm;
    const gmy = this.print3dModelService.getGeometry(modelMmPerWorldM, minFeatureSize);

    // ---- Trusses ----

    const trussesText: string[] = [];
    const trussesContext = new ObjFileContext();

    const frontTruss = this.print3dModelService.buildTruss(gmy, [modelMmPerWorldM, 0, 0, modelMmPerWorldM, 0, 0]);

    this.saveMeshAndFree(frontTruss, 'FrontTruss', trussesText, trussesContext);

    const trussBoundingBox = frontTruss.boundingBox();
    const tBbDx = trussBoundingBox.max[0] - trussBoundingBox.min[0];
    const tBbDy = trussBoundingBox.max[1] - trussBoundingBox.min[1];

    // Place second truss in row or column depending on largest dimension.
    const rearTrussXform: Mat2x3 =
      tBbDx > tBbDy
        ? [modelMmPerWorldM, 0, 0, -modelMmPerWorldM, 0, 2 * trussBoundingBox.min[1] - minFeatureSize]
        : [modelMmPerWorldM, 0, 0, -modelMmPerWorldM, tBbDx + minFeatureSize, trussBoundingBox.min[1]];

    const rearTruss = this.print3dModelService.buildTruss(gmy, rearTrussXform);

    this.saveMeshAndFree(rearTruss, 'RearTruss', trussesText, trussesContext);
    this.downloadObjFileText(trussesText, '3d-trusses');

    // ---- Placement control ----

    const gap = 0.5;
    let placementX = 0;
    const advancePlacementX = (manifold: Manifold): number => {
      const bb = manifold.boundingBox();
      return (placementX += bb.max[0] - bb.min[0] + gap);
    };

    // ---- Abutments ----

    const abutmentsText: string[] = [];
    const abutmentsContext = new ObjFileContext();

    const leftAbutment = this.print3dModelService.buildAbutment(gmy, placementX);

    this.saveMeshAndFree(leftAbutment, 'LeftAbutment', abutmentsText, abutmentsContext);
    advancePlacementX(leftAbutment);

    const rightAbutment = this.print3dModelService.buildAbutment(gmy, placementX);

    this.saveMeshAndFree(rightAbutment, 'RightAbutment', abutmentsText, abutmentsContext);
    advancePlacementX(rightAbutment);

    // ---- Anchorages ----
    for (const side of this.print3dModelService.anchorages) {
      const anchorage = this.print3dModelService.buildAnchorage(gmy, placementX);

      this.saveMeshAndFree(anchorage, `${side}Anchorage`, abutmentsText, abutmentsContext);
      advancePlacementX(anchorage);
    }

    // ---- Pier ----

    if (this.print3dModelService.isPier) {
      const pier = this.print3dModelService.buildPier(gmy, placementX);

      this.saveMeshAndFree(pier, 'Pier', abutmentsText, abutmentsContext);
      advancePlacementX(pier);
    }
    this.downloadObjFileText(abutmentsText, 'abutments');

    // ---- Cross members

    const crossMembersText: string[] = [];
    const crossMembersContext = new ObjFileContext();
    placementX = 0;
    let placementY = 0;
    const memberIter = this.print3dModelService.crossMemberJointsIterator();
    for (let iteration = memberIter.next(); !iteration.done; iteration = memberIter.next()) {
      const joint = iteration.value;

      const crossMember = this.print3dModelService.buildCrossMember(gmy, iteration.value, placementX, placementY);

      this.saveMeshAndFree(crossMember, `CrossMember_${joint.number}`, crossMembersText, crossMembersContext);
      advancePlacementX(crossMember);
    }

    // ---- Deck panels
    placementX = 0;
    placementY += gmy.modelMmPerWorldM * gmy.bridgeWidth + gap;
    const panelIter = this.print3dModelService.deckPanelJointsIterator();
    const middleJointIndex = this.print3dModelService.deckPanelCount >>> 1;
    for (let iteration = panelIter.next(); !iteration.done; iteration = panelIter.next()) {
      const joint = iteration.value;

      const panel = this.print3dModelService.buildDeckPanel(gmy, joint, placementX, placementY);

      this.saveMeshAndFree(panel, `DeckPanel_${joint.number}`, crossMembersText, crossMembersContext);
      // Place in two rows.
      if (joint.index === middleJointIndex) {
        placementX = 0;
        placementY += gmy.modelMmPerWorldM * gmy.roadwayWidth + gap;
      } else {
        advancePlacementX(panel);
      }
    }
    this.downloadObjFileText(crossMembersText, 'cross-members');
  }

  /** Saves OBJ file text for given manifold mesh to given text, then frees all manifolds. */
  private saveMeshAndFree(manifold: Manifold, objectName: string, text: string[], ctx: ObjFileContext): void {
    text.push(...this.getObjText(ctx, objectName, manifold.getMesh()));
    cleanup();
  }

  /**
   * Gets a chunk of text lines constituting an OBJ file object for the given mesh. Multiple chunks
   * may be concatenated (in exact order gotten) for all calls that provided the same context.
   *
   * @param ctx context within a single OBJ file to be emitted
   * @param name desired OBJ file object name
   * @param mesh Manifold Mesh to be used as source data
   * @returns array of text lines
   */
  private getObjText(ctx: ObjFileContext, name: string, mesh: Mesh): string[] {
    const coords = mesh.vertProperties;
    const text: string[] = [`o ${name}\n`];
    for (let i = 0; i < coords.length; i += 3) {
      text.push(`v ${toNice(coords[i])} ${toNice(coords[i + 1])} ${toNice(coords[i + 2])}\n`);
    }
    const indices = mesh.triVerts;
    for (let i = 0; i < indices.length; i += 3) {
      const ia = indices[i];
      const ib = indices[i + 1];
      const ic = indices[i + 2];
      const normal = getTriangleNormal(coords, ia, ib, ic);
      const key = getNormalString(normal);
      let normalIndex = ctx.normalIndices[key];
      if (normalIndex === undefined) {
        text.push(`vn ${key}\n`);
        ctx.normalIndices[key] = normalIndex = ctx.nextNormalIndex++;
      }
      const nn = 1 + normalIndex; // Normal number
      const vnb = 1 + ctx.baseVertexIndex; // Vertex number base
      text.push(`f ${vnb + ia}//${nn} ${vnb + ib}//${nn} ${vnb + ic}//${nn}\n`);
    }
    ctx.baseVertexIndex += coords.length / 3;
    return text;
  }

  private downloadObjFileText(text: string[], kind: string): void {
    const blob = new Blob(text, { type: 'model/obj' });
    const anchorElement = window.document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    anchorElement.href = url;
    let fileName = kind;
    if (this.config.name.length > 0) {
      fileName += `-${this.config.name}`;
    }
    fileName += '.obj';
    anchorElement.download = fileName;
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(anchorElement.href);
  }
}

/** Returns slightly rounded normal coordinates as a string. Rounding reduces file size. */
function getNormalString(n: Vec3): string {
  return `${toNice(n[0])} ${toNice(n[1])} ${toNice(n[2])}`;
}

/** Returns a string representation of given number with 6 digits of precision and superfluous zeros elided. */
function toNice(x: number): string {
  return x.toPrecision(6).replace(/\.0*$|(\.\d*[1-9])0*$/, '$1');
}

/** Returns the unit normal of triangle with given indices. Uses Newell's method. */
function getTriangleNormal(coords: Float32Array, ia: number, ib: number, ic: number): Vec3 {
  const a = coords.slice(ia * 3);
  const b = coords.slice(ib * 3);
  const c = coords.slice(ic * 3);
  let nx = 0;
  let ny = 0;
  let nz = 0;
  nx += (a[1] - b[1]) * (a[2] + b[2]);
  ny += (a[2] - b[2]) * (a[0] + b[0]);
  nz += (a[0] - b[0]) * (a[1] + b[1]);
  nx += (b[1] - c[1]) * (b[2] + c[2]);
  ny += (b[2] - c[2]) * (b[0] + c[0]);
  nz += (b[0] - c[0]) * (b[1] + c[1]);
  nx += (c[1] - a[1]) * (c[2] + a[2]);
  ny += (c[2] - a[2]) * (c[0] + a[0]);
  nz += (c[0] - a[0]) * (c[1] + a[1]);
  const len = Math.hypot(nx, ny, nz);
  return [nx / len, ny / len, nz / len];
}
