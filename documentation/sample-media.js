import emptyCrates from "./assets/empty-crates.svg?url";
import northYard from "./assets/north-yard.svg?url";
import southDock from "./assets/south-dock.svg?url";
import yardWorker from "./assets/yard-worker.svg?url";

/**
 * Original illustrations shipped with the docs and Storybook.
 * They are not part of the published npm package.
 */
export const SAMPLE_MEDIA = {
  emptyCrates,
  northYard,
  southDock,
  yardWorker,
};

export function hydrateSampleMedia(root) {
  if (!root?.querySelectorAll) return;
  for (const el of root.querySelectorAll("[data-sample-media]")) {
    const url = SAMPLE_MEDIA[el.getAttribute("data-sample-media")];
    if (url) el.src = url;
  }
}
