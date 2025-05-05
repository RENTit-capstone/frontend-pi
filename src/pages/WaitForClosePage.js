export const WaitForClosePage = ({ userName, slot }) => {
  return {
    html:`
      <div class="screen-container">
        <h2>${userName}님,</h2>
        <p>선택한 칸(${slot})이 열렸습니다.</p>
        <p>물건을 넣고 문을 닫아주세요.</p>
        <div class="loading-indicator">닫힘을 기다리는 중...</div>
      </div>
    `,
    handlers: {},
  }
}