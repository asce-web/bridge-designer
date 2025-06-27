import { getReasonNotDeeplyEqual } from './validation';

describe('getReasonNotDeeplyEqual', () => {
  it('on non-numeric primitives finds equal values equal', () => {
    expect(getReasonNotDeeplyEqual(null, null)).toBe(undefined);
    expect(getReasonNotDeeplyEqual(undefined, undefined)).toBe(undefined);
    expect(getReasonNotDeeplyEqual(0, 0)).toBe(undefined);
    expect(getReasonNotDeeplyEqual(1, 1)).toBe(undefined);
    expect(getReasonNotDeeplyEqual('', '')).toBe(undefined);
    expect(getReasonNotDeeplyEqual('foo', 'foo')).toBe(undefined);
    const symbol = Symbol('foo');
    expect(getReasonNotDeeplyEqual(symbol, symbol)).toBe(undefined);
    expect(getReasonNotDeeplyEqual(42n, 42n)).toBe(undefined);
  });

  it('on non-numeric primitives finds unequal values unequal', () => {
    expect(getReasonNotDeeplyEqual(0, 1)).toBe('numerically unequal with eps=0 @TOP: 0 !~ 1');
    expect(getReasonNotDeeplyEqual('foo', 'bar')).toBe('value mismatch @TOP: foo != bar');
    expect(getReasonNotDeeplyEqual(Symbol('foo'), Symbol('foo'))).toBe('value mismatch @TOP: <symbol> != <symbol>');
    expect(getReasonNotDeeplyEqual(42n, 69n)).toBe('value mismatch @TOP: 42 != 69');
  });

  it('on numeric primitives handles precision correctly', () => {
    expect(getReasonNotDeeplyEqual(100, 100.1, 0.002)).toBe(undefined);
    expect(getReasonNotDeeplyEqual(100, 100.1, 0.0001)).toBe('numerically unequal with eps=0.01001 @TOP: 100 !~ 100.1');
    expect(getReasonNotDeeplyEqual(100, 99.9, 0.002)).toBe(undefined);
    expect(getReasonNotDeeplyEqual(100, 99.9, 0.0001)).toBe('numerically unequal with eps=0.01 @TOP: 100 !~ 99.9');
    expect(getReasonNotDeeplyEqual(-100, -100.1, 0.002)).toBe(undefined);
    expect(getReasonNotDeeplyEqual(-100, -100.1, 0.0001)).toBe(
      'numerically unequal with eps=0.01001 @TOP: -100 !~ -100.1',
    );
    expect(getReasonNotDeeplyEqual(-100, -99.9, 0.002)).toBe(undefined);
    expect(getReasonNotDeeplyEqual(-100, -99.9, 0.0001)).toBe('numerically unequal with eps=0.01 @TOP: -100 !~ -99.9');
  });

  it('handles number/bigint comparisons', () => {
    expect(getReasonNotDeeplyEqual(100, 100n)).toBe(undefined);
    expect(getReasonNotDeeplyEqual(100.4, 100n)).toBe('bigint and number unequal @TOP: 100.4 != 100');
  });

  it('reports type mismatches correctly', () => {
    expect(getReasonNotDeeplyEqual(null, undefined)).toBe('type missmatch @TOP: null != undefined (null != undefined)');
    expect(getReasonNotDeeplyEqual(0, 'foo')).toBe('type missmatch @TOP: number != string (0 != foo)');
    expect(getReasonNotDeeplyEqual('foo', 0)).toBe('type missmatch @TOP: string != number (foo != 0)');
    expect(getReasonNotDeeplyEqual(42n, 'foo')).toBe('type missmatch @TOP: bigint != string (42 != foo)');
    expect(getReasonNotDeeplyEqual('foo', 42n)).toBe('type missmatch @TOP: string != bigint (foo != 42)');
    expect(getReasonNotDeeplyEqual(0, {})).toBe('type missmatch @TOP: number != object (0 != <object>)');
    expect(getReasonNotDeeplyEqual({}, 0)).toBe('type missmatch @TOP: object != number (<object> != 0)');
    expect(getReasonNotDeeplyEqual(0, Symbol('foo'))).toBe('type missmatch @TOP: number != symbol (0 != <symbol>)');
  });

  it('reports array equality correctly', () => {
    expect(getReasonNotDeeplyEqual([], [])).toBe(undefined);
    const s = Symbol('foo');
    expect(getReasonNotDeeplyEqual(['a', 0, s], ['a', 0, s])).toBe(undefined);
    expect(getReasonNotDeeplyEqual(['a', 0, s], ['a', 0, s])).toBe(undefined);
    expect(getReasonNotDeeplyEqual([['a'], [], [0, [s]]], [['a'], [], [0, [s]]])).toBe(undefined);
  });

  it('reports array inequality correctly', () => {
    expect(getReasonNotDeeplyEqual([], [null])).toBe('array length mismatch @TOP: 0 != 1)');
    const s = Symbol('foo');
    expect(getReasonNotDeeplyEqual(['a', 0], ['a', 0, s])).toBe('array length mismatch @TOP: 2 != 3)');
    expect(getReasonNotDeeplyEqual(['a', 0, [s]], ['a', 0, s])).toBe(
      'type missmatch @TOP[2]: array != symbol (<array> != <symbol>)',
    );
    expect(getReasonNotDeeplyEqual([['a'], [], [0, [s]]], [['a'], [], [0, ['b']]])).toBe(
      'type missmatch @TOP[2][1][0]: symbol != string (<symbol> != b)',
    );
  });

  it('reports object equality correctly', () => {
    expect(getReasonNotDeeplyEqual({}, {})).toBe(undefined);
    expect(getReasonNotDeeplyEqual({ a: 42, b: 'foo' }, { a: 42, b: 'foo' })).toBe(undefined);
    expect(getReasonNotDeeplyEqual({ a: 42, b: 'foo' }, new Foo())).toBe(undefined);
    expect(getReasonNotDeeplyEqual({ a: 42, b: { c: ['foo'] } }, { b: { c: ['foo'] }, a: 42 })).toBe(undefined);
  });

  it('reports object inequality correctly', () => {
    expect(getReasonNotDeeplyEqual({}, { a: 1 })).toBe(
      'field mismatch @TOP: only in Object are {}; only in Object are {a}',
    );
    expect(getReasonNotDeeplyEqual({ a: 1 }, {})).toBe(
      'field mismatch @TOP: only in Object are {a}; only in Object are {}',
    );
    expect(getReasonNotDeeplyEqual({ a: 42, b: 'foo' }, { a: 42, b: 'bar' })).toBe('value mismatch @TOP.b: foo != bar');
    expect(getReasonNotDeeplyEqual({ a: 42, b: 'foo', c: { d: 'baz' } }, new Foo())).toBe(
      'field mismatch @TOP: only in Object are {c}; only in Foo are {}',
    );
    expect(getReasonNotDeeplyEqual({ a: 42, b: { c: ['foo'] } }, { b: { c: [Symbol('foo')] }, a: 42 })).toBe(
      'type missmatch @TOP.b.c[0]: string != symbol (foo != <symbol>)',
    );
  });
});

class Foo {
  a: number = 42;
  b: string = 'foo';
}
