import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTableToolbar as RowanTableToolbarElement } from "../../table-toolbar/table-toolbar.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTableToolbar: ForwardRefExoticComponent<
  RowanWrapperProps<RowanTableToolbarElement, {}> & RefAttributes<RowanTableToolbarElement>
>;
