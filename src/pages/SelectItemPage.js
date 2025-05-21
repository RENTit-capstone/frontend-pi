import Button from "../components/Button.js";

export const SelectItemPage = ({ userName, items, selectedItem, setSelectedItem, onSelect }) => {
  const itemButtons = items.map((item) => {
    const id = `item-${item.item_id}`;
    const label = `${item.name} (요금: ${item.fee.toLocaleString()} / 잔액: ${item.balance.toLocaleString()})`;

    const { html, handlers } = Button({
      id,
      label,
      onClick: () => {
        if (!item.payable) {
          alert("해당 물건은 잔액이 부족하여 선택할 수 없습니다.");
          return;
        }
        setSelectedItem(item);
      },
    });

    const buttonHtml = !item.payable
      ? html.replace(`<button`, `<button disabled class="disabled-slot"`)
      : html;
    
    return {
      html: buttonHtml,
      handlers: item.payable ? handlers : {},
    };
  });

  const { html: nextHtml, handlers: nextHandlers } = Button({
    id: "to-slot-select",
    label: "다음",
    onClick: () => {
      if (selectedItem()) {
        onSelect();
      } else {
        alert("선택된 아이템이 없습니다.");
      }
    },
  });

  return {
    html: `
      <div class="screen-container">
        <h2>${userName}님, 물건을 선택하세요</h2>
        ${itemButtons.map(b => b.html).join("")}
        <div class="action-button-wrapper">${nextHtml}</div>
      </div>
    `,
    handlers: Object.assign({}, ...itemButtons.map(b => b.handlers), nextHandlers),
  };
};