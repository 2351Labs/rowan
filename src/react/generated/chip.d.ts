import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanChip as RowanChipElement } from "../../chip/chip.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanChip: ForwardRefExoticComponent<
  RowanWrapperProps<RowanChipElement, {}> & RefAttributes<RowanChipElement>
>;
