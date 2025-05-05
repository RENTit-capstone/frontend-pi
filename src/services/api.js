import { apiFetch } from "../core/core.js";

export async function pollOtpResult(otp, interval = 1000, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = async () => {
      try {
        const result = await apiFetch(`/api/verify/result`);
        console.log("[OTP] 인증 상태:", result);

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

export async function submitOtp(otp, action) {
  if (!otp || otp.length < 5 || !action) {
    throw new Error("OTP 또는 동작이 유효하지 않습니다");
  }

  try {
    await apiFetch("/api/verify", {
      method: "POST",
      body: { otp, action },
    });

    return await pollOtpResult(otp);
  } catch (err) {
    console.error("[OTP] 인증 요청 또는 결과 처리 실패:", err.message);
    throw err;
  }
}

export async function performLockerAction({ action, item, slot }) {
  try {
    const response = await apiFetch("/api/locker/perform", {
      method: "POST",
      body: {
        action,
        item,
        slot
      }
    });
    return response;
  } catch (err) {
    console.error("[API] performLockerAction failed:", err);
    return { success: false };
  }
}

export async function checkSlotClosed() {
  try {
    const res = await apiFetch('/api/locker/closed', {
      method: "GET",
    });
    return res;
  } catch (err) {
    console.error("[API] checkSlotClosed failed:", err);
    return { closed: false };
  }
}