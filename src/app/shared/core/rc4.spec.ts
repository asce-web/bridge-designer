import { encryptRc4, rc4Hash } from './rc4';

function toBytes(s: string): number[] {
  return Array.from(s, c => c.charCodeAt(0));
}

describe('rc4', () => {
  it('encryptRc4 produces the known RC4 test vector for "Key"/"Plaintext"', () => {
    const key = 'Key';
    const plain = 'Plaintext';
    // from Wikipedia/RC4 test vector
    const expected = [0xBB, 0xF3, 0x16, 0xE8, 0xD9, 0x40, 0xAF, 0x0A, 0xD3];
    const cipher = encryptRc4(key, plain);
    expect(toBytes(cipher)).toEqual(expected);
  });

  it('encryptRc4 is symmetric – encrypting twice returns the original string', () => {
    const key = 'secret';
    const data = 'The quick brown fox jumps over the lazy dog';
    const first = encryptRc4(key, data);
    expect(first).not.toEqual(data);
    const second = encryptRc4(key, first);
    expect(second).toEqual(data);
  });

  it('encryptRc4 returns the empty string when start is at or past end of data', () => {
    const key = 'Key';
    const plain = 'Plaintext';
    expect(encryptRc4(key, plain, plain.length)).toBe('');
    expect(encryptRc4(key, plain, plain.length + 1)).toBe('');
  });

  it('rc4Hash returns a 32‑character lowercase hex string and is deterministic', () => {
    const h1 = rc4Hash('foo', 'barbaz');
    expect(h1).toMatch(/^[0-9a-f]{32}$/);
    const h2 = rc4Hash('foo', 'barbaz');
    expect(h2).toBe(h1);
    expect(rc4Hash('Foo', 'barbaz')).not.toBe(h1);      // key is case‑sensitive
    expect(rc4Hash('foo', 'other')).not.toBe(h1);
  });

  it('rc4Hash returns a 32‑character lowercase hex string on empty input', () => {
    const h1 = rc4Hash('foo', '');
    expect(h1).toMatch(/^[0-9a-f]{32}$/);
  });
});