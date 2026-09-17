import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanAvatar as RowanAvatarElement } from "../../avatar/avatar.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanAvatar: ForwardRefExoticComponent<
  RowanWrapperProps<RowanAvatarElement, {}> & RefAttributes<RowanAvatarElement>
>;
