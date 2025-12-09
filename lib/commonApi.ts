const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import Cookies from "js-cookie";

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
      method,
      headers,
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response: any = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
    const data = await response.json();

    // simply return backend response
    return data;
  } catch (error: any) {
    throw new Error(
      error?.message || "Something went wrong, Please try again."
    );
  }
};
