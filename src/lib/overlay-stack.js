const openOverlays = [];

let scrollLocked = false;
let previousBodyOverflow = "";

/** Marks an overlay as open. The most recently opened overlay is the topmost. */
export function pushOverlay(overlay) {
  const index = openOverlays.indexOf(overlay);
  if (index !== -1) openOverlays.splice(index, 1);

  openOverlays.push(overlay);
  sync();
}

export function removeOverlay(overlay) {
  const index = openOverlays.indexOf(overlay);
  if (index === -1) return;

  openOverlays.splice(index, 1);
  sync();
}

/** Only the topmost overlay may contain focus, so stacked overlays cannot fight over it. */
export function isTopmostOverlay(overlay) {
  return openOverlays[openOverlays.length - 1] === overlay;
}

// An overlay removed from the document while open never reports a close.
function pruneDisconnectedOverlays() {
  for (let index = openOverlays.length - 1; index >= 0; index -= 1) {
    if (!openOverlays[index]?.isConnected) openOverlays.splice(index, 1);
  }
}

function sync() {
  if (typeof document === "undefined") return;

  pruneDisconnectedOverlays();

  const shouldLock = openOverlays.length > 0;
  if (shouldLock === scrollLocked) return;

  scrollLocked = shouldLock;

  if (shouldLock) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return;
  }

  document.body.style.overflow = previousBodyOverflow;
}
