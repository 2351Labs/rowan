import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanDataState as RowanDataStateElement } from "../../data-state/data-state.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanDataState: ForwardRefExoticComponent<
  RowanWrapperProps<RowanDataStateElement, {}> & RefAttributes<RowanDataStateElement>
>;
