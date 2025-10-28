import { Injectable } from '@angular/core';
import { Point2D, Point2DInterface } from '../../shared/classes/graphics';
import { Utility } from '../../shared/classes/utility';
import { BitVector } from '../../shared/core/bitvector';

const GRID_SIZE_MM = 2.5;
const GRID_COUNT = 1000 / GRID_SIZE_MM;

const TEST_POLYGON = [new Point2D(1, 2), new Point2D(5, 3), new Point2D(4, 6), new Point2D(3, 4), new Point2D(3, 7)];

type Edge = {
  a: Point2DInterface; // least y; first processed
  b: Point2DInterface; // greatest y; last processed
  invSlope: number;
};

/** Returns the y-coordinate of the scan line where `y` lies. */
function getScanLineY(y: number): number {
  return Math.floor(y / GRID_SIZE_MM);
}

/** Returns an edge where `a` has least y or `undefined` if both points are on the same scan line. */
function createEdge(p: Point2DInterface, q: Point2DInterface): Edge | undefined {
  const invSlope = (p.x - q.x) / (p.y - q.y);
  const psy = getScanLineY(p.y);
  const qsy = getScanLineY(q.y);
  return psy < qsy ? { a: p, b: q, invSlope } : psy > qsy ? { a: q, b: p, invSlope } : undefined;
}

/** Returns edge x for given scan line y, clampled to the edge's x extent. */
function getEdgeX(edge: Edge, sy: number): number {
  const y = sy * GRID_SIZE_MM;
  return y < edge.a.y ? edge.a.x : y > edge.b.y ? edge.b.x : edge.a.x + edge.invSlope * (y - edge.a.y);
}

/*
function toGrid(x: number): number {
  return Math.floor(x / GRID_SIZE_MM);
}
  */

function emitSpans(edges: Edge[], sy: number): void {
  for (let i = 0; i < edges.length; i += 2) {
    const xLeft = getEdgeX(edges[i], sy);
    const xRight = getEdgeX(edges[i + 1], sy);
    console.log('span:', (sy * GRID_SIZE_MM).toFixed(2), xLeft.toFixed(3), xRight.toFixed(3));
  }
}

@Injectable({ providedIn: 'root' })
export class ObjectPlacementService {
  /*
  private widthMm: number = 250;
  private depthMm: number = 210;
  private heightMm: number = 220;
  private scale: number = 1;
  */
  private readonly grid = new BitVector(Utility.sqr(GRID_COUNT)); // Max 1m square bed

  public scanConvert(polygon: Point2DInterface[], emitSpans: (ael: Edge[], sy: number) => void): void {
    const gel: Edge[] = [];
    for (let p = 0, q = polygon.length - 1; p < polygon.length; q = p++) {
      const edge = createEdge(polygon[p], polygon[q]);
      if (edge !== undefined) {
        gel.push(edge);
      }
    }
    gel.sort((e, f) => f.a.y - e.a.y); // Sort on least y, smallest at tail.
    const ael: Edge[] = [];
    const lastScanLineY = getScanLineY(gel[0].b.y);
    for (let sy = getScanLineY(gel[gel.length - 1].a.y); sy <= lastScanLineY; ++sy) {
      emitSpans(ael, sy);
      let addedEdge = false;
      for (let e = gel[gel.length - 1]; e !== undefined && getScanLineY(e.a.y) === sy; e = gel[gel.length - 1]) {
        gel.length--;
        ael.push(e);
        addedEdge = true;
      }
      Utility.remove(ael, e => getScanLineY(e.b.y) === sy);
      ael.sort((a, b) => getEdgeX(a, sy) - getEdgeX(b, sy) || a.invSlope - b.invSlope);
      if (addedEdge) {
        // Added edges may include new pixels, so re-emit.
        emitSpans(ael, sy);
      }
    }
  }

  /** Sets grid pixels of the span given in grid coordinates. */
  public setSpan(x0: number, x1: number, y: number): void {
    if (y < 0 || y >= GRID_COUNT) {
      return;
    }
    if (x0 < 0) {
      x0 = 0;
    }
    if (x1 >= GRID_COUNT) {
      x1 = GRID_COUNT - 1;
    }
    if (x0 > x1) {
      return;
    }
    const base = y * GRID_COUNT;
    for (let x = x0; x <= x1; ++x) {
      this.grid.setBit(base + x);
    }
  }

  public clearGrid(): void {
    this.grid.clearAll();
  }

  public test() {
    this.scanConvert(TEST_POLYGON, emitSpans);
  }
}
