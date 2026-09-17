/**
 * @generated from custom-elements.json
 */
import "../../map/map.js";
import { createRowanComponent } from "@rowan-ui/core/react";

export const RowanMapLibreMap = createRowanComponent({
  tagName: "rowan-maplibre-map",
  displayName: "RowanMapLibreMap",
  events: {
    onRowanLayerChange: "rowan-layer-change",
    onRowanLocationActivate: "rowan-location-activate",
  },
});
