import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanBulletChart as RowanBulletChartElement } from "../../bullet-chart/bullet-chart.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanBulletChart: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanBulletChartElement,
    {
      onRowanPointClick?: (event: CustomEvent) => void;
      onRowanSelectionChange?: (event: CustomEvent) => void;
      onRowanSeriesToggle?: (event: CustomEvent) => void;
      onRowanPointActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanBulletChartElement>
>;
