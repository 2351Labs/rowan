import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanIconButton as RowanIconButtonElement } from "../../icon-button/icon-button.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanIconButton: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanIconButtonElement,
    {
      onRowanClick?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanIconButtonElement>
>;
