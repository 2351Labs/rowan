import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanRadio as RowanRadioElement } from "../../radio/radio.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanRadio: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanRadioElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanRadioElement>
>;
