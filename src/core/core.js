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
export async function apiFetch() {

}
