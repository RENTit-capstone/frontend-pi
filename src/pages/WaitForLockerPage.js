export const WaitForLockerPage = ({ userName }) => {
  return {
    html: `
      <div class="screen-container">
        <h2 class="wait-title">${userName}님, 사물함을 여는 중입니다... 🔓</h2>
        <p class="wait-message">사물함이 열릴 때까지 잠시만 기다려주세요.</p>
        <p class="wait-sub">⏳ 열리는 중...</p>
      </div>
    `,
    handlers: {},
  };
};
