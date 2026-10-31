import "@rowan-ui/maplibre/map";

import { h } from "../dom.js";

const LOCAL_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#d7e0d6" },
    },
  ],
};

export function renderMap(outlet, ctx) {
  const page = h("div", { class: "page", "data-page": "map", "data-ready": "true" });
  page.append(
    h(
      "header",
      { class: "page-header" },
      h(
        "div",
        {},
        h("h1", { tabindex: "-1", text: "Fulfillment map" }),
        h("p", {
          class: "lede",
          text: "Warehouses, showrooms, and one delayed inbound dock. The map uses an application-owned style with no tile server, so it still lists every site offline.",
        }),
      ),
    ),
  );

  const map = document.createElement("rowan-maplibre-map");
  map.label = "Lumen facilities";
  map.description = "Schematic coverage. Markers are sample coordinates, not a live feed.";
  map.locations = ctx.store.locations;
  map.layers = ctx.store.layers;
  map.attribution = { label: "Lumen sample coordinates. No external tiles." };
  map.mapStyle = LOCAL_STYLE;

  const drawer = h("rowan-drawer", { side: "end" });
  const title = h("span", { slot: "title", text: "Facility" });
  const body = h("div", { class: "stack tight" });
  drawer.append(title, body);

  page.append(
    map,
    h("p", {
      class: "map-note quiet",
      text: "Turn a layer off to hide those records in the list and on the map. Activate a marker, list row, or table action for the site note.",
    }),
    drawer,
  );
  outlet.append(page);

  map.addEventListener("rowan-location-activate", (event) => {
    const location = event.detail?.location;
    if (!location) return;
    title.textContent = location.label;
    body.replaceChildren(
      h("p", { text: location.description || "No note." }),
      h("p", {
        class: "quiet",
        text: `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      }),
    );
    drawer.open = true;
  });
}
