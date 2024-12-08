export class Deque<T> {
  private readonly right: Side<T> = new Side();
  private readonly left: Side<T> = new Side();

  public pushRight(item: T): void {
    this.right.push(item, this.left);
  }

  public pushLeft(item: T): void {
    this.left.push(item, this.right);
  }

  public popRight(): T | undefined {
    return this.right.pop(this.left);
  }

  public popLeft(): T | undefined {
    return this.left.pop(this.right);
  }
  
  public clear(): void {
    this.left.data.length = this.right.data.length = this.left.base = this.right.base = 0;
  }

  public get length(): number {
    return this.left.length + this.right.length;
  }

  public get fullness(): number {
    const den = this.left.data.length + this.right.data.length;
    return den > 0 ? (this.left.length + this.right.length) / den : 1;
  }
}

class Side<T> {
  constructor(public base: number = 0, public data: T[] = []) {}

  get length(): number {
    return this.data.length - this.base;
  }

  push(item: T, otherSide: Side<T>): void {
    if (otherSide.base > 0) {
      otherSide.data[--this.base] = item;
    } else {
      this.data.push(item);
    }
  }

  pop(otherSide: Side<T>): T | undefined {
    if (this.length > 0) {
      return this.data.pop();
    }
    if (otherSide.length > 0) {
      return otherSide.popBase();
    }
    return undefined;
  }

  private popBase(): T {
    const popped = this.data[this.base++];
    if (this.base > this.data.length / 2) {
      this.data.copyWithin(0, this.base, this.data.length);
      this.data.length -= this.base;
      this.base = 0;
    }
    return popped;
  }
}

