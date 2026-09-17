# @rowan-ui/maplibre

`@rowan-ui/maplibre` is Rowan's optional MapLibre adapter. It is separate from
`@rowan-ui/core`: applications choose the map provider account, tiles, costs,
attribution, privacy policy, offline policy, and deployment configuration.

## Install

```sh
npm install @rowan-ui/core @rowan-ui/maplibre maplibre-gl
```

Import Rowan tokens and the adapter at the application boundary:

```js
import "@rowan-ui/core/tokens";
import "@rowan-ui/maplibre/map";
```

## Application-owned map setup

`rowan-maplibre-map` does not choose a tile endpoint, style URL, provider
credential, or geocoder. Pass a MapLibre style and complete provider
attribution as properties. The component only starts the provider after both
are present.

```js
const map = document.querySelector("rowan-maplibre-map");

map.mapStyle = {
  version: 8,
  sources: {
    applicationTiles: {
      type: "raster",
      tiles: [applicationTileUrl],
      tileSize: 256,
    },
  },
  layers: [{ id: "application-tiles", type: "raster", source: "applicationTiles" }],
};

map.attribution = {
  label: "Application map data attribution",
  href: applicationAttributionUrl,
};

map.locations = [
  {
    id: "dispatch-17",
    label: "Generator inspection",
    latitude: 47.6062,
    longitude: -122.3321,
    description: "Priority inspection",
    layerId: "scheduled",
  },
];

map.layers = [{ id: "scheduled", label: "Scheduled work", visible: true }];
```

## React

```tsx
import { RowanMapLibreMap } from "@rowan-ui/maplibre/react/map";

<RowanMapLibreMap
  mapStyle={mapStyle}
  attribution={attribution}
  locations={locations}
  onRowanLocationActivate={(event) => select(event.detail)}
/>;
```

`mapStyle`, `locations`, and `layers` stay properties. The wrapper loads the
element module and is not a Server Component.

All structured inputs are properties and are copied before the adapter uses
them. Coordinates are the only spatial input in this package. It does not
perform geocoding, reverse geocoding, address lookup, or location telemetry.

`layers` describes Rowan marker groups. Its `visible` state controls matching
location markers and fallback records; it does not modify application-owned
MapLibre style layers.

Markers are reconciled by stable location ID. Routine location, label, and
layer updates preserve the current camera; activating a location is the
intentional action that moves the map.

This element is for modest numbers of individually actionable locations. It
does not make a thousands-of-points performance claim. For dense or
high-frequency spatial feeds, use a MapLibre GeoJSON source/layer integration
and retain an equivalent accessible record view in the application.

## Accessible alternatives

The component always renders a keyboard-operable location list and a semantic
location table. They remain usable when a style is absent, the MapLibre module
cannot load, or the provider fails. Activating a visible location fires:

```js
map.addEventListener("rowan-location-activate", (event) => {
  // { id, location, source: "marker" | "list" | "table" }
});
```

Changing an in-component marker-layer checkbox fires `rowan-layer-change` with
`{ id, visible }`. Parent-assigned data never emits either event.

Provider attribution is rendered visibly beneath the map. Attribution links
are restricted to HTTP(S); invalid links remain readable text.
