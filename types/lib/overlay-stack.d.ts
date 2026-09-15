/** Marks an overlay as open. The most recently opened overlay is the topmost. */
export function pushOverlay(overlay: any): void;
export function removeOverlay(overlay: any): void;
/** Only the topmost overlay may contain focus, so stacked overlays cannot fight over it. */
export function isTopmostOverlay(overlay: any): boolean;
