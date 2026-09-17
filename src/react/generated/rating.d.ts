import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanRating as RowanRatingElement } from "../../rating/rating.js";

export const RowanRating: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanRatingElement>
>;
