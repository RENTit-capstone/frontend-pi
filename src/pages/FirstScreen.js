import Button from "../components/Button.js";

export const FirstScreen = ({ onSelect }) => {
  const actions = [
    { label: "물건 맡기기", value: "store" },
    { label: "물건 빌리기", value: "borrow" },
    { label: "물건 반납하기", value: "return" },
    { label: "물건 되찾기", value: "retrieve" },
  ];

  const buttons = actions.map(({ label, value }) => {
    const { html, handlers } = Button({
      id: value,
      label,
      onClick: () => {
        onSelect(value);
        console.log("선택된 동작:", value);
      }
    });
    return { html, handlers };
  });

  return {
    html: `
      <div class="screen-container">
        <h2>원하는 작업을 선택하세요</h2>
        ${buttons.map(b => b.html).join("")}
      </div>
    `,
    handlers: Object.assign({}, ...buttons.map(b => b.handlers))
  };
};