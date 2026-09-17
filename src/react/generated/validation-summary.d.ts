import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanValidationSummary as RowanValidationSummaryElement } from "../../validation-summary/validation-summary.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanValidationSummary: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanValidationSummaryElement,
    {
      onRowanJump?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanValidationSummaryElement>
>;
