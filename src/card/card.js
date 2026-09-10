import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";

/**
 * Surface container for grouped content.
 * @tag rowan-card
 * @slot media
 * @slot header
 * @slot title
 * @slot - Body content
 * @slot footer
 * @slot actions
 * @csspart card
 * @csspart media
 * @csspart header
 * @csspart title
 * @csspart body
 * @csspart footer
 * @csspart actions
 */
export class RowanCard extends BaseElement {
  static styleUrl = new URL("./card.css", import.meta.url).href;

  render() {
    if (this.renderRoot.firstElementChild) return;

    this.renderRoot.innerHTML = `
      <article class="card" part="card">
        <div class="media" part="media"><slot name="media"></slot></div>
        <div class="header" part="header"><slot name="header"></slot></div>
        <div class="title" part="title"><slot name="title"></slot></div>
        <div class="body" part="body"><slot></slot></div>
        <div class="footer" part="footer"><slot name="footer"></slot></div>
        <div class="actions" part="actions"><slot name="actions"></slot></div>
      </article>
    `;
  }
}

define("rowan-card", RowanCard);
