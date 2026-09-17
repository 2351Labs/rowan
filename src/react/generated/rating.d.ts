import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanRating as RowanRatingElement } from "../../rating/rating.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanRating: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanRatingElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanRatingElement>
>;
