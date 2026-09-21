import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { withPlayground } from "storybook-addon-playground";

export default {
  title: "Playground",
  parameters: {
    a11y: { disable: true, test: "off" },
    rowanEventTrace: false,
    layout: "fullscreen",
  },
};

function PlaygroundApp({ context }) {
  return withPlayground(() => null, context);
}

export const Sandbox = {
  render: (_args, context) => {
    const host = document.createElement("div");
    host.style.minHeight = "100%";
    const root = createRoot(host);
    root.render(createElement(PlaygroundApp, { context }));
    const observer = new MutationObserver(() => {
      if (document.contains(host)) return;
      root.unmount();
      observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return host;
  },
};
