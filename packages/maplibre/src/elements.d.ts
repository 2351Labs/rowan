import type { RowanMapLibreMap } from "./map/map.js";

declare global {
  interface HTMLElementTagNameMap {
    "rowan-maplibre-map": RowanMapLibreMap;
  }
}

export {};