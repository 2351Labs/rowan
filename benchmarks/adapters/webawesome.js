export const label = "Web Awesome";
export const scope = "Direct button, checkbox, and switch component imports";
export const tableUnavailableReason =
  "Web Awesome 3.12.0 has no verified table or data-table component import for this workload.";

function controlsAreRendered(container) {
  return [...container.children].every((control) => control.shadowRoot?.childElementCount > 0);
}

export async function loadFoundation() {
  await Promise.all([
    import("@awesome.me/webawesome/dist/components/button/button.js"),
    import("@awesome.me/webawesome/dist/components/checkbox/checkbox.js"),
    import("@awesome.me/webawesome/dist/components/switch/switch.js"),
  ]);

  return {
    createControls() {
      const container = document.createElement("section");
      const button = document.createElement("wa-button");
      const checkbox = document.createElement("wa-checkbox");
      const switchControl = document.createElement("wa-switch");

      button.textContent = "Continue";
      checkbox.checked = true;
      checkbox.textContent = "Receive updates";
      switchControl.checked = true;
      switchControl.textContent = "Notifications";
      container.append(button, checkbox, switchControl);

      return container;
    },
    isRendered: controlsAreRendered,
  };
}
