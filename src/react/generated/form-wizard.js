/**
 * @generated from custom-elements.json
 */
import "../../form-wizard/form-wizard.js";
import { createRowanComponent } from "../create-wrapper.js";

export const RowanFormWizard = createRowanComponent({
  tagName: "rowan-form-wizard",
  displayName: "RowanFormWizard",
  events: {
    onRowanStepChange: "rowan-step-change",
    onRowanInvalid: "rowan-invalid",
    onRowanComplete: "rowan-complete",
  },
});
