import { apiFetch } from "../core/core.js";

export async function pollOtpResult(interval = 1000, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = async () => {
      try {
        const result = await apiFetch(`/api/verify/result`);
        console.log("[OTP] 인증 상태:", result);

        if (result.verified === false && result.error) {
          alert(`OTP 인증 실패: ${result.error}`);
          reject(new Error(result.error));
          return;
        }

        if (result.verified === true) {
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

    return await pollOtpResult();
  } catch (err) {
    console.error("[OTP] 인증 요청 또는 결과 처리 실패:", err.message);
    throw err;
  }
}

export async function performLockerAction({ rentalId, lockerId, action, fee }) {
  try {
    const response = await apiFetch("/api/locker/perform", {
      method: "POST",
      body: {
        rentalId,
        lockerId,
        action,
        fee
      },
    });
    return response;
  } catch (err) {
    console.error("[API] performLockerAction failed:", err);
    return { success: false };
  }
}

export async function pollSlotClosed(interval = 1000, maxAttempts = 20) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = async () => {
      try {
        const result = await apiFetch("/api/locker/closed");
        console.log("[POLL] 닫힘 상태:", result);

        if (result.closed) {
          resolve(true);
          return;
        }
        if (++attempts >= maxAttempts) {
          resolve(false);
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

export async function resetLockerState() {
  try {
    await apiFetch("/api/system/reset", {
      method: "POST"
    });
  } catch (err) {
    console.error("[API] resetLockerState failed:", err);
  }
}

export async function getAvailableSlots(rentalId, action) {
  try {
    await apiFetch("/api/locker/empty", {
      method: "POST",
      body: {
        rentalId,
        action
      },
    });

    return await pollAvailableSlotsResult();
  } catch (err) {
    console.error("[API] getAvailableSlots failed:", err);
    return [];
  }
}

export async function pollAvailableSlotsResult(interval = 1000, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = async () => {
      try {
        const res = await apiFetch("/api/locker/empty/result");
        const { success, data } = res;

        if (success && data && Array.isArray(data.lockers)) {
          const available = data.lockers
            .filter(l => l.available)
            .map(l => l.lockerId);
          resolve(available);
          return;
        }

        if (++attempts >= maxAttempts) {
          reject(new Error("빈 사물함 목록 조회 실패 또는 시간 초과"));
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
