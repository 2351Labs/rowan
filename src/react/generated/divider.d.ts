import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanDivider as RowanDividerElement } from "../../divider/divider.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanDivider: ForwardRefExoticComponent<
  RowanWrapperProps<RowanDividerElement, {}> & RefAttributes<RowanDividerElement>
>;
