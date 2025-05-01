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
    if (typeof listener === 'function') {
      state.listeners.push(listener);
    }
  };

  registeredStates.push(state);
  return [get, set, subscribe];
}


/* ========== Component Rendering ========== */
export function render(componentFn, rootElement) {
  const rerender = () => {
    const { html, handlers } = componentFn();
    rootElement.innerHTML = html;

    if (handlers && typeof handlers === 'object') {
      Object.entries(handlers).forEach(([id, handlerFn]) => {
        const el = document.getElementById(id);
        if (el && typeof handlerFn === 'function') {
          el.onclick = handlerFn;
        }
      });
    }
  };

  registeredStates.forEach((state) => {
    if (!state.listeners.includes(rerender)) {
      state.listeners.push(rerender);
    }
  });

  rerender();
}


/* ========== API Fetch Helper ========== */
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
      const error = await res.text();
      throw new Error(`API Error (${res.status}): ${error}`);
    }
    return res.json();
  } catch (err) {
    console.error('[FETCH] Failed:', err.message);
    throw err;
  }
}
