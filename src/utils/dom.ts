export function createElement<T>(
  tag: string,
  style?: any,
  attributes?: any,
): T {
  const element: HTMLElement = document.createElement(tag);

  if (style) {
    Object.entries(style).forEach(([key, value]) => {
      element.style[key] = value;
    });
  }

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value as string);
    });
  }

  return (element as unknown) as T;
}
