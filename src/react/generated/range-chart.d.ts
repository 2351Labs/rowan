import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanRangeChart as RowanRangeChartElement } from "../../range-chart/range-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanRangeChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanRangeChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
      onRowanPointClick?: (event: CustomEvent) => void;
      onRowanSelectionChange?: (event: CustomEvent) => void;
      onRowanSeriesToggle?: (event: CustomEvent) => void;
      onRowanZoom?: (event: CustomEvent) => void;
      onRowanSync?: (event: CustomEvent) => void;
      onRowanBrush?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanRangeChartElement>
>;
