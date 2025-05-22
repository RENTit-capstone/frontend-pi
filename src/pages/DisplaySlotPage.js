import Button from "../components/Button.js";

export const DisplaySlotPage = ({ userName, selectedItem, onConfirm }) => {
  const slot = selectedItem?.slot;
  const slotInfo = slot
  ? `${slot} 칸에서 꺼내주세요.`
  : "이 물건은 다른 사물함에 있습니다.";

  const { html: confirmButtonHtml, handlers: confirmButtonHandlers } = Button({
    id: "confirm-retrieve",
    label: "확인",
    onClick: () => onConfirm(String(slot)),
    className: "display-slot-button"
  });

  return {
    html: `
      <div class="display-slot-container">
        <h2 class="display-slot-title">${userName}님, 물건의 위치를 확인하세요:</h2>
        <p class="display-slot-message">${slotInfo}</p>
        <div class="display-slot-button-wrapper">${confirmButtonHtml}</div>
      </div>
    `,
    handlers: confirmButtonHandlers,
  };
};