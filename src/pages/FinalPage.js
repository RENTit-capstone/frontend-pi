import Button from "../components/Button.js";

export const FinalPage = ({ userName, onReset }) => {
  let seconds = 5;
  const countdownId = "countdown-text";

  const interval = setInterval(() => {
    const el = document.getElementById(countdownId);
    if (el) {
      seconds--;
      el.innerText = `초기화까지 ${seconds}초 남았습니다`;
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
  });

  return {
    html: `
      <div class="screen-container">
        <h2>작업이 완료되었습니다.</h2>
        <p>${userName}님, 이용해주셔서 감사합니다!</p>
        <p id="${countdownId}" class="alert-text">초기화까지 5초 남았습니다</p>
        <div class="action-button-wrapper">${resetHtml}</div>
      </div>
    `,
    handlers: {
      ...resetHandlers
    },
  };
};