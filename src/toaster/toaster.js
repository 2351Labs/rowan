import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

import "../toast/toast.js";

const DEFAULT_DURATION = 5000;
const DEFAULT_MAX_VISIBLE = 3;
const DEFAULT_PLACEMENT = "top-end";
const VALID_PLACEMENTS = new Set([
  "top-start",
  "top-end",
  "bottom-start",
  "bottom-end",
  "bottom-center",
]);
const VALID_TONES = new Set(["info", "success", "warning", "danger"]);

/**
 * Toast queue manager with mobile-first placement and auto-dismiss handling.
 * @tag rowan-toaster
 * @attr {"top-start"|"top-end"|"bottom-start"|"bottom-end"|"bottom-center"} placement
 * @attr {number} max-visible
 * @attr {number} duration
 * @csspart stack
 * @event rowan-toast-show - Fired when a toast is shown
 * @event rowan-toast-dismiss - Fired when a toast is dismissed
 */
export class RowanToaster extends BaseElement {
  static styleUrl = new URL("./toaster.css", import.meta.url).href;
  static observedAttributes = ["placement", "max-visible", "duration"];
  static upgradeProperties = ["placement", "maxVisible", "duration"];

  #stack = null;
  #sequence = 0;
  #queue = [];
  #active = [];
  #timers = new Map();

  disconnectedCallback() {
    super.disconnectedCallback();

    for (const timer of this.#timers.values()) {
      clearTimeout(timer);
    }

    this.#timers.clear();
  }

  get placement() {
    const value = this.readString("placement", DEFAULT_PLACEMENT);
    return VALID_PLACEMENTS.has(value) ? value : DEFAULT_PLACEMENT;
  }

  set placement(value) {
    const nextPlacement = VALID_PLACEMENTS.has(value) ? value : DEFAULT_PLACEMENT;
    this.reflectString("placement", nextPlacement === DEFAULT_PLACEMENT ? null : nextPlacement);
  }

  get maxVisible() {
    return Math.max(1, Math.floor(this.readNumber("max-visible", DEFAULT_MAX_VISIBLE)));
  }

  set maxVisible(value) {
    const numeric = Number(value);
    const nextValue = Number.isFinite(numeric)
      ? Math.max(1, Math.floor(numeric))
      : DEFAULT_MAX_VISIBLE;

    this.reflectNumber("max-visible", nextValue === DEFAULT_MAX_VISIBLE ? null : nextValue);
  }

  get duration() {
    return Math.max(0, this.readNumber("duration", DEFAULT_DURATION));
  }

  set duration(value) {
    const numeric = Number(value);
    const nextValue = Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : DEFAULT_DURATION;

    this.reflectNumber("duration", nextValue === DEFAULT_DURATION ? null : nextValue);
  }

  show(input) {
    const nextToast = this.#normalizeToastInput(input);
    if (!nextToast) return null;

    this.#queue.push(nextToast);

    if (this.isConnected && this.#stack) {
      this.#flushQueue();
      this.#renderActiveToasts();
    } else {
      this.requestRender();
    }

    return nextToast.id;
  }

  dismiss(id, reason = "programmatic") {
    if (typeof id !== "string" || id.trim().length === 0) {
      return false;
    }

    const queuedIndex = this.#queue.findIndex((toast) => toast.id === id);
    if (queuedIndex >= 0) {
      this.#queue.splice(queuedIndex, 1);
      return true;
    }

    return this.#dismissActive(id, reason);
  }

  clear(reason = "programmatic") {
    this.#queue = [];

    const activeIds = this.#active.map((toast) => toast.id);
    for (const id of activeIds) {
      this.#dismissActive(id, reason);
    }
  }

  render() {
    if (!this.#stack) {
      this.renderRoot.innerHTML = '<div class="stack" part="stack"></div>';
      this.#stack = this.renderRoot.querySelector(".stack");

      this.listen(this.#stack, "rowan-dismiss", (event) => {
        const source = event.target;
        if (!(source instanceof HTMLElement)) return;

        const id = source.dataset.toastId;
        if (!id) return;

        const reason =
          event.detail && typeof event.detail.reason === "string"
            ? event.detail.reason
            : "dismiss-button";

        this.#dismissActive(id, reason);
      });
    }

