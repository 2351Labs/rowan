import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanNumberField as RowanNumberFieldElement } from "../../number-field/number-field.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanNumberField: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanNumberFieldElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanNumberFieldElement>
>;
