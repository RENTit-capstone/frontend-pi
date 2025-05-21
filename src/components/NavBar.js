export default function NavBar({ onReset, canReset }) {
  const disabledAttr = canReset ? "" : "disabled";
  const tooltip = canReset ? "" : "현재 상태에서는 초기화할 수 없습니다.";

  return {
    html: `
      <div class="nav-bar">
        <button id="reset-button" class="nav-button" ${disabledAttr} title="${tooltip}">
          초기화
        </button>
      </div>
    `,
    handlers: canReset
      ? { "reset-button" : onReset }
      : {}
  };
}