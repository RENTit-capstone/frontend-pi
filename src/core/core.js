/* ========== State Management ========== */
export function createState(initialValue) {
    let value = initialValue;
    const listeners = [];

    const get = () => value;

    const set = (newValue) => {
        value = newValue;
        listeners.forEach((listener) => listener(value));
    };

    const subscribe = (callback) => listeners.push(callback);

    return [get, set, subscribe];
}

/* ========== Rendering ========== */
export function render() {

}

/* ========== Fetch Helper ========== */
export async function apiFetch() {

}
