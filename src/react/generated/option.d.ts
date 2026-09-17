import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanOption as RowanOptionElement } from "../../option/option.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanOption: ForwardRefExoticComponent<
  RowanWrapperProps<RowanOptionElement, {}> & RefAttributes<RowanOptionElement>
>;
