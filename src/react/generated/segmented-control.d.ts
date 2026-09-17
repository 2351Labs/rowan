import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSegmentedControl as RowanSegmentedControlElement } from "../../segmented-control/segmented-control.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSegmentedControl: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanSegmentedControlElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanSegmentedControlElement>
>;
