// hooks/getUser.ts
import Cookies from "js-cookie";
import { decryptAESGCM } from "@/lib/utils";

export async function getUser() {
  // 1. Safety check: Ensure we are in the browser
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const encData = Cookies.get("user_info");
    if (!encData) return null;

    const decrypted = await decryptAESGCM(encData);
    return decrypted;
  } catch (error) {
    console.error("Failed to load user:", error);
    return null;
  }
}