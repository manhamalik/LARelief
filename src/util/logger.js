const isDevelopment = process?.env?.NODE_ENV === "development";

export function log(...args) {
    if (isDevelopment) {
        console.log(...args);
    }
}