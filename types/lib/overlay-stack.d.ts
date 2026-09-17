/** Marks a modal overlay as open. Modal layers lock page scroll. */
export function pushOverlay(overlay: any): void;
export function removeOverlay(overlay: any): void;
/** Marks a lightweight overlay as open. Does not lock page scroll. */
export function pushDismissible(overlay: any): void;
export function removeDismissible(overlay: any): void;
/** The most recently opened connected overlay, modal or dismissible. */
export function isTopmostOverlay(overlay: any): boolean;
export function hasModalOverlay(): boolean;
/** A dismissible closed during this task so a parent modal must not consume the same gesture. */
export function noteDismissibleClose(): void;
export function dismissConsumedThisTurn(): boolean;
export function subscribeOverlayChange(listener: any): () => boolean;
