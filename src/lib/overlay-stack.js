const layers = [];
const overlayChangeListeners = new Set();

let scrollLocked = false;
let previousBodyOverflow = "";
let dismissConsumed = false;
let dismissTurnScheduled = false;

function pruneDisconnectedOverlays() {
  for (let index = layers.length - 1; index >= 0; index -= 1) {
    if (!layers[index]?.overlay?.isConnected) layers.splice(index, 1);
  }
}

function addLayer(overlay, lockScroll) {
  const index = layers.findIndex((layer) => layer.overlay === overlay);
  if (index !== -1) layers.splice(index, 1);

  layers.push({ overlay, lockScroll });
  sync();
}

function removeLayer(overlay) {
  const index = layers.findIndex((layer) => layer.overlay === overlay);
  if (index === -1) return;

  layers.splice(index, 1);
  sync();
}

/** Marks a modal overlay as open. Modal layers lock page scroll. */
export function pushOverlay(overlay) {
  addLayer(overlay, true);
}

export function removeOverlay(overlay) {
  removeLayer(overlay);
}

/** Marks a lightweight overlay as open. Does not lock page scroll. */
export function pushDismissible(overlay) {
  addLayer(overlay, false);
}

export function removeDismissible(overlay) {
  removeLayer(overlay);
}

/** The most recently opened connected overlay, modal or dismissible. */
export function isTopmostOverlay(overlay) {
  pruneDisconnectedOverlays();
  return layers[layers.length - 1]?.overlay === overlay;
}

export function hasModalOverlay() {
  pruneDisconnectedOverlays();
  return layers.some((layer) => layer.lockScroll);
}

/** A dismissible closed during this task so a parent modal must not consume the same gesture. */
export function noteDismissibleClose() {
  dismissConsumed = true;
  if (dismissTurnScheduled) return;

  dismissTurnScheduled = true;
  queueMicrotask(() => {
    dismissConsumed = false;
    dismissTurnScheduled = false;
  });
}

export function dismissConsumedThisTurn() {
  return dismissConsumed;
}

export function subscribeOverlayChange(listener) {
  overlayChangeListeners.add(listener);
  return () => overlayChangeListeners.delete(listener);
}

function sync() {
  if (typeof document === "undefined") return;

  pruneDisconnectedOverlays();

  const shouldLock = layers.some((layer) => layer.lockScroll);
  if (shouldLock !== scrollLocked) {
    scrollLocked = shouldLock;

    if (shouldLock) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousBodyOverflow;
    }
  }

  for (const listener of overlayChangeListeners) listener();
}
