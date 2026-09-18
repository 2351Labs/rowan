import type { CSSProperties, ReactNode } from "react";

import type { BaseElement } from "../lib/base-element.js";

type ChartLabelsKey<Element> = Element extends { labels: infer Labels }
  ? Labels extends readonly string[]
    ? "labels"
    : never
  : never;

type HostKey<Element extends HTMLElement> =
  | Exclude<Extract<keyof Element, string>, keyof HTMLElement | keyof BaseElement>
  | ChartLabelsKey<Element>;

type HostPropertyKeys<Element extends HTMLElement> = {
  [Key in HostKey<Element>]: NonNullable<Element[Key]> extends (...args: never[]) => unknown
    ? null extends Element[Key]
      ? Key
      : undefined extends Element[Key]
        ? Key
        : never
    : Key;
}[HostKey<Element>];

export type RowanWrapperProps<Element extends HTMLElement, EventProps extends object = {}> = {
  [Key in HostPropertyKeys<Element>]?: Element[Key];
} & EventProps & {
    children?: ReactNode;
    className?: string;
    id?: string;
    slot?: string;
    style?: CSSProperties;
    title?: string;
    role?: string;
    hidden?: boolean;
  };
