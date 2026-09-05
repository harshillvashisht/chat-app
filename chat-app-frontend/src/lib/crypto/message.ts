

interface EncryptedMessage {
    nonce: string; // Base64 encoded IV
    ciphertext: string; // Base64 encoded ciphertext
    tag: string; // Base64 encoded authentication tag
}

export const encryptMessage = async (message: string, key: CryptoKey): Promise<string> => {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM standard IV length is 12 bytes
    const encoder = new TextEncoder();
    const encodedMessage = encoder.encode(message);
    
    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedMessage,
    );

    const ciphertextbuffer = encryptedBuffer.slice(0, encryptedBuffer.byteLength - 16);
    const tagBuffer = encryptedBuffer.slice(encryptedBuffer.byteLength - 16);

    return JSON.stringify({
        nonce: btoa(String.fromCharCode(...new Uint8Array(iv.buffer))),
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertextbuffer))),
        tag: btoa(String.fromCharCode(...new Uint8Array(tagBuffer))),
    });

};

export async function decryptIfNeeded(message: { content: string; encryptedVersion: number | null }, key: CryptoKey | undefined): Promise<string> {
    if (message.encryptedVersion == null) return message.content; // legacy plaintext
    if (!key) return "[unable to decrypt]"; // key not derived yet — see gap below
    try {
        const parsed: EncryptedMessage = JSON.parse(message.content);
        return await decryptMessage(parsed, key);
    } catch (err) {
        console.error("Decrypt failed for message", err);
        return "[decryption failed]";
    }
}

export const decryptMessage = async (encryptedMessage: EncryptedMessage, key: CryptoKey): Promise<string> => {
    const iv = new Uint8Array(atob(encryptedMessage.nonce).split("").map(c => c.charCodeAt(0)));
    const ciphertext = new Uint8Array(atob(encryptedMessage.ciphertext).split("").map(c => c.charCodeAt(0)));
    const tag = new Uint8Array(atob(encryptedMessage.tag).split("").map(c => c.charCodeAt(0)));

    const combinedBuffer = new Uint8Array(ciphertext.length + tag.length);
    combinedBuffer.set(ciphertext, 0);
    combinedBuffer.set(tag, ciphertext.length);


    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        combinedBuffer,
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
}