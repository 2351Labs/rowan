import type * as React from "react";

import "../elements.js";
import type { BaseElement } from "../lib/base-element.js";
import type { RowanTable, RowanTableConfig } from "../table/table.js";

type RowanTagName = Extract<keyof HTMLElementTagNameMap, `rowan-${string}`>;
type RowanCustomPropertyKeys<Element extends HTMLElement> = Exclude<
  Extract<keyof Element, string>,
  keyof HTMLElement | keyof BaseElement
>;
type RowanPropertyKeys<Element extends HTMLElement> = {
  [Key in RowanCustomPropertyKeys<Element>]: Key extends `render${string}`
    ? Key
    : NonNullable<Element[Key]> extends (...args: never[]) => unknown
      ? never
      : Key;
}[RowanCustomPropertyKeys<Element>];
type RowanScalarPropertyKeys<Element extends HTMLElement> = {
  [Key in RowanPropertyKeys<Element>]: Exclude<Element[Key], null | undefined> extends
    string | number | boolean
    ? Key
    : never;
}[RowanPropertyKeys<Element>];
type RowanWritablePropertyOverrides<Element extends HTMLElement> = Element extends RowanTable
  ? { config?: RowanTableConfig | null | undefined }
  : {};
type KebabCase<Value extends string> = Value extends `${infer Character}${infer Rest}`
  ? Character extends Lowercase<Character>
    ? `${Character}${KebabCase<Rest>}`
    : `-${Lowercase<Character>}${KebabCase<Rest>}`
  : Value;

export type RowanElementProperties<Element extends HTMLElement> = Omit<
  { [Key in RowanPropertyKeys<Element>]?: Element[Key] },
  keyof RowanWritablePropertyOverrides<Element>
> &
  RowanWritablePropertyOverrides<Element>;

type RowanAttributeProperties<Element extends HTMLElement> = {
  [Key in RowanScalarPropertyKeys<Element> as KebabCase<Key>]?: Element[Key];
};

type RowanAssociationAttributeProperties<Element extends HTMLElement> =
  Extract<"forTarget" | "htmlFor", keyof Element> extends never ? {} : { for?: string };

export type RowanElementProps<Element extends HTMLElement> = React.DetailedHTMLProps<
  React.HTMLAttributes<Element>,
  Element
> &
  RowanAttributeProperties<Element> &
  RowanAssociationAttributeProperties<Element>;

export type RowanIntrinsicElements = {
  [TagName in RowanTagName]: RowanElementProps<HTMLElementTagNameMap[TagName]>;
};

export type RowanElementRef<Element extends HTMLElement> = {
  readonly current: Element | null;
};

export type RowanEventListener<EventType extends Event = Event> = {
  bivarianceHack(event: EventType): void;
}["bivarianceHack"];

export type RowanElementOptions<Element extends HTMLElement> = {
  properties?: RowanElementProperties<Element>;
  events?: Record<string, RowanEventListener | undefined>;
};

/**
 * Binds React state and native custom-event listeners to a Rowan element ref.
 * Import custom-element registration modules from a client-only boundary.
 */
export function useRowanElement<Element extends HTMLElement>(
  ref: RowanElementRef<Element>,
  options?: RowanElementOptions<Element>,
): void;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends RowanIntrinsicElements {}
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends RowanIntrinsicElements {}
  }
}
