export default function Button({ id, label, onClick }) {
    return {
      html: `
        <button id="${id}" style="padding: 16px 32px; font-size: 1.2rem; margin: 10px; width: 60%;">
          ${label}
        </button>
      `,
      handlers: {
        [id]: onClick
      }
    };
  };