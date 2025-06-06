import { makeRandomGenerator } from "./random-generator";

describe ('makeRandomGenerator', () => {
  it('should have reasonable distribution', () =>{
    const binCount = 10;
    const bins = new Uint32Array(binCount);
    const generator = makeRandomGenerator(42, 48509403, 3098410783, 5958759387);
    for (let i = 0; i < 1000; ++i) {
      const value = generator();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
      ++bins[Math.trunc(value * binCount)];
    }
    bins.forEach((value, index)=> expect(value).withContext(`index: ${index}`).toBeGreaterThan(10));
  })
});