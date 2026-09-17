import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSwitch as RowanSwitchElement } from "../../switch/switch.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSwitch: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanSwitchElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanSwitchElement>
>;
