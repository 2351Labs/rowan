import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanFormField as RowanFormFieldElement } from "../../form-field/form-field.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanFormField: ForwardRefExoticComponent<
  RowanWrapperProps<RowanFormFieldElement, {}> & RefAttributes<RowanFormFieldElement>
>;
