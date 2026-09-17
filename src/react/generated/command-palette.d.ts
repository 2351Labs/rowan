import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCommandPalette as RowanCommandPaletteElement } from "../../command-palette/command-palette.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanCommandPalette: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanCommandPaletteElement,
    {
      onRowanCommand?: (event: CustomEvent) => void;
      onRowanClose?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanCommandPaletteElement>
>;
