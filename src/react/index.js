import { useEffect } from "react";

function isEventListener(listener) {
  return typeof listener === "function";
}

/**
 * Binds React state and native event listeners to a Rowan custom-element ref.
 * This hook does not register Rowan elements; import registration modules from
 * client-only React effects or another browser-only application boundary.
 *
 * @param {{ current: HTMLElement | null }} ref
 * @param {{ properties?: Record<string, unknown>, events?: Record<string, EventListener | undefined> }} [options]
 */
export function useRowanElement(ref, options = {}) {
  const properties = options.properties;
  const events = options.events;

  useEffect(() => {
    const element = ref?.current;
    if (!element || !properties) return;

    for (const [name, value] of Object.entries(properties)) {
      element[name] = value;
    }
  });

  useEffect(() => {
    const element = ref?.current;
    if (!element || !events) return;

    const subscriptions = Object.entries(events).flatMap(([type, listener]) => {
      if (!isEventListener(listener)) return [];

      element.addEventListener(type, listener);
      return [[type, listener]];
    });

    return () => {
      for (const [type, listener] of subscriptions) {
        element.removeEventListener(type, listener);
      }
    };
  });
}
