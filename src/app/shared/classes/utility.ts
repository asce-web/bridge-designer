/** Generic static utility functions. */
export class Utility {
  public static sqr(x: number): number {
    return x * x;
  }

  public static p4(x: number): number {
    return Utility.sqr(Utility.sqr(x));
  }

  public static inRange(x: number, lo: number, hi: number): boolean {
    return lo <= x && x <= hi;
  }

  /** Returns [0, 1, ... n-1]. */
  public static indices(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
