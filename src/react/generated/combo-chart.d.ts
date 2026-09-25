import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanComboChart as RowanComboChartElement } from "../../combo-chart/combo-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanComboChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanComboChartElement,
    {
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanComboChartElement>
>;