    this.#flushQueue();
    this.#renderActiveToasts();

    for (const toast of this.#active) {
      this.#ensureDismissTimer(toast);
    }
  }

  #flushQueue() {
    while (this.#active.length < this.maxVisible && this.#queue.length > 0) {
      const nextToast = this.#queue.shift();
      this.#active.push(nextToast);
      this.#ensureDismissTimer(nextToast);

      emit(this, "rowan-toast-show", {
        id: nextToast.id,
        tone: nextToast.tone,
        title: nextToast.title,
        message: nextToast.message,
        duration: nextToast.duration,
      });
    }
  }

  #dismissActive(id, reason) {
    const activeIndex = this.#active.findIndex((toast) => toast.id === id);
    if (activeIndex < 0) {
      return false;
    }

    const [toast] = this.#active.splice(activeIndex, 1);
    this.#clearDismissTimer(id);
    this.#flushQueue();
    this.#renderActiveToasts();

    emit(this, "rowan-toast-dismiss", {
      id,
      tone: toast.tone,
      title: toast.title,
      message: toast.message,
      reason,
    });

    return true;
  }

  #renderActiveToasts() {
    if (!this.#stack) return;

    const fragment = document.createDocumentFragment();

    for (const toastData of this.#active) {
      fragment.append(this.#createToastElement(toastData));
    }

    this.#stack.replaceChildren(fragment);
  }

  #createToastElement(toastData) {
    const toast = document.createElement("rowan-toast");
    toast.dataset.toastId = toastData.id;

    if (toastData.tone !== "info") {
      toast.setAttribute("tone", toastData.tone);
    }

    if (toastData.dismissible) {
      toast.setAttribute("dismissible", "");
    }

    if (toastData.title) {
      const titleNode = document.createElement("span");
      titleNode.slot = "title";
      titleNode.textContent = toastData.title;
      toast.append(titleNode);
    }

    const messageNode = document.createElement("span");
    messageNode.textContent = toastData.message;
    toast.append(messageNode);

    return toast;
  }

  #ensureDismissTimer(toastData) {
    if (toastData.duration <= 0 || this.#timers.has(toastData.id)) {
      return;
    }

    const timer = setTimeout(() => {
      this.#dismissActive(toastData.id, "timeout");
    }, toastData.duration);

    this.#timers.set(toastData.id, timer);
  }

  #clearDismissTimer(id) {
    const timer = this.#timers.get(id);
    if (!timer) return;

    clearTimeout(timer);
    this.#timers.delete(id);
  }

  #normalizeToastInput(input) {
    const source =
      typeof input === "string"
        ? { message: input }
        : input && typeof input === "object"
          ? input
          : null;

    if (!source) return null;

    const message = typeof source.message === "string" ? source.message.trim() : "";
    if (!message) return null;

    const title = typeof source.title === "string" ? source.title.trim() : "";
    const tone = VALID_TONES.has(source.tone) ? source.tone : "info";
    const dismissible = source.dismissible !== false;
    const durationCandidate = Number(source.duration);
    const duration = Number.isFinite(durationCandidate)
      ? Math.max(0, Math.floor(durationCandidate))
      : this.duration;

    const requestedId = typeof source.id === "string" ? source.id.trim() : "";
    const id = this.#resolveToastId(requestedId);

    return {
      id,
      title,
      message,
      tone,
      dismissible,
      duration,
    };
  }

  #resolveToastId(requestedId) {
    if (requestedId.length > 0 && !this.#hasToastId(requestedId)) {
      return requestedId;
    }

    let nextId = this.#nextToastId();
    while (this.#hasToastId(nextId)) {
      nextId = this.#nextToastId();
    }

    return nextId;
  }

  #hasToastId(id) {
    return this.#active.some((toast) => toast.id === id) || this.#queue.some((toast) => toast.id === id);
  }

  #nextToastId() {
    this.#sequence += 1;
    return `toast-${Date.now()}-${this.#sequence}`;
  }
}

define("rowan-toaster", RowanToaster);