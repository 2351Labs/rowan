import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanFormWizard as RowanFormWizardElement } from "../../form-wizard/form-wizard.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanFormWizard: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanFormWizardElement,
    {
      onRowanStepChange?: (event: CustomEvent) => void;
      onRowanInvalid?: (event: CustomEvent) => void;
      onRowanComplete?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanFormWizardElement>
>;
