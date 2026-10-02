export type Envelope = { v: 1; salt: string; iv: string; data: string };
const encode = (data: Uint8Array) => btoa(Array.from(data, byte => String.fromCharCode(byte)).join(''));
const decode = (data: string) => Uint8Array.from(atob(data), char => char.charCodeAt(0));
export async function derive(passphrase: string, salt: Uint8Array) {
 const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:310000, hash:'SHA-256'}, material, {name:'AES-GCM',length:256}, false, ['encrypt','decrypt']);
}
export async function encrypt(value: unknown, key: CryptoKey, salt: string): Promise<Envelope> {
 const iv = crypto.getRandomValues(new Uint8Array(12));
 const data = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, new TextEncoder().encode(JSON.stringify(value)));
 return {v:1, salt, iv:encode(iv), data:encode(new Uint8Array(data))};
}
export async function unlock(passphrase: string, value: Envelope) {
 const key = await derive(passphrase, decode(value.salt));
 const raw = await crypto.subtle.decrypt({name:'AES-GCM', iv:decode(value.iv)}, key, decode(value.data));
 return {key, value:JSON.parse(new TextDecoder().decode(raw))};
}
export function newSalt() { return encode(crypto.getRandomValues(new Uint8Array(16))); }
export async function newKey(passphrase: string, salt: string) { return derive(passphrase, decode(salt)); }
