import Button from "../components/Button.js";

export const SelectItemPage = ({ userName, items, selectedItem, setSelectedItem, onSelect }) => {
  const itemButtons = items.map((item) => {
    const { html, handlers } = Button({
      id: `item-${item.item_id}`,
      label: item.name,
      onClick: () => setSelectedItem(item),
    });
    return { html, handlers };
  });

  const { html: nextHtml, handlers: nextHandlers } = Button({
    id: "to-slot-select",
    label: "다음",
    onClick: () => {
      if (selectedItem()) {
        onSelect();
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