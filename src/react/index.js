import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Binds React state and native event listeners to a Rowan custom-element ref.
 * This hook does not register Rowan elements; import registration modules from
 * client-only React effects or another browser-only application boundary.
 *
 * Properties are assigned only when their value changes, so the object and array
 * APIs Rowan exposes as property-only keep their identity across renders.
 * Listeners bind once per event type and dispatch to the latest handler.
 * If the host is missing on the first effect, listeners attach when it mounts.
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
  const [host, setHost] = useState(null);

  useEffect(() => {
    latestEvents.current = events;
  });

  useLayoutEffect(() => {
    const element = ref?.current ?? null;
    setHost((current) => (current === element ? current : element));
  });

  useEffect(() => {
    const element = host;
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
    const element = host;
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
  }, [host, eventTypes]);
}
