/**
 * PKCE (Proof Key for Code Exchange) Helper
 * Used for secure OAuth2 flows in public clients (SPAs).
 */

export async function generateCodeVerifier(): Promise<string> {
  const array = new Uint32Array(32);
  window.crypto.getRandomValues(array);
  return base64urlEncode(array.buffer);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return base64urlEncode(digest);
}

export function generateRandomString(length: number = 32): string {
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return base64urlEncode(array.buffer).substring(0, length);
}

function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
