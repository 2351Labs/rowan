import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanPopover as RowanPopoverElement } from "../../popover/popover.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanPopover: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanPopoverElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanPopoverElement>
>;
