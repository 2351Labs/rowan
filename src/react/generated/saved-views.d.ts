import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSavedViews as RowanSavedViewsElement } from "../../saved-views/saved-views.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSavedViews: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanSavedViewsElement,
    {
      onRowanSavedViewsChange?: (event: CustomEvent) => void;
      onRowanSavedViewApply?: (event: CustomEvent) => void;
      onRowanSavedViewShare?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanSavedViewsElement>
>;
