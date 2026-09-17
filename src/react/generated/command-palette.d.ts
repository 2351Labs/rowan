import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCommandPalette as RowanCommandPaletteElement } from "../../command-palette/command-palette.js";

export const RowanCommandPalette: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanCommandPaletteElement>
>;
