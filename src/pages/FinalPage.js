export const FinalPage = ({ userName }) => {
  return {
    html: `
      <div class="screen-container">
        <h2>작업이 완료되었습니다.</h2>
        <p>${userName}님, 이용해주셔서 감사합니다!</p>
        <p class="loading-indicator">잠시 후 초기 화면으로 돌아갑니다...</p>
      </div>
    `,
    handlers: {},
  };
};