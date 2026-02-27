/** 
 * Encrypts or decrypts given data with given key using the very unsecure RC4 algorithm. 
 * Valid only if string characters all have one-byte codes. Uses buffer space bytes equal
 * to key length plus data length. Up to 256 characters of key are used.
 */
export function encryptRc4(key: string, data: string, start: number = 0): string {
  const s = Uint8Array.from({ length: 256 }, (_, i) => i);
  let j = 0;
  const keyBytes = Uint8Array.from({ length: key.length }, (_, i) => key.charCodeAt(i));
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + keyBytes[i % keyBytes.length]) & 0xff;
    [s[i], s[j]] = [s[j], s[i]];
  }
  j = 0;
  let k = 0;
  const result = Uint8Array.from({ length: data.length - start}, (_, i) => {
    k = (k + 1) & 0xff;
    j = (j + s[k]) & 0xff;
    [s[k], s[j]] = [s[j], s[k]];
    return data.charCodeAt(start + i) ^ s[(s[k] + s[j]) & 0xff];
  });
  return String.fromCharCode(...result);
}
