import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSlider as RowanSliderElement } from "../../slider/slider.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSlider: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanSliderElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanSliderElement>
>;
