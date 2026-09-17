import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSpinner as RowanSpinnerElement } from "../../spinner/spinner.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSpinner: ForwardRefExoticComponent<
  RowanWrapperProps<RowanSpinnerElement, {}> & RefAttributes<RowanSpinnerElement>
>;
