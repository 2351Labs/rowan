import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanLink as RowanLinkElement } from "../../link/link.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanLink: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanLinkElement,
    {
      onRowanClick?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanLinkElement>
>;
