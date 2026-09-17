import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSkeleton as RowanSkeletonElement } from "../../skeleton/skeleton.js";

export const RowanSkeleton: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanSkeletonElement>
>;
