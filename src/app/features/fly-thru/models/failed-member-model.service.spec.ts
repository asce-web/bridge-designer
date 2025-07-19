import { projectLocalMatchers } from '../../../shared/test/jasmine-matchers';
import { FailedMemberModelService } from './failed-member-model.service';
import { mat4, vec2, vec3, vec4 } from 'gl-matrix';

describe('FailedMemberModelService', () => {
  let service: FailedMemberModelService;
  const s0 = vec2.fromValues(0, 0);
  const s1 = vec2.fromValues(1, 0);
  const s2 = vec2.fromValues(1, 1);
  const s3 = vec2.fromValues(0, 1);
  const searchData = [
    0.0, 0.0625, 0.125, 0.15625, 0.1875, 0.21875, 0.25, 0.28125, 0.3125, 0.34375, 0.375, 0.40625, 0.4375, 0.46875, 0.5,
    0.53125, 0.5625, 0.59375, 0.625, 0.65625, 0.6875, 0.71875, 0.75, 0.78125, 0.8125, 0.84375, 0.875, 0.90625, 0.9375,
    0.96875, 0.984375, 0.992188, 1.0,
  ];

  beforeEach(() => {
    jasmine.addMatchers(projectLocalMatchers);
    service = new FailedMemberModelService();
  });

  it('should create a valid segment transform matrix for a random trapezoid', () => {
    const p0 = vec2.fromValues(1, 1);
    const p1 = vec2.fromValues(2, 0.5);
    const p2 = vec2.fromValues(2.5, 22);
    const t = 1.5;
    const p3 = vec2.scaleAndAdd(vec2.create(), p2, vec2.sub(vec2.create(), p0, p1), t);

    const result = service.buildSegmentTransform(mat4.create(), p0, p1, p2, t);

    const r0 = transform(result, s0, 50, 1);
    const r1 = transform(result, s1, 51, 1);
    const r2 = transform(result, s2, 52, 1);
    const r3 = transform(result, s3, 53, 1);

    expect(r0).toNearlyEqual(vec3.fromValues(p0[0], p0[1], 50), 1e-6);
    expect(r1).toNearlyEqual(vec3.fromValues(p1[0], p1[1], 51), 1e-6);
    expect(r2).toNearlyEqual(vec3.fromValues(p2[0], p2[1], 52), 1e-6);
    expect(r3).toNearlyEqual(vec3.fromValues(p3[0], p3[1], 53), 1e-6);
  });

  it('encode normals as intended', () => {
    const p0 = vec2.fromValues(-3, -1);
    const p1 = vec2.fromValues(3, -1);
    const p2 = vec2.fromValues(1.5, 1);
    const t = 1/3; // (-1, 1)
    const p3 = vec2.scaleAndAdd(vec2.create(), p2, vec2.sub(vec2.create(), p0, p1), t);

    const r = service.buildSegmentTransform(mat4.create(), p0, p1, p2, t);
    
    const d = 1 + at(r, 3, 1);
    const n0x = at(r, 0, 3) - (at(r, 0, 1) + at(r, 0, 3)) / d;
    const n0y = at(r, 1, 3) - (at(r, 1, 1) + at(r, 1, 3)) / d;
    const n1x = at(r,0,0) + at(r,0,3) - (at(r,0,0) + at(r,0,1) + at(r,0,3)) / d;
    const n1y = at(r,1,0) + at(r,1,3) - (at(r,1,0) + at(r,1,1) + at(r,1,3)) / d;

    const n0 = vec2.fromValues(n0x, n0y);
    const n1 = vec2.fromValues(n1x, n1y);

    const expectedN0 = vec2.sub(vec2.create(), p0, p3);
    const expectedN1 = vec2.sub(vec2.create(), p1, p2);

    expect(n0).toNearlyEqual(expectedN0, 1e-5);
    expect(n1).toNearlyEqual(expectedN1, 1e-5);
  });

  function at(m: mat4, i: number, j: number): number {
    return m[j * 4 + i];
  }

  function transform(m: mat4, xy: vec2, z: number, w: number): vec3 {
    const x3 = vec4.fromValues(xy[0], xy[1], z, w);
    const r = vec4.transformMat4(vec4.create(), x3, m);
    // Do the same special transform as the shader will.
    return vec3.fromValues(r[0] / r[3], r[1] / r[3], r[2]);
  }

  it('should search data values correctly', () => {
    for (const x of searchData) {
      const index = FailedMemberModelService.searchFloor(x, searchData);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(searchData.length);
      expect(searchData[index]).toBeLessThanOrEqual(x);
      if (index !== searchData.length - 1) {
        expect(searchData[index + 1]).toBeGreaterThan(x);
      }
    }
  });

  it('should search non-data values correctly', () => {
    for (let x = 0; x <= 1; x += 1 / 1024) {
      const index = FailedMemberModelService.searchFloor(x, searchData);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(searchData.length);
      expect(searchData[index]).toBeLessThanOrEqual(x);
      if (index !== searchData.length - 1) {
        expect(searchData[index + 1]).toBeGreaterThan(x);
      }
    }
  });

  it('should have buckled height zero if no actual buckling', () => {
    const height = FailedMemberModelService.getParabolaHeight(42, 42);
    expect(height).toBe(0);
  });

  it('should have height equal to half of length if completely bucked', () => {
    const height = FailedMemberModelService.getParabolaHeight(0, 42);
    expect(height).toBe(21);
  });

  it('should look up a reasonable height', () => {
    const height = FailedMemberModelService.getParabolaHeight(21, 42);
    expect(height).toBeCloseTo(17.1633, 1e-4);
  });
});
