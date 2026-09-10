import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Breadcrumb navigation wrapper.
 * @tag rowan-breadcrumb
 * @slot - Breadcrumb items
 * @csspart nav
 */
export class RowanBreadcrumb extends BaseElement {
  static styleUrl = new URL("./breadcrumb.css", import.meta.url).href;

  render() {
    if (!this.renderRoot.firstElementChild) {
      this.renderRoot.innerHTML =
        '<nav class="nav" part="nav" aria-label="Breadcrumb"><slot></slot></nav>';
    }
  }
}

define("rowan-breadcrumb", RowanBreadcrumb);
