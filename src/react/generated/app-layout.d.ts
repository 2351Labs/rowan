import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanAppLayout as RowanAppLayoutElement } from "../../app-layout/app-layout.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanAppLayout: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanAppLayoutElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanAppLayoutElement>
>;
