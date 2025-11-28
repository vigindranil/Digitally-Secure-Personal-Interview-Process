

import Cookies from "js-cookie";
import { decryptAESGCM } from "@/lib/utils";

export async function getUser() {
  try {
    const encData = Cookies.get("user_info");
    if (!encData) return null;

    const decrypted = await decryptAESGCM(encData);

    return typeof decrypted === "string"
      ? JSON.parse(decrypted)
      : decrypted;
  } catch (error) {
    console.error("Failed to load user:", error);
    return null;
  }
}
