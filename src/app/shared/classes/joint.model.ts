import { Geometry, Point2DInterface } from "../classes/graphics";
import { Editable } from "./editing";

/** A point in the world where members join. */
export class Joint implements Point2DInterface, Editable {
  constructor(
    public index: number, 
    public x: number, 
    public y: number, 
    public isFixed: boolean,
  ) { }

  public get number() {
    return this.index + 1;
  }

  public isAt(p: Point2DInterface) {
    return Geometry.areColocated2D(this, p, Geometry.SMALL_SQUARED);
  }

  public toString(): string {
    return `Joint(${this.index}: ${this.x}, ${this.y})`;
  }

  swapContents(other: Joint): void {
    [this.index, other.index] = [other.index, this.index];
    [this.x, other.x] = [other.x, this.x];
    [this.y, other.y] = [other.y, this.y];
    [this.isFixed, other.isFixed] = [other.isFixed, this.isFixed];
  }
}
