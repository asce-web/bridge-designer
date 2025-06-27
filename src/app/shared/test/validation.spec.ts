import { getReasonsNotDeeplyEqual } from './validation';

describe('getReasonNotDeeplyEqual', () => {
  /** Sets up the reasons list, calls the FUT, and returns the list. */
  function getTestValue(a: any, b: any, precision: number = 0): string[] {
    const reasons: string[] = [];
    getReasonsNotDeeplyEqual(reasons, a, b, precision);
    return reasons;
  }

  it('on non-numeric primitives finds equal values equal', () => {
    expect(getTestValue(null, null)).toEqual([]);
    expect(getTestValue(undefined, undefined)).toEqual([]);
    expect(getTestValue(0, 0)).toEqual([]);
    expect(getTestValue(1, 1)).toEqual([]);
    expect(getTestValue('', '')).toEqual([]);
    expect(getTestValue('foo', 'foo')).toEqual([]);
    const symbol = Symbol('foo');
    expect(getTestValue(symbol, symbol)).toEqual([]);
    expect(getTestValue(42n, 42n)).toEqual([]);
  });

  it('on non-numeric primitives finds unequal values unequal', () => {
    expect(getTestValue(0, 1)).toEqual(['numerically unequal with eps=0 @TOP: 0 !~ 1']);
    expect(getTestValue('foo', 'bar')).toEqual(['value mismatch @TOP: foo != bar']);
    expect(getTestValue(Symbol('foo'), Symbol('foo'))).toEqual(['value mismatch @TOP: <symbol> != <symbol>']);
    expect(getTestValue(42n, 69n)).toEqual(['value mismatch @TOP: 42 != 69']);
  });

  it('on numeric primitives handles precision correctly', () => {
    expect(getTestValue(100, 100.1, 0.002)).toEqual([]);
    expect(getTestValue(100, 100.1, 0.0001)).toEqual(['numerically unequal with eps=0.01001 @TOP: 100 !~ 100.1']);
    expect(getTestValue(100, 99.9, 0.002)).toEqual([]);
    expect(getTestValue(100, 99.9, 0.0001)).toEqual(['numerically unequal with eps=0.01 @TOP: 100 !~ 99.9']);
    expect(getTestValue(-100, -100.1, 0.002)).toEqual([]);
    expect(getTestValue(-100, -100.1, 0.0001)).toEqual(['numerically unequal with eps=0.01001 @TOP: -100 !~ -100.1']);
    expect(getTestValue(-100, -99.9, 0.002)).toEqual([]);
    expect(getTestValue(-100, -99.9, 0.0001)).toEqual(['numerically unequal with eps=0.01 @TOP: -100 !~ -99.9']);
  });

  it('handles number/bigint comparisons', () => {
    expect(getTestValue(100, 100n)).toEqual([]);
    expect(getTestValue(100.4, 100n)).toEqual(['bigint and number unequal @TOP: 100.4 != 100']);
  });

  it('reports type mismatches correctly', () => {
    expect(getTestValue(null, undefined)).toEqual(['type missmatch @TOP: null != undefined (null != undefined)']);
    expect(getTestValue(0, 'foo')).toEqual(['type missmatch @TOP: number != string (0 != foo)']);
    expect(getTestValue('foo', 0)).toEqual(['type missmatch @TOP: string != number (foo != 0)']);
    expect(getTestValue(42n, 'foo')).toEqual(['type missmatch @TOP: bigint != string (42 != foo)']);
    expect(getTestValue('foo', 42n)).toEqual(['type missmatch @TOP: string != bigint (foo != 42)']);
    expect(getTestValue(0, {})).toEqual(['type missmatch @TOP: number != object (0 != <object>)']);
    expect(getTestValue({}, 0)).toEqual(['type missmatch @TOP: object != number (<object> != 0)']);
    expect(getTestValue(0, Symbol('foo'))).toEqual(['type missmatch @TOP: number != symbol (0 != <symbol>)']);
  });

  it('reports array equality correctly', () => {
    expect(getTestValue([], [])).toEqual([]);
    const s = Symbol('foo');
    expect(getTestValue(['a', 0, s], ['a', 0, s])).toEqual([]);
    expect(getTestValue(['a', 0, s], ['a', 0, s])).toEqual([]);
    expect(getTestValue([['a'], [], [0, [s]]], [['a'], [], [0, [s]]])).toEqual([]);
  });

  it('reports array inequality correctly', () => {
    expect(getTestValue([], [null])).toEqual(['array length mismatch @TOP: 0 != 1)']);
    const s = Symbol('foo');
    expect(getTestValue(['a', 0], ['a', 0, s])).toEqual(['array length mismatch @TOP: 2 != 3)']);
    expect(getTestValue(['a', 0, [s]], ['a', 0, s])).toEqual([
      'type missmatch @TOP[2]: array != symbol (<array> != <symbol>)',
    ]);
    expect(getTestValue([['a'], [], [0, [s]]], [['a'], [], [0, ['b']]])).toEqual([
      'type missmatch @TOP[2][1][0]: symbol != string (<symbol> != b)',
    ]);
  });

  it('reports object equality correctly', () => {
    expect(getTestValue({}, {})).toEqual([]);
    expect(getTestValue({ a: 42, b: 'foo' }, { a: 42, b: 'foo' })).toEqual([]);
    expect(getTestValue({ a: 42, b: 'foo' }, new Foo())).toEqual([]);
    expect(getTestValue({ a: 42, b: { c: ['foo'] } }, { b: { c: ['foo'] }, a: 42 })).toEqual([]);
  });

  it('reports object inequality correctly', () => {
    expect(getTestValue({}, { a: 1 })).toEqual(['field mismatch @TOP: only in Object are {}; only in Object are {a}']);
    expect(getTestValue({ a: 1 }, {})).toEqual(['field mismatch @TOP: only in Object are {a}; only in Object are {}']);
    expect(getTestValue({ a: 42, b: 'foo' }, { a: 42, b: 'bar' })).toEqual(['value mismatch @TOP.b: foo != bar']);
    expect(getTestValue({ a: 42, b: 'foo', c: { d: 'baz' } }, new Foo())).toEqual([
      'field mismatch @TOP: only in Object are {c}; only in Foo are {}',
    ]);
    expect(getTestValue({ a: 42, b: { c: ['foo'] } }, { b: { c: [Symbol('foo')] }, a: 42 })).toEqual([
      'type missmatch @TOP.b.c[0]: string != symbol (foo != <symbol>)',
    ]);
  });

  it('reports multiple nested inequalities correctly', () => {
    expect(
      getTestValue(
        { a: 42, b: { c: ['bar', 'yum', 'foo', 'extra'] }, d: 3 },
        { b: { c: ['baz', 'yum', Symbol('foo')] }, a: 41, d: 3 },
      ),
    ).toEqual([
      'array length mismatch @TOP.b.c: 4 != 3)',
      'value mismatch @TOP.b.c[0]: bar != baz',
      'type missmatch @TOP.b.c[2]: string != symbol (foo != <symbol>)',
      'numerically unequal with eps=0 @TOP.a: 42 !~ 41',
    ]);
  });
});

class Foo {
  a: number = 42;
  b: string = 'foo';
}
