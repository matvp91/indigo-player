export const createFunctionFn = target => (key, value) => {
  Object.defineProperty(target, key, {
    __proto__: null,
    configurable: false,
    enumerable: true,
    writeable: false,
    value,
  });
};

