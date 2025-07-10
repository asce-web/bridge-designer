import { Utility } from '../classes/utility';

declare global {
  namespace jasmine {
    interface Matchers<T> {
      toNearlyEqual(expected: T, precision?: number): boolean;
    }
  }
}

/**
 * Returns failure reasons for a deep comparison of equality excepting that numbers must match only to
 * specified positive relative precision. If precision is given as negative, it's interpreted as absolute
 * accuracy instead. Object prototype differences are ignored. Comparisons of number with bigint are exact.
 * Successful matches return an empty reasons list.
 */
export function getReasonsNotDeeplyEqual(
  reasons: string[],
  a: any,
  b: any,
  precision: number = 0,
  path: string[] = ['<top>'],
): void {
  // Short circuit for equal primitive types, two undefined or null values, identical objects.
  if (a === b) {
    return;
  }
  function comparisonTypeOf(x: any): string {
    return x === null ? 'null' : Array.isArray(x) ? 'array' : typeof x;
  }
  /** Avoid attempts to print symbols, which throw. Nested symbols, too. */
  function safeToString(x: any) {
    const comparisonType = comparisonTypeOf(x);
    return ['array', 'object', 'symbol'].includes(comparisonType) ? `<${comparisonType}>` : x;
  }
  function safeArrayToString(a: any[], indexBase: number = 0) {
    return a.map((item, index) => `${indexBase + index}: ${safeToString(item)}`).join(',');
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
    if (a != b) {
      reasons.push(`bigint and number unequal @${path.join('')}: ${a} != ${b}`);
    }
    return;
  }
  // Short circuit for any other kind of type mismatch.
  if (aType !== bType) {
    reasons.push(`type missmatch @${path.join('')}: ${aType} != ${bType} (${safeToString(a)} != ${safeToString(b)})`);
    return;
  }
  // Short circuit numbers for an imprecise match for numbers.
  if (aType === 'number') {
    const epsilon = precision < 0 ? -precision : Math.max(Math.abs(a), Math.abs(b)) * precision;
    if (Math.abs(a - b) > epsilon) {
      reasons.push(`numerically unequal with eps=${epsilon} @${path.join('')}: ${a} !~ ${b}`);
    }
    return;
  }
  // Short circuit with recurrence for array elements.
  if (aType === 'array') {
    const commonLength = Math.min(a.length, b.length);
    if (a.length !== b.length) {
      reasons.push(`array length mismatch @${path.join('')}: ${a.length} != ${b.length})`);
      const diff = a.length > b.length ? a.slice(b.length) : b.slice(a.length);
      reasons.push(`excess: [${safeArrayToString(diff, commonLength)}]`);
    }
    // Look for more differences at the common indices.
    for (let i = 0; i < commonLength; i++) {
      getReasonsNotDeeplyEqual(reasons, a[i], b[i], precision, path.concat(`[${i}]`));
    }
    return;
  }
  // Short circuit with recurrence for object fields.
  if (aType === 'object') {
    // Fields comparison. Reject any dissimilarity.
    const keysA = new Set(Object.keys(a));
    const keysB = new Set(Object.keys(b));
    const aNotB = chop([...Utility.setDifference(keysA, keysB)]);
    const bNotA = chop([...Utility.setDifference(keysB, keysA)]);
    const both = Utility.setIntersection(keysA, keysB);
    if (aNotB.length > 0 || bNotA.length > 0) {
      reasons.push(
        `field mismatch @${path.join('')}: only in ${a.constructor.name} are {${aNotB}}; only in ${b.constructor.name} are {${bNotA}}`,
      );
    }
    for (const key of both) {
      getReasonsNotDeeplyEqual(reasons, a[key], b[key], precision, path.concat(`.${key}`));
    }
    return;
  }
  // A pair with the same primitive types.
  if (a !== b) {
    reasons.push(`value mismatch @${path.join('')}: ${safeToString(a)} != ${safeToString(b)}`);
  }
}

export const projectLocalMatchers: jasmine.CustomMatcherFactories = {
  toNearlyEqual: (_matchersUtil: jasmine.MatchersUtil): jasmine.CustomMatcher => {
    return {
      compare: (actual: any, expected: any, precision: number = Number.EPSILON): jasmine.CustomMatcherResult => {
        const reasons: string[] = [];
        getReasonsNotDeeplyEqual(reasons, actual, expected, precision);
        return reasons.length === 0
          ? { pass: true, message: `equal with numeric precision ${precision}` }
          : { pass: false, message: reasons.join('\n') };
      },
    };
  },
};
