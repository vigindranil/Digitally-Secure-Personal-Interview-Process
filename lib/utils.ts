import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const GCM_KEY_HEX: string = process.env.NEXT_PUBLIC_GCM_KEY_HEX ?? "";
export const GCM_FIXED_IV_HEX: string = process.env.NEXT_PUBLIC_GCM_FIXED_IV_HEX ?? "";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




// Convert HEX → Uint8Array
export const hexToUint8Array = (hex: string): Uint8Array => {
  return new Uint8Array(
    hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
};

// ====================== ENCRYPT ======================
export const encryptAESGCM = async (
  data: any,
  ivHex: string = GCM_FIXED_IV_HEX
): Promise<string> => {
  if (typeof window === "undefined") {
    throw new Error("Encryption available only in browser");
  }

  try {
    const text = typeof data === "object" ? JSON.stringify(data) : data;
    const encoder = new TextEncoder();

    const keyBytes = hexToUint8Array(GCM_KEY_HEX);
    const ivBytes = hexToUint8Array(ivHex);

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyBytes.buffer, // FIX: use .buffer to satisfy BufferSource
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: ivBytes },
      cryptoKey,
      encoder.encode(text)
    );

    // Append IV + ciphertext
    const encryptedBytes = new Uint8Array(encrypted);
    const finalBytes = new Uint8Array(ivBytes.length + encryptedBytes.length);

    finalBytes.set(ivBytes);
    finalBytes.set(encryptedBytes, ivBytes.length);

    return btoa(String.fromCharCode(...finalBytes));
  } catch (error: any) {
    throw new Error("GCM Encrypt Error: " + error.message);
  }
};

// ====================== DECRYPT ======================
export const decryptAESGCM = async (
  cipherText: string,
  ivHex: string = GCM_FIXED_IV_HEX
): Promise<any> => {
  if (typeof window === "undefined") {
    throw new Error("Decryption available only in browser");
  }

  try {
    const cleaned = cipherText.trim().replace(/^"|"$/g, "");

    const binary = atob(cleaned);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

    const ivBytes = hexToUint8Array(ivHex);
    const encryptedBytes = bytes.slice(ivBytes.length);

    const keyBytes = hexToUint8Array(GCM_KEY_HEX);

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyBytes.buffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes },
      cryptoKey,
      encryptedBytes
    );

    const text = new TextDecoder().decode(decrypted);

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error: any) {
    throw new Error("GCM Decrypt Error: " + error.message);
  }
};
