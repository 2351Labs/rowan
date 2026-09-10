import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

/**
 * Status message surface with optional dismissal.
 * @tag rowan-alert
 * @attr {"info"|"success"|"warning"|"danger"} tone
 * @attr {boolean} dismissible
 * @slot - Alert message
 * @csspart alert
 * @csspart dismiss
 * @event rowan-dismiss - Fired when dismissed by user interaction
 */
export class RowanAlert extends BaseElement {
  static styleUrl = new URL("./alert.css", import.meta.url).href;
  static useElementInternals = true;
  static observedAttributes = ["tone", "dismissible"];
  static upgradeProperties = ["tone", "dismissible"];

  #container = null;
  #dismissButton = null;

  get tone() {
    return this.readString("tone", "info");
  }

  set tone(value) {
    this.reflectString("tone", value === "info" ? null : value);
  }

  get dismissible() {
    return this.readBoolean("dismissible");
  }

  set dismissible(value) {
    this.reflectBoolean("dismissible", Boolean(value));
  }

  render() {
    if (!this.#container) {
      this.renderRoot.innerHTML = `
        <div class="alert" part="alert">
          <div class="message"><slot></slot></div>
          <button class="dismiss" part="dismiss" type="button" aria-label="Dismiss alert">×</button>
        </div>
      `;

      this.#container = this.renderRoot.querySelector(".alert");
      this.#dismissButton = this.renderRoot.querySelector(".dismiss");

      this.listen(this.#dismissButton, "click", () => {
        this.hidden = true;
        emit(this, "rowan-dismiss", {
          tone: this.tone,
          reason: "dismiss-button",
        });
      });
    }

    this.#dismissButton.hidden = !this.dismissible;

    if (this.internals && !this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = this.tone === "danger" ? "alert" : "status";
    }
  }
}

define("rowan-alert", RowanAlert);
