import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCard as RowanCardElement } from "../../card/card.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanCard: ForwardRefExoticComponent<
  RowanWrapperProps<RowanCardElement, {}> & RefAttributes<RowanCardElement>
>;
