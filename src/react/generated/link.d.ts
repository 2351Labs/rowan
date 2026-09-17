import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanLink as RowanLinkElement } from "../../link/link.js";

export const RowanLink: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanLinkElement>
>;
