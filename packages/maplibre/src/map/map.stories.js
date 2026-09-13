import "./map.js";

const LOCAL_STYLE = {
  version: 8,
  sources: {},
  layers: [{ id: "background", type: "background", paint: { "background-color": "#e6eee5" } }],
};

const OPEN_FREE_MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

const OPEN_FREE_MAP_ATTRIBUTION = [
  { label: "OpenFreeMap", href: "https://openfreemap.org/" },
  { label: "© OpenMapTiles", href: "https://www.openmaptiles.org/" },
  {
    label: "Data from OpenStreetMap",
    href: "https://www.openstreetmap.org/copyright",
  },
];

const LOCATIONS = [
  {
    id: "dispatch-17",
    label: "Generator inspection",
    latitude: 47.6062,
    longitude: -122.3321,
    description: "Priority inspection",
    layerId: "scheduled",
  },
  {
    id: "dispatch-18",
    label: "Signal check",
    latitude: 47.6097,
    longitude: -122.3331,
    description: "Routine verification",
    layerId: "scheduled",
  },
];

function createMap({
  mapStyle = LOCAL_STYLE,
  attribution = { label: "Application-owned local style" },
} = {}) {
  const map = document.createElement("rowan-maplibre-map");
  map.label = "Dispatch coverage";
  map.description = "Scheduled field work by coordinate.";
  map.locations = LOCATIONS;
  map.layers = [{ id: "scheduled", label: "Scheduled work", color: "#24543c", visible: true }];
  map.attribution = attribution;
  map.mapStyle = mapStyle;
  return map;
}

export default {
  title: "Integrations/MapLibre Map",
  tags: ["autodocs"],
};

export const ApplicationOwnedStyle = {
  parameters: {
    rowanEventTrace: {
      script: ["Activate a location or change the scheduled-work visibility."],
      events: ["rowan-location-activate", "rowan-layer-change"],
    },
  },
  render: () => createMap(),
};

export const OpenFreeMap = {
  parameters: {
    rowanEventTrace: {
      script: ["Activate a marker or a fallback record on the OpenFreeMap Liberty style."],
      events: ["rowan-location-activate", "rowan-layer-change"],
    },
  },
  render: () =>
    createMap({
      mapStyle: OPEN_FREE_MAP_STYLE,
      attribution: OPEN_FREE_MAP_ATTRIBUTION,
    }),
};

export const ProviderFallback = {
  parameters: {
    rowanEventTrace: {
      script: ["Use either fallback record control to inspect the same location data."],
      events: ["rowan-location-activate"],
    },
  },
  render: () => createMap({ mapStyle: null }),
};
