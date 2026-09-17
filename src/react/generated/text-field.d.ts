import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTextField as RowanTextFieldElement } from "../../text-field/text-field.js";

export const RowanTextField: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanTextFieldElement>
>;
