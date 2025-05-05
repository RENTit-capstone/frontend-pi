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
  });

  return {
    html: `
      <div class="screen-container">
        <h2>${userName}님, 물건의 위치를 확인하세요:</h2>
        <p>${slotInfo}</p>
        <div class="action-button-wrapper">${confirmButtonHtml}</div>
      </div>
    `,
    handlers: confirmButtonHandlers,
  };
};