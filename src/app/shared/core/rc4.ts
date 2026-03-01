/**
 * Encrypts or decrypts given data with given key using the very unsecure RC4 algorithm.
 * Valid only if string characters all have one-byte codes. Uses buffer space bytes equal
 * to key length plus data length. Up to 256 characters of key are used.
 */
export function encryptRc4(key: string, data: string, start: number = 0): string {
  return String.fromCharCode(...encryptRc4Raw(key, data, start));
}

/** A hacky hash to 16-bytes as hex string based on rc4. Not secure. */
export function rc4Hash(seed: string, data: string): string {
  const rc4 = encryptRc4Raw(seed, seed + data, 0);
  const hash = new Uint8Array(16);
  rc4.forEach((byte, i) => (hash[i & 0xf] ^= byte));
  return Array.from(hash, byte => byte.toString(16).padStart(2, '0')).join('');
}

function encryptRc4Raw(key: string, data: string, start: number): Uint8Array {
  const s = Uint8Array.from({ length: 256 }, (_, i) => i);
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) & 0xff;
    [s[i], s[j]] = [s[j], s[i]];
  }
  j = 0;
  let k = 0;
  return Uint8Array.from({ length: data.length - start }, (_, i) => {
    k = (k + 1) & 0xff;
    j = (j + s[k]) & 0xff;
    [s[k], s[j]] = [s[j], s[k]];
    return data.charCodeAt(start + i) ^ s[(s[k] + s[j]) & 0xff];
  });
}
