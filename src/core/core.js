/* ========== State Management ========== */
const registeredStates = [];

export function createState(initialValue) {
    const state = {
        value: initialValue,
        listeners: [],
    };

    const get = () => state.value;

    const set = (newValue) => {
        state.value = newValue;
        state.listeners.forEach((listener) => listener(value));
    };

    const subscribe = (listener) => state.listeners.push(listener);

    registeredStates.push(state);

    return [get, set, subscribe];
}

/* ========== Rendering ========== */
export function render(componentFn, rootElement) {
    const rerender = () => {
        rootElement.innerHTML = componentFn();
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
            'Content-Type': 'aplication/json',
            ...headers,
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return fetch(`${baseUrl}${endpoint}`, options)
        .then(async(res) => {
            if (!res.ok) {
                const error = await res.test();
                throw new Error(`API Error (${res.status}): ${error}`);
            }
            return res.json();
        })
        .catch((err) => {
            console.error('Fetch failed:', err,message);
            throw err;
        });
}
