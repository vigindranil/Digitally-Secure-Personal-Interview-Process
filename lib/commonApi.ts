const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import Cookies from "js-cookie";
import { decryptAESGCM, encryptAESGCM } from "./utils";


export const callAPIWithEnc: any = async (
  endpoint: string,
  method: string = "GET",
  body: any = null
) => {
  try {
    const token = Cookies.get("access_token") || "";
    const headers: any = {
      accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const requestOptions: any = {
      method: typeof method === "string" ? method : body ? "POST" : "GET",
      headers,
    };
    if (body) {
      const encData = await encryptAESGCM(body);
      requestOptions.body = JSON.stringify({ enc_data: encData });
    }
    const response: any = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
    const data = await response.json();
    let decryptedData: any = null;

    if (data?.data) {
      const payload = data.data;
      if (typeof payload === "string") {
        try {
          const decrypted = await decryptAESGCM(payload);
          if (typeof decrypted === "string") {
            try {
              decryptedData = JSON.parse(decrypted);
            } catch {
              decryptedData = decrypted;
            }
          } else {
            decryptedData = decrypted;
          }
        } catch {
          try {
            decryptedData = JSON.parse(payload);
          } catch {
            decryptedData = payload;
          }
        }
      } else if (typeof payload === "object") {
        decryptedData = payload;
      }
    }

    return { ...data, data: decryptedData };
  } catch (error: any) {
    throw new Error(
      error?.message || "Something went wrong, Please try again."
    );
  }
};