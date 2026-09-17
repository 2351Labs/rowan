import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanToast as RowanToastElement } from "../../toast/toast.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanToast: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanToastElement,
    {
      onRowanDismiss?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanToastElement>
>;
