import { createState } from '../core/core.js';
import Counter from './Counter.js';

const [countA, setCountA] = createState(0);
const [countB, setCountB] = createState(0);

export default function App() {
  const counterA = Counter({ count: countA, setCount: setCountA });
  const counterB = Counter({ count: countB, setCount: setCountB });

  return {
    html: `
      <div>
        <h1> Counter Test! </h1>
        <div style="margin-bottom: 20px;">
          ${counterA.html}
        </div>
        <div>
          ${counterB.html}
        </div>
      </div>
    `,
    handlers: {
      ...counterA.handlers,
      ...counterB.handlers,
    }
  };
}
