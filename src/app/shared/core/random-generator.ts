export function make32BitRandomGenerator(a: number, b: number, c: number, d: number): () => number {
  a |= 0;
  b |= 0;
  c |= 0;
  d |= 0;
  return () => {
    let t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return t >>> 0;
  };
}
