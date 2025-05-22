export const WaitForClosePage = ({ userName, slot }) => {
  return {
    html:`
      <div class="screen-container">
        <div class="wait-title">${userName}님, 문을 닫아주세요 🔐</div>
        <div class="wait-message">
          선택한 칸(${slot})이 열렸습니다.<br />
          문을 열고, 물건을 넣거나 꺼낸 후, <strong>문을 꼭 닫아주세요.</strong><br />
          문이 닫히면 자동으로 다음 단계로 진행됩니다.
        </div>
        <div class="wait-sub">닫힘을 기다리는 중...</div>
      </div>
    `,
    handlers: {},
  }
}