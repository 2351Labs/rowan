import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTextarea as RowanTextareaElement } from "../../textarea/textarea.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTextarea: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanTextareaElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanTextareaElement>
>;
