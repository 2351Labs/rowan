import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanAccordion as RowanAccordionElement } from "../../accordion/accordion.js";

export const RowanAccordion: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanAccordionElement>
>;
