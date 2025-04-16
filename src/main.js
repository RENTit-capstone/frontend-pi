import { createState, render, apiFetch } from './core/core.js';

const Counter = () => {
    const [count, setCount] = createState(0);

    return `
        <div>
            <h2> 카운트: ${count()}</h2>
            <button onclick="(${() => setCount(count() + 1)})()">+1</button>
        </div>
    `;
}

render(Counter, document.getElementById('app'));