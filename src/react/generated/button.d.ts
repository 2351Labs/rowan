import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanButton as RowanButtonElement } from "../../button/button.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanButton: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanButtonElement,
    {
      onRowanClick?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanButtonElement>
>;
