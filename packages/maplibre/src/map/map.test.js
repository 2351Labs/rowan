import { expect } from "@esm-bundle/chai";
import "./map.js";

const nextMicrotask = () => Promise.resolve();

const MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [{ id: "background", type: "background", paint: { "background-color": "#eef3ea" } }],
};

const LOCATIONS = [
  {
    id: "dispatch-17",
    label: "Generator inspection",
    latitude: 47.6062,
    longitude: -122.3321,
    description: "Priority inspection",
    layerId: "scheduled",
    status: "assigned",
  },
  {
    id: "dispatch-18",
    label: "Signal check",
    latitude: 47.6097,
    longitude: -122.3331,
    layerId: "scheduled",
  },
];

async function settle() {
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
  await nextMicrotask();
}

async function renderMap(options = {}) {
  const map = document.createElement("rowan-maplibre-map");
  map.label = "Dispatch coverage";
  map.description = "Scheduled field work by coordinate.";
  map.locations = options.locations ?? LOCATIONS;
  map.layers = options.layers ?? [{ id: "scheduled", label: "Scheduled", color: "#24543c" }];
  map.attribution = options.attribution ?? {
    label: "Open source tiles",
    href: "https://tiles.example.test/terms",
  };
  if (options.mapStyle) map.mapStyle = options.mapStyle;
  if (options.maplibre) map.maplibre = options.maplibre;
  document.body.append(map);
  await settle();
  return map;
}

class FakeMap {
  static instances = [];

  constructor(options) {
    this.options = options;
    this.listeners = new Map();
    this.flyToCalls = [];
    this.fitBoundsCalls = [];
    this.removed = false;
    FakeMap.instances.push(this);
  }

  on(type, handler) {
    this.listeners.set(type, handler);
  }

  once(type, handler) {
    this.listeners.set(type, handler);
    if (type === "load") queueMicrotask(handler);
  }

  flyTo(options) {
    this.flyToCalls.push(options);
  }

  fitBounds(bounds, options) {
    this.fitBoundsCall = { bounds, options };
    this.fitBoundsCalls.push(this.fitBoundsCall);
  }

  resize() {}

  remove() {
    this.removed = true;
  }
}

class FakeMarker {
  static instances = [];

  constructor({ element }) {
    this.element = element;
    this.removed = false;
    this.setLngLatCalls = [];
    FakeMarker.instances.push(this);
  }

  setLngLat(value) {
    this.coordinates = value;
    this.setLngLatCalls.push(value);
    return this;
  }

  addTo(map) {
    this.map = map;
    map.options.container.append(this.element);
    return this;
  }

  remove() {
    this.removed = true;
    this.element.remove();
  }
}

