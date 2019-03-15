export function createElement<T>(
  tag: string,
  style?: any,
  attributes?: any,
): T {
  const element: HTMLElement = document.createElement(tag);

  applyStyle(element, style);
  applyAttributes(element, attributes);

  return (element as unknown) as T;
}

export function applyStyle(element: HTMLElement, style?: any) {
  if (style) {
    Object.entries(style).forEach(([key, value]) => {
      element.style[key] = value;
    });
  }
}

export function applyAttributes(element: HTMLElement, attributes?: any) {
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value as string);
    });
  }
}

export function insertAfter(node: Node, ref: Node) {
  ref.parentNode.insertBefore(node, ref.nextSibling);
}
