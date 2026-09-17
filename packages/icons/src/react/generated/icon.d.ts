import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanIcon as RowanIconElement } from "../../element.js";
import type { RowanWrapperProps } from "@rowan-ui/core/react/wrapper-props";

export const RowanIcon: ForwardRefExoticComponent<
  RowanWrapperProps<RowanIconElement, {}> & RefAttributes<RowanIconElement>
>;
