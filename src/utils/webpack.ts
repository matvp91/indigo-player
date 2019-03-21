export function resolveScriptPath(scriptName) {
  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    const src = scripts[i].src;
    if (src) {
      const index = src.lastIndexOf('/' + scriptName);
      if (index >= 0) {
        return src.substr(0, index + 1);
      }
    }
  }
  return '';
}
