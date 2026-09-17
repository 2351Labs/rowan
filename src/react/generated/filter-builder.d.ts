import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanFilterBuilder as RowanFilterBuilderElement } from "../../filter-builder/filter-builder.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanFilterBuilder: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanFilterBuilderElement,
    {
      onRowanFilterChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanFilterBuilderElement>
>;
