const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import Cookies from "js-cookie";
import { decryptAESGCM, encryptAESGCM } from "./utils";


export const callAPIWithEnc: any = async (
  endpoint: string,
  method = "GET",
  body: any = null
) => {
  try {
    const token = Cookies.get("token") || "";
    const headers: any = {
      accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const requestOptions: any = {
      method,
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
      const decrypted = await decryptAESGCM(data.data);
      decryptedData = JSON.parse(decrypted);
    }
    return { ...data, data: decryptedData };
  } catch (error: any) {
    throw new Error(
      error?.message || "Something went wrong, Please try again."
    );
  }
};