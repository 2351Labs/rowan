import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanColumnSparkline as RowanColumnSparklineElement } from "../../column-sparkline/column-sparkline.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanColumnSparkline: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanColumnSparklineElement,
    {
      onRowanPointClick?: (event: CustomEvent) => void;
      onRowanSelectionChange?: (event: CustomEvent) => void;
      onRowanSeriesToggle?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanColumnSparklineElement>
>;
