import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanFormLayout as RowanFormLayoutElement } from "../../form-layout/form-layout.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanFormLayout: ForwardRefExoticComponent<
  RowanWrapperProps<RowanFormLayoutElement, {}> & RefAttributes<RowanFormLayoutElement>
>;
