const openOverlays = [];

let scrollLockCount = 0;
let previousBodyOverflow = "";

/** Marks an overlay as open. The most recently opened overlay is the topmost. */
export function pushOverlay(overlay) {
  removeOverlay(overlay);
  openOverlays.push(overlay);
}

export function removeOverlay(overlay) {
  const index = openOverlays.indexOf(overlay);
  if (index !== -1) openOverlays.splice(index, 1);
}

/** Only the topmost overlay may contain focus, so stacked overlays cannot fight over it. */
export function isTopmostOverlay(overlay) {
  return openOverlays[openOverlays.length - 1] === overlay;
}

export function lockBodyScroll() {
  if (typeof document === "undefined") return;

  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  scrollLockCount += 1;
}

export function unlockBodyScroll() {
  if (typeof document === "undefined" || scrollLockCount === 0) return;

  scrollLockCount -= 1;
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
}
