const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import Cookies from "js-cookie";
import { encryptAESGCM } from "../../lib/utils";


export const generateOtpApi = async (mobileNumber: string) => {
  try {
    const encData = await encryptAESGCM({ mobile_number: mobileNumber });

    const payload = JSON.stringify({ enc_data: encData });

    const response = await fetch(`${BASE_URL}/admin/generate_otp`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: payload,
    });

    return await response.json();

  } catch (error: any) {
    throw new Error(error?.message || "Failed to generate Otp");
  }
};

export const generateToken = async (mobile: string, otp: string) => {
  try {
    const authBase64 = btoa(`${mobile}:${otp}`);

    const response = await fetch(`${BASE_URL}/auth/generateToken`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authBase64}`,
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`HTTP ${response.status}: ${err}`);
    }

    return await response.json();
  } catch (error) {
    console.error("generateToken error:", error);
    throw error;
  }
};

export const validateOtpApi = async (mobileNumber: string, otp: string) => {
  try {
    // Step 1 — Generate temporary token FIRST
    const tempTokenResponse = await generateToken(mobileNumber, otp);
    const tempToken = tempTokenResponse?.data?.access_token;

    if (!tempToken) {
      throw new Error("Could not generate temporary auth token.");
    }

    // Step 2 — Encrypt the payload
    const encData = await encryptAESGCM({ mobile_number: mobileNumber, otp });

    const payload = JSON.stringify({ enc_data: encData });

    // Step 3 — Validate OTP with temporary token
    const response = await fetch(`${BASE_URL}/admin/validate_otp`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempToken}`,
      },
      body: payload,
    });

    const result = await response.json();

    // Step 4 — If OTP validated, save final token
    if (result.status === 0) {
      const finalTokenResponse = await generateToken(mobileNumber, otp);

      if (finalTokenResponse?.data?.access_token) {
        Cookies.set("access_token", finalTokenResponse.data.access_token, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
      }

      return {
        ...result,
        accessToken: finalTokenResponse?.data?.access_token || null,
      };
    }

    return result;

  } catch (error: any) {
    throw new Error(error?.message || "Failed to validate OTP");
  }
};
