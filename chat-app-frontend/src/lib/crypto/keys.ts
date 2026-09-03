import { openDB, } from 'idb';
import type { IDBPDatabase } from 'idb';
import { updatePublicKey } from '../../services/authApi';

interface CryptoKeys {
  publicKey: CryptoKey | null;
  privateKey: CryptoKey | null;
  PublicKeyBase64: string | null;
}

interface CryptoKeysDB {
  keys: CryptoKeys;
}

// Helper: Convert ArrayBuffer to Base64 string (for SQL)
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Convert Base64 string back to ArrayBuffer (from SQL)
export function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}


const generateKeyPair = async (): Promise<CryptoKeys> => {
  const keyPair = await crypto.subtle.generateKey(
    { name: "X25519" },
    false,
    ["deriveKey", "deriveBits"]
  );

    const rawPublicKey = await crypto.subtle.exportKey("raw", keyPair.publicKey);

    const PublicKeyBase64 = bufferToBase64(rawPublicKey);

    return {
        publicKey: keyPair.publicKey,
        privateKey: keyPair.privateKey,
        PublicKeyBase64: PublicKeyBase64
    }
};
const inFlightMap = new Map<string, Promise<CryptoKeys>>();

export const ensureKeyPairExists = (userId: number | null): Promise<CryptoKeys> => {
  const key = `user-${userId}`;
  if (!inFlightMap.has(key)) {
    const promise = ensureKeyPairExistsInner(userId).finally(() => {
      inFlightMap.delete(key);
    });
    inFlightMap.set(key, promise);
  }
  return inFlightMap.get(key)!;
};

export const ensureKeyPairExistsInner = async (userId: number | null): Promise<CryptoKeys> => {
  const db: IDBPDatabase<CryptoKeysDB> = await openDB<CryptoKeysDB>('crypto-keys-db', 1, {
    upgrade(db) {
        
    if(!db.objectStoreNames.contains('keys')) {
      db.createObjectStore('keys');
    }
    },
  });

    let keys: CryptoKeys = await db.get('keys', `user-${userId}`) || { publicKey: null , privateKey: null, PublicKeyBase64: null };

    if (!keys.publicKey || !keys.privateKey) {
        const keyPair = await generateKeyPair();
        keys.publicKey = keyPair.publicKey;
        keys.privateKey = keyPair.privateKey;
        keys.PublicKeyBase64 = keyPair.PublicKeyBase64;
        await db.put('keys', keys, `user-${userId}`);
        await updatePublicKey(keys.PublicKeyBase64 || '');
        console.log("generating new keypair")
    }
    else {
        console.log("keys already exist, skipping")
    }


    return keys;
};

export const getStoredPrivateKey = async (userId: number | null): Promise<CryptoKey | null> => {
  const db: IDBPDatabase<CryptoKeysDB> = await openDB<CryptoKeysDB>('crypto-keys-db', 1);

  const keys: CryptoKeys | undefined = await db.get('keys', `user-${userId}`);

  return keys?.privateKey || null;
}

export const deriveAesKeyViaHkdf = async (sharedSecret: ArrayBuffer): Promise<CryptoKey> => {
  const info = new TextEncoder().encode("AES-GCM key");

  const hkdfKey = await crypto.subtle.importKey(
    "raw",
    sharedSecret,
    { name: "HKDF" },
    false,
    ["deriveKey"]
  );

  const aesKey = await crypto.subtle.deriveKey(
    { name: "HKDF", salt: new Uint8Array(0),  info , hash: "SHA-256" },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  return aesKey;
};


