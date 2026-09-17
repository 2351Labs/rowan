import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSideNav as RowanSideNavElement } from "../../side-nav/side-nav.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSideNav: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanSideNavElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanSideNavElement>
>;
