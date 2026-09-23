import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSourceMeta as RowanSourceMetaElement } from "../../source-meta/source-meta.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSourceMeta: ForwardRefExoticComponent<
  RowanWrapperProps<RowanSourceMetaElement, {}> & RefAttributes<RowanSourceMetaElement>
>;
