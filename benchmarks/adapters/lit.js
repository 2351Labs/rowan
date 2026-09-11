export const label = "Lit";
export const scope = "Minimal Lit button, checkbox, and switch custom elements";
export const tableUnavailableReason =
  "Lit is an element authoring runtime; this harness does not substitute a third-party table component.";

const tags = {
  button: "rowan-benchmark-lit-button",
  checkbox: "rowan-benchmark-lit-checkbox",
  switch: "rowan-benchmark-lit-switch",
};

function controlsAreRendered(container) {
  return [...container.children].every((control) => control.shadowRoot?.childElementCount > 0);
}

export async function loadFoundation() {
  const { LitElement, html } = await import("lit");

  class BenchmarkButton extends LitElement {
    render() {
      return html`<button type="button">Continue</button>`;
    }
  }

  class BenchmarkCheckbox extends LitElement {
    render() {
      return html`<label><input type="checkbox" checked />Receive updates</label>`;
    }
  }

  class BenchmarkSwitch extends LitElement {
    render() {
      return html`<label><input type="checkbox" role="switch" checked />Notifications</label>`;
    }
  }

  const definitions = [
    [tags.button, BenchmarkButton],
    [tags.checkbox, BenchmarkCheckbox],
    [tags.switch, BenchmarkSwitch],
  ];

  for (const [tag, ElementClass] of definitions) {
    if (!customElements.get(tag)) customElements.define(tag, ElementClass);
  }

  return {
    createControls() {
      const container = document.createElement("section");
      container.append(
        document.createElement(tags.button),
        document.createElement(tags.checkbox),
        document.createElement(tags.switch),
      );
      return container;
    },
    isRendered: controlsAreRendered,
  };
}
