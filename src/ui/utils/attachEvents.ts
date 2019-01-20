interface EventDefinition {
  element: HTMLElement;
  events: Array<string>;
  callback();
}

export type EventUnsubscribeFn = () => void;

export function attachEvents(defs: Array<EventDefinition>) {
  const unsubscribers = [];

  defs.forEach(def => {
    def.events.forEach(name => {
      // Register the event listener.
      def.element.addEventListener(name, def.callback);

      // Create an unsubscribe method.
      const unsubscribe = () => def.element.removeEventListener(name, def.callback);
      unsubscribers.push(unsubscribe);
    });
  });

  // Return a function that unsubscribes the entire batch at once.
  return (
    () => unsubscribers.forEach(unsubscribe => unsubscribe())
  ) as EventUnsubscribeFn;
}
