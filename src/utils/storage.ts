/**
 * The name of the localStorage key.
 * @type {string}
 */
const prefix: string = 'indigo';

/**
 * Store a key value pair locally.
 * @param {string} key   The key
 * @param {any}    value Any serializable value
 */
function setLocalStorage(key: string, value: any) {
  try {
    (window as any).localStorage[`${prefix}.${key}`] = value;
  } catch (error) {}
}

/**
 * Get value by key locally
 * @param {string} key The key
 */
function getLocalStorage(key: string, defaultValue: any) {
  try {
    const value = (window as any).localStorage[`${prefix}.${key}`];
    return value === undefined ? defaultValue : value;
  } catch (error) {
    return defaultValue;
  }
}

export const storage = {
  set: setLocalStorage,
  get: getLocalStorage,
};
