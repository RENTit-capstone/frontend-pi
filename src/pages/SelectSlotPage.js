import Button from "../components/Button.js";

export const SelectSlotPage = ({ availableSlots, selectedSlot, setSelectedSlot, onSelect }) => {
  const slotButtons = availableSlots.map((slotObj) => {
    const locker = slotObj.locker;
    const lockerId = locker.lockerId;
    const isSelected = selectedSlot() === lockerId;

    const { html, handlers } = Button({
      id: `slot-${lockerId}`,
      label: `${lockerId}번 칸`,
      onClick: () => setSelectedSlot(lockerId),
      className: `select-slot-button${isSelected ? " selected" : ""}`
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
    className: "select-slot-confirm-button"
  });

  return {
    html: `
      <div class="screen-container">
        <h2 class="select-slot-title">사용할 칸을 선택하세요</h2>
        ${slotButtons.map((button) => button.html).join("")}
        <div class="select-slot-confirm-wrapper">${confirmButtonHtml}</div>
      </div>
    `,
    handlers: Object.assign({}, ...slotButtons.map((button) => button.handlers), confirmButtonHandlers),
  };
};