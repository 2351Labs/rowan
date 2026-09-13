import "../src/elements.js";
import type { RowanMapLibreMap } from "../src/map/map.js";

const map = document.createElement("rowan-maplibre-map");
const typedMap: RowanMapLibreMap = map;

typedMap.locations = [
  {
    id: "dispatch-17",
    label: "Generator inspection",
    latitude: 47.6062,
    longitude: -122.3321,
  },
];
typedMap.layers = [{ id: "scheduled", label: "Scheduled", visible: true }];
typedMap.mapStyle = { version: 8, sources: {}, layers: [] };
typedMap.attribution = { label: "Open source tiles", href: "https://tiles.example.test/terms" };
typedMap.attribution = [{ label: "Second source" }];

const attributionLabels: string[] = typedMap.attribution.map((item) => item.label);
void attributionLabels;

// @ts-expect-error Locations must be assigned as an array property.
typedMap.locations = "dispatch-17";