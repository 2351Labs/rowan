import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanFormField as RowanFormFieldElement } from "../../form-field/form-field.js";

export const RowanFormField: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanFormFieldElement>
>;
