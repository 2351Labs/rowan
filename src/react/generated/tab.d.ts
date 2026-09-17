import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTab as RowanTabElement } from "../../tab/tab.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTab: ForwardRefExoticComponent<
  RowanWrapperProps<RowanTabElement, {}> & RefAttributes<RowanTabElement>
>;
