import { clsx, type ClassValue } from 'clsx'
import { de } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge'
export const GCM_KEY_HEX: string = process.env.NEXT_PUBLIC_GCM_KEY_HEX ?? "";
// export const GCM_KEY_HEX: string = "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF";
export const GCM_FIXED_IV_HEX: string = process.env.NEXT_PUBLIC_GCM_FIXED_IV_HEX ?? "";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 

const hexToUint8Array = (hex:any) =>
  new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

export const encryptAESGCM = async (data, ivHex = "aabbccddeeff001122334455") => {
  try {
    if (!data) return "";

 

    const textString = typeof data === 'object' ? JSON.stringify(data) : data;
    const encoder = new TextEncoder();
    const keyBytes = hexToUint8Array(GCM_KEY_HEX);
    const iv = hexToUint8Array(ivHex);
    const encodedData = encoder.encode(textString);

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]
    );  

    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv }, cryptoKey, encodedData
    );

    const encryptedContentArr = new Uint8Array(encryptedContent);
    const resultBytes = new Uint8Array(iv.length + encryptedContentArr.length);
    resultBytes.set(iv);
    resultBytes.set(encryptedContentArr, iv.length);

    let binary = '';
    const len = resultBytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(resultBytes[i]);

    return window.btoa(binary);
  } catch (e) {
    throw new Error("GCM Encrypt Error: " + e.message);
  }
};


export const decryptAESGCM = async (base64CipherText) => {
  // Guard against server-side execution during build
  if (typeof window === 'undefined') {
    console.warn("decryptAESGCM called during server-side rendering/build");
    return null;
  }

  try {
    if (!base64CipherText) return "";
    
    if (base64CipherText.includes("U2FsdGVk")) {
      throw new Error("Wrong Tab! This looks like CryptoJS data.");
    }
    
    let cleanInput = base64CipherText.trim().replace(/^"|"$/g, '').replace(/ /g, '+');
    const keyBytes = hexToUint8Array(GCM_KEY_HEX);
    
    let binaryString;
    try {
      const cleanBase64 = cleanInput.replace(/-/g, "+").replace(/_/g, "/");
      const paddedBase64 = cleanBase64.padEnd(cleanBase64.length + (4 - cleanBase64.length % 4) % 4, '=');
      binaryString = window.atob(paddedBase64);
    } catch {
      throw new Error("Invalid Base64");
    }
    
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    
    if (bytes.length < 13) throw new Error("Ciphertext too short");
    
    const iv = bytes.slice(0, 12);
    const encryptedData = bytes.slice(12);
     
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]
    );
    
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv }, cryptoKey, encryptedData
    );
    
    const result = new TextDecoder().decode(decryptedData);
    
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  } catch (error) {
    throw new Error("GCM Decrypt Error: " + error.message);
  }
};


