import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanProgress as RowanProgressElement } from "../../progress/progress.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanProgress: ForwardRefExoticComponent<
  RowanWrapperProps<RowanProgressElement, {}> & RefAttributes<RowanProgressElement>
>;
