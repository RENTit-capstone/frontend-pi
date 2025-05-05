import { createState } from "../core/core.js";
import Button from "../components/Button.js";
import { submitOtp } from "../services/api.js";

const [otp, setOtp] = createState("");

export const OTPPage = ({ action, onVerified }) => {
  const appendDigit = (digit) => {
    if (otp().length < 5) setOtp(otp() + digit);
  };

  const clearOtp = () => setOtp("");
  const deleteLast = () => setOtp(otp().slice(0, -1));

  const handleSubmit = () => {
    if (otp().length < 5) return;
    submitOtp(otp(), action)
    .then((result) => {
      console.log("최종 인증 결과:", result);
      onVerified(result);
    })
    .catch((err) => {
      console.error("OTP 인증 실패:", err);
    });
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  const digitButtons = digits.map((digit) => {
    const { html, handlers } = Button({
      id: `digit-${digit}`,
      label: digit,
      onClick: () => appendDigit(digit),
    });
    return { html, handlers };
  });

  const { html: clearHtml, handlers: clearHandlers } = Button({
    id: "clear",
    label: "지우기",
    onClick: clearOtp,
  });

  const { html: backHtml, handlers: backHandlers } = Button({
    id: "backspace",
    label: "←",
    onClick: deleteLast,
  });

  const { html: submitHtml, handlers: submitHandlers } = Button({
    id: "submit",
    label: "제출",
    onClick: handleSubmit,
  });

  return {
    html: `
      <div class="screen-container">
        <h2 class="otp-title">OTP를 입력하세요</h2>
        <div class="otp-display">
          ${[0, 1, 2, 3, 4].map((i) => `<div class="otp-digit">${otp()[i] || ""}</div>`).join("")}
        </div>
        <div class="otp-pad">
          ${digitButtons.map((b) => b.html).join("")}
          ${backHtml}
          ${clearHtml}
          <div class="otp-submit-button-wrapper">
            ${submitHtml}
          </div>
        </div>
      </div>
    `,
    handlers: Object.assign(
      {},
      ...digitButtons.map((b) => b.handlers),
      clearHandlers,
      backHandlers,
      submitHandlers
    ),
  };
};
