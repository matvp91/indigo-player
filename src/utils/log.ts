let lastTime: number;

let isEnabled: boolean = false;

function stringToColor(str: string) {
  let hash = 0;
  if (str.length === 0) { return hash; }
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 255;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

export function setConsoleLogs(consoleLogsEnabled: boolean) {
  isEnabled = consoleLogsEnabled;
}

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
