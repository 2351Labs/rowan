import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanNumberField as RowanNumberFieldElement } from "../../number-field/number-field.js";

export const RowanNumberField: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanNumberFieldElement>
>;
