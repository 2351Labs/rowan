import { createElement, forwardRef, useRef } from "react";

import { useRowanElement } from "./use-rowan-element.js";

const ATTRIBUTE_PROPS = new Set(["id", "slot", "style", "title", "role", "lang", "dir", "hidden"]);

function assignRef(ref, node) {
  if (typeof ref === "function") {
    ref(node);
    return;
  }

  if (ref && typeof ref === "object") {
    ref.current = node;
  }
}

/**
 * @param {{ tagName: string, events?: Record<string, string>, displayName?: string }} options
 */
export function createRowanComponent(options) {
  const eventMap = options.events ?? {};
  const displayName = options.displayName ?? options.tagName;

  const Component = forwardRef(function RowanWrapper(props, forwardedRef) {
    const innerRef = useRef(null);
    const { children, className, ...rest } = props;
    const properties = {};
    const events = {};
    const attrs = {};

    if (className) attrs.class = className;

    for (const [key, value] of Object.entries(rest)) {
      if (value === undefined) continue;

      const eventType = eventMap[key];
      if (eventType) {
        if (typeof value === "function") events[eventType] = value;
        continue;
      }

      if (key === "class") {
        attrs.class = value;
        continue;
      }

      if (ATTRIBUTE_PROPS.has(key) || key.startsWith("aria-") || key.startsWith("data-")) {
        attrs[key] = value;
        continue;
      }

      properties[key] = value;
    }

    useRowanElement(innerRef, { properties, events });

    return createElement(
      options.tagName,
      {
        ...attrs,
        ref: (node) => {
          innerRef.current = node;
          assignRef(forwardedRef, node);
        },
      },
      children,
    );
  });

  Component.displayName = displayName;
  return Component;
}
