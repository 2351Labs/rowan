import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCarousel as RowanCarouselElement } from "../../carousel/carousel.js";

export const RowanCarousel: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanCarouselElement>
>;
