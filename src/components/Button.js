export default function Button(props) {
    const { text, onClick } = props.text;
    return {
      html: `
        <button id="button-${text}">${text}</button>
      `,
      handlers: {
        [`${text}`]: () => onClick()
      }
    };
  }