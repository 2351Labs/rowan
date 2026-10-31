import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanGaugeChart as RowanGaugeChartElement } from "../../gauge-chart/gauge-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanGaugeChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanGaugeChartElement,
    {
      onRowanPointClick?: (event: CustomEvent) => void;
      onRowanSelectionChange?: (event: CustomEvent) => void;
      onRowanSeriesToggle?: (event: CustomEvent) => void;
      onRowanSync?: (event: CustomEvent) => void;
      onRowanBrush?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanGaugeChartElement>
>;
