import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSelect as RowanSelectElement } from "../../select/select.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSelect: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanSelectElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanSelectElement>
>;
