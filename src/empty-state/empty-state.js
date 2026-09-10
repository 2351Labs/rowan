import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Empty state message block.
 * @tag rowan-empty-state
 * @slot icon
 * @slot title
 * @slot - Description
 * @slot actions
 * @csspart container
 * @csspart icon
 * @csspart title
 * @csspart body
 * @csspart actions
 */
export class RowanEmptyState extends BaseElement {
  static styleUrl = new URL("./empty-state.css", import.meta.url).href;

  render() {
    if (this.renderRoot.firstElementChild) return;

    this.renderRoot.innerHTML = `
      <section class="container" part="container">
        <div class="icon" part="icon"><slot name="icon"></slot></div>
        <h2 class="title" part="title"><slot name="title"></slot></h2>
        <div class="body" part="body"><slot></slot></div>
        <div class="actions" part="actions"><slot name="actions"></slot></div>
      </section>
    `;
  }
}

define("rowan-empty-state", RowanEmptyState);