describe("rowan-maplibre-map", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    FakeMap.instances = [];
    FakeMarker.instances = [];
  });

  it("keeps location and layer data property-only while rendering matching list and table fallbacks", async () => {
    const source = [
      ...LOCATIONS.map((location) => ({ ...location })),
      { id: "invalid", label: "Invalid", latitude: 99, longitude: 0 },
    ];
    const map = await renderMap({ locations: source });
    source[0].label = "Changed after assignment";

    expect(map.hasAttribute("locations")).to.equal(false);
    expect(map.hasAttribute("layers")).to.equal(false);
    expect(map.shadowRoot.querySelector("[part='map']").getAttribute("role")).to.equal("group");
    expect(map.shadowRoot.querySelector("[part='map']").getAttribute("aria-label")).to.equal(
      "Dispatch coverage map view",
    );
    expect(map.locations).to.deep.equal(
      LOCATIONS.map((location) => ({
        ...location,
        description: location.description ?? "",
        status: location.status ?? "",
      })),
    );
    expect(map.shadowRoot.querySelector("[part='list']").textContent).to.include(
      "Generator inspection",
    );
    expect(map.shadowRoot.querySelector("[part='table']").textContent).to.include("Signal check");
    expect(map.shadowRoot.querySelector(".map-status").textContent).to.include(
      "supplies a MapLibre style",
    );
  });

  it("emits user activation details from both keyboard-operable fallback records without reacting to parent assignments", async () => {
    const map = await renderMap();
    const activations = [];
    map.addEventListener("rowan-location-activate", (event) => activations.push(event));

    map.locations = LOCATIONS;
    await settle();
    expect(activations).to.have.length(0);

    map.shadowRoot.querySelector("[part='list'] button[data-location-id='dispatch-17']").click();
    map.shadowRoot.querySelector("[part='table'] button[data-location-id='dispatch-18']").click();

    expect(activations).to.have.length(2);
    expect(activations[0].detail).to.deep.equal({
      id: "dispatch-17",
      location: {
        ...LOCATIONS[0],
        description: "Priority inspection",
        layerId: "scheduled",
        status: "assigned",
      },
      source: "list",
    });
    expect(activations[1].detail.source).to.equal("table");
    expect(activations[0].bubbles).to.equal(true);
    expect(activations[0].composed).to.equal(true);
  });

  it("preserves safe attribution and emits only user-originated layer changes", async () => {
    const sourceLayers = [{ id: "scheduled", label: "Scheduled", visible: true }];
    const map = await renderMap({
      layers: sourceLayers,
      attribution: [
        { label: "Open source tiles", href: "https://tiles.example.test/terms" },
        { label: "Unsafe", href: "javascript:alert(1)" },
      ],
    });
    const changes = [];
    map.addEventListener("rowan-layer-change", (event) => changes.push(event));

    const links = [...map.shadowRoot.querySelectorAll("[part='attribution'] a")];
    expect(links).to.have.length(1);
    expect(links[0].href).to.equal("https://tiles.example.test/terms");
    expect(map.shadowRoot.querySelector("[part='attribution']").textContent).to.include("Unsafe");

    const checkbox = map.shadowRoot.querySelector("input[data-layer-id='scheduled']");
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    expect(changes).to.have.length(1);
    expect(changes[0].detail).to.deep.equal({ id: "scheduled", visible: false });
    expect(changes[0].bubbles).to.equal(true);
    expect(changes[0].composed).to.equal(true);
    expect(sourceLayers[0].visible).to.equal(true);
    expect(map.shadowRoot.querySelectorAll("[part='list'] button")).to.have.length(0);
  });

  it("uses an injected MapLibre adapter without mutating application style data and activates markers", async () => {
    const style = structuredClone(MAP_STYLE);
    const map = await renderMap({
      mapStyle: style,
      maplibre: { Map: FakeMap, Marker: FakeMarker },
    });
    const activations = [];
    map.addEventListener("rowan-location-activate", (event) => activations.push(event));

    const instance = FakeMap.instances[0];
    expect(instance.options.style).to.not.equal(style);
    instance.options.style.layers[0].paint["background-color"] = "#000000";
    expect(style.layers[0].paint["background-color"]).to.equal("#eef3ea");
    expect(map.shadowRoot.querySelectorAll("button.marker")).to.have.length(2);

    map.shadowRoot.querySelector("button.marker[data-location-id='dispatch-17']").click();

    expect(activations).to.have.length(1);
    expect(activations[0].detail.source).to.equal("marker");
    expect(instance.flyToCalls.at(-1).center).to.deep.equal([-122.3321, 47.6062]);
  });

  it("reconciles stable markers without resetting the camera for routine updates", async () => {
    const map = await renderMap({
      mapStyle: MAP_STYLE,
      maplibre: { Map: FakeMap, Marker: FakeMarker },
    });
    const instance = FakeMap.instances[0];
    const marker = FakeMarker.instances.find(
      (item) => item.element.dataset.locationId === "dispatch-17",
    );
    const markerElement = map.shadowRoot.querySelector(
      "button.marker[data-location-id='dispatch-17']",
    );
    const fitBoundsCallCount = instance.fitBoundsCalls.length;
    const activations = [];
    map.addEventListener("rowan-location-activate", (event) => activations.push(event));

    map.locations = LOCATIONS.map((location) =>
      location.id === "dispatch-17"
        ? { ...location, label: "Generator inspection complete", latitude: 47.6072 }
        : { ...location },
    );
    await settle();

    expect(FakeMarker.instances).to.have.length(2);
    expect(marker.removed).to.equal(false);
    expect(marker.coordinates).to.deep.equal([-122.3321, 47.6072]);
    expect(marker.setLngLatCalls).to.have.length(2);
    expect(map.shadowRoot.querySelector("button.marker[data-location-id='dispatch-17']")).to.equal(
      markerElement,
    );
    expect(instance.fitBoundsCalls).to.have.length(fitBoundsCallCount);

    markerElement.click();
    expect(activations.at(-1).detail.location.label).to.equal("Generator inspection complete");

    map.label = "Updated dispatch coverage";
    await settle();
    expect(FakeMarker.instances).to.have.length(2);
    expect(marker.setLngLatCalls).to.have.length(2);
    expect(instance.fitBoundsCalls).to.have.length(fitBoundsCallCount);

    const layerInput = map.shadowRoot.querySelector("input[data-layer-id='scheduled']");
    layerInput.checked = false;
    layerInput.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(instance.fitBoundsCalls).to.have.length(fitBoundsCallCount);
  });

  it("keeps a ready map available after a later provider error event", async () => {
    const map = await renderMap({
      mapStyle: MAP_STYLE,
      maplibre: { Map: FakeMap, Marker: FakeMarker },
    });
    const instance = FakeMap.instances[0];
    const errorHandler = instance.listeners.get("error");

    expect(errorHandler).to.be.a("function");
    errorHandler({ error: new Error("A tile request failed") });
    await settle();

    expect(instance.removed).to.equal(false);
    expect(map.shadowRoot.querySelector("[part='map']").hidden).to.equal(false);
    expect(map.shadowRoot.querySelectorAll("button.marker")).to.have.length(2);
  });

  it("holds a failed provider in the accessible fallback state until application configuration changes", async () => {
    const map = await renderMap({ mapStyle: MAP_STYLE, maplibre: {} });
    const status = map.shadowRoot.querySelector(".map-status");

    expect(status.textContent).to.include("location list and table remain available");
    expect(map.shadowRoot.querySelector("[part='map']").hidden).to.equal(true);
    expect(map.shadowRoot.querySelectorAll("[part='list'] button")).to.have.length(2);

    await settle();
    expect(status.textContent).to.include("location list and table remain available");
  });
});
