export const createFunctionFn = target => (key, value) => {
  Object.defineProperty(target, key, {
    configurable: false,
    enumerable: true,
    writable: false,
    value,
  });
};
