import type { IconOptions } from "../types/icon.js";

export type RowanIconFactory = (options?: IconOptions) => SVGSVGElement;

/** Registers an icon factory for declarative `<rowan-icon>` use. */
export function registerIcon(name: string, factory: RowanIconFactory): void;

/** Declarative SVG icon registered by an individual `@rowan-ui/icons/elements/*` import. */
export class RowanIcon extends HTMLElement {
  get name(): string;
  set name(value: string);
  get size(): string;
  set size(value: string | number);
  get strokeWidth(): string;
  set strokeWidth(value: string | number);
  get label(): string;
  set label(value: string);
}

declare global {
  interface HTMLElementTagNameMap {
    "rowan-icon": RowanIcon;
  }
}
