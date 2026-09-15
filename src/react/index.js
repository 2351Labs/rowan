import { useEffect, useRef } from "react";

/**
 * Binds React state and native event listeners to a Rowan custom-element ref.
 * This hook does not register Rowan elements; import registration modules from
 * client-only React effects or another browser-only application boundary.
 *
 * Properties are assigned only when their value changes, so the object and array
 * APIs Rowan exposes as property-only keep their identity across renders.
 * Listeners bind once per event type and dispatch to the latest handler.
 *
 * @param {{ current: HTMLElement | null }} ref
 * @param {{ properties?: Record<string, unknown>, events?: Record<string, EventListener | undefined> }} [options]
 */
export function useRowanElement(ref, options = {}) {
  const properties = options.properties;
  const events = options.events;

  const appliedProperties = useRef(new Map());
  const appliedElement = useRef(null);
  const latestEvents = useRef(events);

  useEffect(() => {
    latestEvents.current = events;
  });

  useEffect(() => {
    const element = ref?.current;
    if (!element || !properties) return;

    if (appliedElement.current !== element) {
      appliedElement.current = element;
      appliedProperties.current.clear();
    }

    const applied = appliedProperties.current;
    for (const [name, value] of Object.entries(properties)) {
      if (applied.has(name) && Object.is(applied.get(name), value)) continue;

      applied.set(name, value);
      element[name] = value;
    }
  });

  // Stable key so listeners rebind only when the set of event types changes.
  const eventTypes = events ? Object.keys(events).sort().join("\u0000") : "";

  useEffect(() => {
    const element = ref?.current;
    if (!element || eventTypes === "") return;

    const subscriptions = eventTypes.split("\u0000").map((type) => {
      const listener = (event) => {
        const handler = latestEvents.current?.[type];
        if (typeof handler === "function") handler(event);
      };

      element.addEventListener(type, listener);
      return [type, listener];
    });

    return () => {
      for (const [type, listener] of subscriptions) {
        element.removeEventListener(type, listener);
      }
    };
  }, [ref, eventTypes]);
}
