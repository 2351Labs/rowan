import { h, icon } from "../dom.js";

export function renderNotFound(outlet) {
  const page = h("div", { class: "page", "data-page": "not-found", "data-ready": "true" });
  const missing = h("rowan-empty-state");
  missing.append(
    icon("circle-alert", "icon"),
    h("span", { slot: "title", text: "That page is not in the console" }),
    h("p", { text: "The address does not match a Lumen screen." }),
    h("rowan-link", { slot: "actions", href: "#/" }, "Back to overview"),
  );
  page.append(h("h1", { tabindex: "-1", text: "Page not found" }), missing);
  outlet.append(page);
}
