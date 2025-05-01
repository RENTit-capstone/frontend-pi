import { apiFetch } from "../core/core.js";

export async function pollOtpResult(otp, interval = 1000, maxAttempts = 10) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
  
      const check = async () => {
        try {
          const result = await apiFetch(`/api/verify/result?otp=${otp}`);
          console.log("OTP 인증 상태:", result);
  
          if (result.verified !== null) {
            resolve(result);
            return;
          }
  
          if (++attempts >= maxAttempts) {
            reject(new Error("OTP 인증 응답 시간 초과"));
            return;
          }
  
          setTimeout(check, interval);
        } catch (err) {
          reject(err);
        }
      };
  
      check();
    });
  }
  