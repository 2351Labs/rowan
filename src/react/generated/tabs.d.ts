import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTabs as RowanTabsElement } from "../../tabs/tabs.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTabs: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanTabsElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanTabsElement>
>;
