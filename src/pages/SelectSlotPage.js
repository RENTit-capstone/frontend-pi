import Button from "../components/Button.js"

export const SelectSlotPage = ({ availableSlots, selectedSlot, setSelectedSlot, onSelect }) => {
  const slotButtons = availableSlots.map((slotObj) => {
    const locker = slotObj.locker
    const lockerId = locker.lockerId;

    const { html, handlers } = Button({
      id: `slot-${lockerId}`,
      label: `${lockerId}번 칸`,
      onClick: () => setSelectedSlot(lockerId),
    });
    return { html, handlers };
  });

  const { html: confirmButtonHtml, handlers: confirmButtonHandlers } = Button({
    id: "confirm-slot",
    label: "확인",
    onClick: () => {
      if (selectedSlot()) {
        onSelect();
      }
    },
  });

  return {
    html: `
      <div class="screen-container">
        <h2>사용할 칸을 선택하세요</h2>
        ${slotButtons.map((button) => button.html).join("")}
        <div class="action-button-wrapper">${confirmButtonHtml}</div>
      </div>
    `,
    handlers: Object.assign({}, ...slotButtons.map((button) => button.handlers), confirmButtonHandlers),
  };
};