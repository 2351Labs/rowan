import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanImage as RowanImageElement } from "../../image/image.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanImage: ForwardRefExoticComponent<
  RowanWrapperProps<RowanImageElement, {}> & RefAttributes<RowanImageElement>
>;
