// hooks/getUser.ts
import Cookies from "js-cookie";

export function getUser() {
  // 1. Safety check: Ensure we are in the browser
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const data = Cookies.get("user_info");
    if (!data) return null;

    // Assuming user_info is stored as JSON string
    const parsed = JSON.parse(data);

    return parsed;
  } catch (error) {
    console.error("Failed to load user:", error);
    return null;
  }
}
