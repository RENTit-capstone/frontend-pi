export default function Button({ id, label, onClick }) {
    return {
      html: `
        <button id="${id}" class="common-button">
          ${label}
        </button>
      `,
      handlers: {
        [id]: onClick
      }
    };
  };