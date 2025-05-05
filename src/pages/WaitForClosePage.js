export const WaitForClosePage = ({ userName, slot }) => {
  return {
    html:`
      <div class="screen-container">
        <h2>${userName}님,</h2>
        <p>선택한 칸(${slot})이 열렸습니다.</p>
        <p>물건을 넣고/빼고 난 후에 문을 닫아주세요.</p>
        <p>닫히면 자동으로 다음 단계로 진행됩니다.</p>
        <div class="loading-indicator">닫힘을 기다리는 중...</div>
      </div>
    `,
    handlers: {},
  }
}