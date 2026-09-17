import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSkeleton as RowanSkeletonElement } from "../../skeleton/skeleton.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSkeleton: ForwardRefExoticComponent<
  RowanWrapperProps<RowanSkeletonElement, {}> & RefAttributes<RowanSkeletonElement>
>;
