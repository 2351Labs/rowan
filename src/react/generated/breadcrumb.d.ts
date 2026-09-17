import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanBreadcrumb as RowanBreadcrumbElement } from "../../breadcrumb/breadcrumb.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanBreadcrumb: ForwardRefExoticComponent<
  RowanWrapperProps<RowanBreadcrumbElement, {}> & RefAttributes<RowanBreadcrumbElement>
>;
