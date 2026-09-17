import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanMapLibreMap as RowanMapLibreMapElement } from "../../map/map.js";
import type { RowanWrapperProps } from "@rowan-ui/core/react/wrapper-props";

export const RowanMapLibreMap: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanMapLibreMapElement,
    {
      onRowanLayerChange?: (event: CustomEvent) => void;
      onRowanLocationActivate?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanMapLibreMapElement>
>;
