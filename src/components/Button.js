export default function Button({ id, label, onClick }) {
  const html = `
    <button id="${id}" class="common-button">
      ${label}
    </button>
  `;

  const handlers = {
    [id]: onClick,
  };

  return { html, handlers };
}
