import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanAccordion as RowanAccordionElement } from "../../accordion/accordion.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanAccordion: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanAccordionElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanAccordionElement>
>;
