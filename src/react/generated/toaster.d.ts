import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanToaster as RowanToasterElement } from "../../toaster/toaster.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanToaster: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanToasterElement,
    {
      onRowanToastShow?: (event: CustomEvent) => void;
      onRowanToastDismiss?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanToasterElement>
>;
