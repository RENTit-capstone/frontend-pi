/* ========== State Management ========== */
const registeredStates = [];
let stateCounter = 1;

export function createState(initialValue) {
  const state = {
    id: stateCounter++,
    value: initialValue,
    listeners: [],
  };

  const get = () => state.value;

  const set = (newValue) => {
    if (state.value !== newValue) {
      state.value = newValue;
      state.listeners.forEach(listener => listener());
    }
  };

  const subscribe = (listener) => {
    state.listeners.push(listener);
  };

  registeredStates.push(state);

  return [get, set, subscribe];
}

/* ========== Rendering ========== */
export function render(componentFn, rootElement) {
    const rerender = () => {
      const { html, handlers } = componentFn();
      rootElement.innerHTML = html;
  
      if (handlers && typeof handlers === 'object') {
        Object.entries(handlers).forEach(([id, handlerFn]) => {
          const el = document.getElementById(id);
          if (el) el.onclick = handlerFn;
        });
      }
    };
  
    registeredStates.forEach((state) => {
      state.listeners = [];
      state.listeners.push(rerender);
    });
  
    rerender();
  }
  

/* ========== Fetch Helper ========== */
export async function apiFetch(endpoint, { method = 'GET', body = null, headers = {} } = {}) {
    const baseUrl = 'http://localhost:8000';

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const res = await fetch(`${baseUrl}${endpoint}`, options);
        if (!res.ok) {
            const error = await res.test();
            throw new Error(`API Error (${res.status}): ${error}`);
        }
        return res.json();
    } catch (err) {
        console.error('Fetch failed:', err.message);
        throw err;
    }
}
