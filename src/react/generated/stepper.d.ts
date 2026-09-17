import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanStepper as RowanStepperElement } from "../../stepper/stepper.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanStepper: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanStepperElement,
    {
      onRowanStepChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanStepperElement>
>;
