import { BridgeModel } from '../classes/bridge.model';
import { Point2DInterface } from '../classes/graphics';
import { Joint } from '../classes/joint.model';

declare global {
  namespace jasmine {
    interface Matchers<T> {
      toNearlyEqual(expected: T, precision?: number): boolean;
    }
  }
}

/**
 * Returns a failure reason for a deep comparison of equality excepting that numbers must match only to
 * specified precision. Object prototype differences are ignored. Comparisons of number with bigint are exact.
 * Successful matches return undefined.
 */
export function getReasonNotDeeplyEqual(
  a: any,
  b: any,
  precision: number = 0,
  path: string[] = ['TOP'],
): string | undefined {
  // Short circuit for equal primitive types, two undefined or null values, identical objects.
  if (a === b) {
    return undefined;
  }
  function comparisonTypeOf(x: any): string {
    return x === null ? 'null' : Array.isArray(x) ? 'array' : typeof x;
  }
  /** Avoid attempts to print symbols, which throw. Nested symbols, too. */
  function safeToString(x: any) {
    const comparisonType = comparisonTypeOf(x);
    return ['array', 'object', 'symbol'].includes(comparisonType) ? `<${comparisonType}>` : x;
  }
  function chop(x: any[], maxLen: number = 50): any[] {
    if (x.length >= maxLen) {
      x.length = maxLen;
      x.push('...');
    }
    return x;
  }
  const aType = comparisonTypeOf(a);
  const bType = comparisonTypeOf(b);
  // Short circuit number vs. bigint comparisons, a special case.
  if ((aType === 'bigint' && bType === 'number') || (aType === 'number' && bType === 'bigint')) {
    return a == b ? undefined : `bigint and number unequal @${path.join('')}: ${a} != ${b}`;
  }
  // Short circuit for any other kind of type mismatch.
  if (aType !== bType) {
    return `type missmatch @${path.join('')}: ${aType} != ${bType} (${safeToString(a)} != ${safeToString(b)})`;
  }
  // Short circuit numbers for an imprecise match for numbers.
  if (aType === 'number') {
    const epsilon = Math.max(Math.abs(a), Math.abs(b)) * precision;
    return Math.abs(a - b) < epsilon
      ? undefined
      : `numerically unequal with eps=${epsilon} @${path.join('')}: ${a} !~ ${b}`;
  }
  // Short circuit with recurrence for array elements.
  if (aType === 'array') {
    if (a.length !== b.length) {
      return `array length mismatch @${path.join('')}: ${a.length} != ${b.length})`;
    }
    for (let i = 0; i < a.length; i++) {
      const msg = getReasonNotDeeplyEqual(a[i], b[i], precision, path.concat(`[${i}]`));
      if (msg) {
        return msg;
      }
    }
    // The arrays are equal.
    return undefined;
  }
  // Short circuit with recurrence for object fields.
  if (aType === 'object') {
    // Fields comparison. Reject any dissimilarity.
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    const aNotB = chop(keysA.filter(key => !keysB.includes(key)));
    const bNotA = chop(keysB.filter(key => !keysA.includes(key)));
    if (aNotB.length > 0 || bNotA.length > 0) {
      return `field mismatch @${path.join('')}: only in ${a.constructor.name} are {${aNotB}}; only in ${b.constructor.name} are {${bNotA}}`;
    }
    for (let key of keysA) {
      const msg = getReasonNotDeeplyEqual(a[key], b[key], precision, path.concat(`.${key}`));
      if (msg) {
        return msg;
      }
    }
    return undefined;
  }
  // A pair with the same stringifiable primitive types.
  return a === b ? undefined : `value mismatch @${path.join('')}: ${safeToString(a)} != ${safeToString(b)}`;
}

export const projectLocalMatchers: jasmine.CustomMatcherFactories = {
  toNearlyEqual: (_matchersUtil: jasmine.MatchersUtil): jasmine.CustomMatcher => {
    return {
      compare: (actual: any, expected: any, precision: number = 1e-9): jasmine.CustomMatcherResult => {
        const message = getReasonNotDeeplyEqual(actual, expected, precision);
        return message === undefined
          ? { pass: true, message: `equal with numeric precision ${precision}` }
          : { pass: false, message };
      },
    };
  },
};

/** Returns a list of structure violations of the given bridge. Empthy is good. */
export function validateBridge(bridge: BridgeModel): string[] {
  const problems = [];
  const joints = bridge.joints;
  const jointSet = new Set<Joint>();
  const jointCount = joints.length;
  for (let i = 0; i < jointCount; ++i) {
    if (jointSet.has(joints[i])) {
      problems.push(`duplicate joint ${joints[i]}`);
    }
    jointSet.add(joints[i]);
  }
  const members = bridge.members;
  const memberCount = members.length;
  for (let i = 0; i < jointCount; ++i) {
    if (joints[i].index !== i) {
      problems.push(`joint at ${i} has .index ${joints[i].index}`);
    }
  }
  for (let i = 0; i < memberCount; ++i) {
    if (members[i].index !== i) {
      problems.push(`member at ${i} has .index ${members[i].index}`);
    }
  }
  const memberKeySet = new Set<string>();
  for (let i = 0; i < memberCount; ++i) {
    const key = members[i].key;
    if (memberKeySet.has(key)) {
      problems.push(`duplicate member key ${key}`);
    }
    memberKeySet.add(key);
    if (members[i].a === members[i].b) {
      problems.push(`member at ${i} has duplicate joints ${members[i].a}`);
    }
    if (!jointSet.has(members[i].a)) {
      problems.push(`member at ${i} .a refers to external joint ${members[i].a}`);
    }
    if (!jointSet.has(members[i].b)) {
      problems.push(`member at ${i} .b refers to external joint ${members[i].b}`);
    }
  }
  return problems;
}

/** Returns a list of concave vertices in a supposedly convex hull. */
export function validateConvexHull(hull: Point2DInterface[]): number[] {
  const bad = [];
  for (let i = 0; i < hull.length; ++i) {
    const a = hull[i === 0 ? hull.length - 1 : i - 1];
    const b = hull[i];
    const c = hull[i === hull.length - 1 ? 0 : i + 1];
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const wx = c.x - b.x;
    const wy = c.y - b.y;
    if (vx * wy - wx * vy < 0) {
      bad.push(i);
    }
  }
  return bad;
} 