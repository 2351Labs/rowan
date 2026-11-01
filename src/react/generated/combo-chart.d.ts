import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanComboChart as RowanComboChartElement } from "../../combo-chart/combo-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanComboChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanComboChartElement,
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
    RefAttributes<RowanComboChartElement>
>;
