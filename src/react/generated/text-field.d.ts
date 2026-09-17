import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTextField as RowanTextFieldElement } from "../../text-field/text-field.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTextField: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanTextFieldElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanTextFieldElement>
>;
