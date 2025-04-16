import { createState, render } from './core/core.js';

const [count, setCount] = createState(0);

const Counter = () => {
  
    const html = `
      <div>
        <h2 id="count">카운트: ${count()}</h2>
        <button id="increment">+1</button>
      </div>
    `;
  
    const handlers = {
      increment: () => {
        setCount(count() + 1);
    },
    };
  
    return { html, handlers };
  };
  

render(Counter, document.getElementById("app"));
