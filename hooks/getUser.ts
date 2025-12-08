import Cookies from "js-cookie";
import { decryptAESGCM } from "@/lib/utils";

export async function getUser() {
  // Guard against server-side calls during build
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const encData = Cookies.get("user_info");
    if (!encData) return null;

    const decrypted = await decryptAESGCM(encData);
    console.log("Decrypted user data:", decrypted);

    return decrypted;
  } catch (error) {
    console.error("Failed to load user:", error);
    return null;
  }
}