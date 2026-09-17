import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSideNavSection as RowanSideNavSectionElement } from "../../side-nav-section/side-nav-section.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSideNavSection: ForwardRefExoticComponent<
  RowanWrapperProps<RowanSideNavSectionElement, {}> & RefAttributes<RowanSideNavSectionElement>
>;
