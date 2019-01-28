let lastTime: number;

let isEnabled: boolean = false;

/**
 * Generate a fixed color for a specific string.
 * @param {string} str Input string
 */
function stringToColor(str: string) {
  let hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}

/**
 * Enable or disable logs.
 * @param {boolean} consoleLogsEnabled Enabled or not
 */
export function setConsoleLogs(consoleLogsEnabled: boolean) {
  isEnabled = consoleLogsEnabled;
}

/**
 * Creates a logger function for a specific namespace.
 * @param {string} namespace Namespace
 */
export function log(namespace: string) {
  const color = stringToColor(namespace);

  return (first: any, ...args) => {
    if (!isEnabled) {
      return;
    }

    if (lastTime === undefined) {
      lastTime = performance.now();
    }

    const colorArgs = [`color: ${color}`, 'color: #333333', `color: ${color}`];

    const diff = Math.trunc(performance.now() - lastTime);
    lastTime = performance.now();

    console.log(`%c${namespace}%c ${first} %c${diff}ms`, ...colorArgs, ...args);
  };
}
