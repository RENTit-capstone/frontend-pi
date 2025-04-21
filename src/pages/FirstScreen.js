//TODO

export default function FirstScreen() {
  return {
    html: `
      <div>
        <h1> Welcome to First Screen. </h1>
        <div style="margin-bottom: 20px;">
          <button id="goto-${id}"></button>
          <button id="goto-${id}"></button>
          <button id="goto-${id}"></button>
          <button id="goto-${id}"></button>
        </div>
      </div>
    `,
    handlers: {
      ...counterA.handlers,
      ...counterB.handlers,
    }
  };
}