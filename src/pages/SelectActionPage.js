import Button from "../components/Button.js";

export const SelectActionPage = ({ onSelect }) => {
  const actions = [
    { label: "물건 맡기기", value: "DROP_OFF_BY_OWNER" },
    { label: "물건 빌리기", value: "PICK_UP_BY_RENTER" },
    { label: "물건 반납하기", value: "RETURN_BY_RENTER" },
    { label: "물건 되찾기", value: "RETRIEVE_BY_OWNER" },
  ];

  const buttons = actions.map(({ label, value }) => {
    const button = Button({
      id: value,
      label,
      onClick: () => {
        onSelect(value);
        console.log("선택된 동작:", value);
      },
    });

    return button;
  });

  const html = `
    <div class="screen-container">
      <h2>원하는 작업을 선택하세요</h2>
      ${buttons.map((b) => b.html).join("")}
    </div>
  `;

  const handlers = Object.assign({}, ...buttons.map((b) => b.handlers));

  return { html, handlers };
};
