import { createState, render } from "../core/core.js";
import Button from "../components/Button.js";

const [otp, setOtp] = createState("");

export const OTPScreen = () => {

  const appendDigit = (digit) => {
    if (otp().length < 4) setOtp(otp() + digit);
  };

  const clearOtp = () => setOtp("");
  const deleteLast = () => setOtp(otp().slice(0, -1));

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  const digitButtons = digits.map((digit) => {
    const { html, handlers } = Button({
      id: `digit-${digit}`,
      label: digit,
      onClick: () => appendDigit(digit)
    });
    return { html, handlers };
  });

  const { html: clearHtml, handlers: clearHandlers } = Button({
    id: "clear",
    label: "지우기",
    onClick: clearOtp
  });

  const { html: backHtml, handlers: backHandlers } = Button({
    id: "backspace",
    label: "←",
    onClick: deleteLast
  });

  return {
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh;">
        <h2>OTP를 입력하세요</h2>
        <div style="display:flex; gap:10px; margin-bottom: 20px;">
          ${[0,1,2,3].map(i => `<div style="width:40px; height:40px; font-size:2rem; text-align:center; border:1px solid #ccc;">${otp()[i] || ""}</div>`).join("")}
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 200px;">
          ${digitButtons.map(b => b.html).join("")}
          ${backHtml}
          ${clearHtml}
        </div>
      </div>
    `,
    handlers: Object.assign({},
      ...digitButtons.map(b => b.handlers),
      clearHandlers,
      backHandlers
    )
  };
};