export default function Button({ id, label, onClick, className = "common-button" }) {
  const html = `
    <button id="${id}" class="${className}">
      ${label}
    </button>
  `;

  const handlers = {
    [id]: onClick,
  };

  return { html, handlers };
}
