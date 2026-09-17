import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCarousel as RowanCarouselElement } from "../../carousel/carousel.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanCarousel: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanCarouselElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanCarouselElement>
>;
