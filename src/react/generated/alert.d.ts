import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanAlert as RowanAlertElement } from "../../alert/alert.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanAlert: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanAlertElement,
    {
      onRowanDismiss?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanAlertElement>
>;
