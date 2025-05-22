import Button from "../components/Button.js";

export const FinalPage = ({ userName, onReset }) => {
  let seconds = 5;
  const countdownId = "countdown-text";

  const interval = setInterval(() => {
    const el = document.getElementById(countdownId);
    if (el) {
      seconds--;
      el.innerHTML = `<span class="emoji">⏳</span> 자동 초기화까지 <strong>${seconds}</strong>초 남았습니다`;
    }
    if (seconds <= 0) clearInterval(interval);
  }, 1000);

  setTimeout(() => {
    clearInterval(interval);
    onReset();
  }, 5000);

  const { html: resetHtml, handlers: resetHandlers } = Button({
    id: "center-reset",
    label: "처음으로 돌아가기",
    onClick: onReset,
    className: "final-reset-button"
  });

  return {
    html: `
      <div class="screen-container">
        <h2 class="final-title">작업이 완료되었습니다. <span class="emoji">✅</span></h2>
        <div class="final-message">
          ${userName}님, 이용해주셔서 감사합니다!<br />
          오늘도 좋은 하루 보내세요<span class="emoji">😊</span>
        </div>
        <div id="${countdownId}" class="final-reset-timer">
          <span class="emoji">⏳</span> 자동 초기화까지 <strong>5</strong>초 남았습니다
        </div>
        <div class="action-button-wrapper">${resetHtml}</div>
      </div>
    `,
    handlers: {
      ...resetHandlers
    },
  };
};