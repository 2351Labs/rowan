import { define } from "../lib/define.js";
import {
  cloneMapAttribution,
  cloneMapLayers,
  cloneMapLocations,
  cloneMapStyle,
  normalizeMapAttribution,
  normalizeMapLayers,
  normalizeMapLocations,
} from "./model.js";

let mapId = 0;

function normalizeText(value) {
  return String(value ?? "").trim();
}

function formatCoordinate(value) {
  return Number(value).toFixed(5);
}

function createCell(tagName, text, scope = "") {
  const cell = document.createElement(tagName);
  if (scope) cell.scope = scope;
  cell.textContent = text;
  return cell;
}

function eventLocation(location) {
  return { ...location };
}

/**
 * Optional MapLibre map with application-owned styles and accessible location alternatives.
 * @tag rowan-maplibre-map
 * @attr {string} label
 * @attr {string} description
 * @property {Array<import("./model.js").RowanMapLocation>} locations - Property-only coordinate records.
 * @property {Array<import("./model.js").RowanMapLayer>} layers - Property-only marker layer metadata.
 * @property {string | Record<string, unknown> | null} mapStyle - Application-owned MapLibre style. This property is never reflected to an attribute.
 * @property {import("./model.js").RowanMapAttributionInput} attribution - Application-owned provider attribution. This property is never reflected to an attribute.
 * @property {object | null} maplibre - Optional MapLibre module injection for controlled loading and tests.
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart map
 * @csspart marker
 * @csspart attribution
 * @csspart layers
 * @csspart list
 * @csspart table
 * @cssprop --rowan-maplibre-map-height
 * @cssprop --rowan-maplibre-map-bg
 * @cssprop --rowan-maplibre-map-border
 * @cssprop --rowan-maplibre-map-marker-bg
 * @event rowan-location-activate - Fired when a user activates a map marker, list item, or table action.
 * @event rowan-layer-change - Fired when a user changes a visible marker layer.
 */
export class RowanMapLibreMap extends HTMLElement {
  static observedAttributes = ["label", "description"];

  #internals = null;
  #root = null;
  #labelElement = null;
  #descriptionElement = null;
  #mapCanvas = null;
  #mapStatus = null;
  #attributionElement = null;
  #layersElement = null;
  #listElement = null;
  #tableElement = null;
  #selectionStatus = null;
  #locations = [];
  #layers = [];
  #layerVisibility = new Map();
  #mapStyle = null;
  #attribution = [];
  #maplibre = null;
  #map = null;
  #provider = null;
  #markers = new Map();
  #markerElements = new Map();
  #providerVersion = 0;
  #providerLoading = false;
  #providerState = "fallback";
  #providerMessage = "";
  #activeLocationId = "";
  #renderQueued = false;
  #resizeObserver = null;
  #resizeFrame = 0;
  #lastMapSize = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open", delegatesFocus: true });

    if (typeof this.attachInternals === "function") {
      this.#internals = this.attachInternals();
    }

    for (const property of [
      "label",
      "description",
      "locations",
      "layers",
      "mapStyle",
      "attribution",
      "maplibre",
    ]) {
      this.#upgradeProperty(property);
    }
  }

  connectedCallback() {
    if (!this.id) {
      mapId += 1;
      this.id = `rowan-maplibre-map-${mapId}`;
    }

    this.#observeSize();
    this.#applyDefaultA11y();
    this.#requestRender();
  }

  disconnectedCallback() {
    this.#providerVersion += 1;
    this.#providerLoading = false;
    this.#disposeMap();
    if (this.#resizeFrame) {
      cancelAnimationFrame(this.#resizeFrame);
      this.#resizeFrame = 0;
    }
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "label" || name === "description") this.#applyDefaultA11y();
    this.#requestRender();
  }

  get label() {
    return this.getAttribute("label") ?? "";
  }

  set label(value) {
    const label = normalizeText(value);
    if (label) {
      this.setAttribute("label", label);
    } else {
      this.removeAttribute("label");
    }
  }

  get description() {
    return this.getAttribute("description") ?? "";
  }

  set description(value) {
    const description = normalizeText(value);
    if (description) {
      this.setAttribute("description", description);
    } else {
      this.removeAttribute("description");
    }
  }

  /** @returns {Array<import("./model.js").RowanMapLocation>} */
  get locations() {
    return cloneMapLocations(this.#locations);
  }

  /** @param {Array<import("./model.js").RowanMapLocation>} value */
  set locations(value) {
    this.#locations = normalizeMapLocations(value);
    if (!this.#locations.some((location) => location.id === this.#activeLocationId)) {
      this.#activeLocationId = "";
    }
    this.#requestRender();
  }

  /** @returns {Array<import("./model.js").RowanMapLayer>} */
  get layers() {
    return cloneMapLayers(
      this.#layers.map((layer) => ({
        ...layer,
        visible: this.#layerVisibility.get(layer.id) ?? layer.visible,
      })),
    );
  }

  /** @param {Array<import("./model.js").RowanMapLayer>} value */
  set layers(value) {
    this.#layers = normalizeMapLayers(value);
    this.#layerVisibility = new Map(this.#layers.map((layer) => [layer.id, layer.visible]));
    this.#requestRender();
  }

  /** @returns {string | Record<string, unknown> | null} */
  get mapStyle() {
    return cloneMapStyle(this.#mapStyle);
  }

  /** @param {string | Record<string, unknown> | null} value */
  set mapStyle(value) {
    this.#mapStyle = cloneMapStyle(value);
    this.#restartProvider();
  }

  /** @returns {Array<import("./model.js").RowanMapAttribution>} */
  get attribution() {
    return cloneMapAttribution(this.#attribution);
  }

  /** @param {import("./model.js").RowanMapAttributionInput} value */
  set attribution(value) {
    this.#attribution = normalizeMapAttribution(value);
    this.#restartProvider();
  }

  /** @returns {object | null} */
  get maplibre() {
    return this.#maplibre;
  }

  /** @param {object | null} value */
  set maplibre(value) {
    this.#maplibre = value && typeof value === "object" ? value : null;
    this.#restartProvider();
  }

  #upgradeProperty(name) {
    if (!Object.prototype.hasOwnProperty.call(this, name)) return;

    const value = this[name];
    delete this[name];
    this[name] = value;
  }

  #requestRender() {
    if (this.#renderQueued) return;

    this.#renderQueued = true;
    queueMicrotask(() => {
      this.#renderQueued = false;
      if (!this.isConnected) return;
      this.#render();
    });
  }

  #render() {
    this.#ensureRoot();
    this.#syncHeading();
    this.#syncAttribution();
    this.#syncLayers();
    this.#syncLocations();
    this.#syncActiveLocation();
    this.#syncProvider();
    this.#syncProviderStatus();
    this.#applyDefaultA11y();
  }

  #ensureRoot() {
    if (this.#root) return;

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL("./map.css", import.meta.url).href;

    const root = document.createElement("div");
    root.className = "control";
    root.setAttribute("part", "control");

    const heading = document.createElement("div");
    heading.className = "heading";
    const label = document.createElement("strong");
    label.className = "label";
    label.setAttribute("part", "label");
    const description = document.createElement("p");
    description.className = "description";
    description.setAttribute("part", "description");
    heading.append(label, description);

    const mapFrame = document.createElement("section");
    mapFrame.className = "map-frame";
    const mapCanvas = document.createElement("div");
    mapCanvas.className = "map-canvas";
    mapCanvas.setAttribute("part", "map");
    const mapStatus = document.createElement("p");
    mapStatus.className = "map-status";
    mapStatus.setAttribute("role", "status");
    mapFrame.append(mapCanvas, mapStatus);

    const attribution = document.createElement("p");
    attribution.className = "attribution";
    attribution.setAttribute("part", "attribution");

    const layers = document.createElement("fieldset");
    layers.className = "layers";
    layers.setAttribute("part", "layers");

    const alternatives = document.createElement("section");
    alternatives.className = "alternatives";
    alternatives.setAttribute("aria-label", "Location alternatives");

    const listSection = document.createElement("section");
    listSection.className = "fallback-section";
    const listTitle = document.createElement("h2");
    listTitle.textContent = "Location list";
    const list = document.createElement("ul");
    list.className = "location-list";
    list.setAttribute("part", "list");
    listSection.append(listTitle, list);

    const tableSection = document.createElement("section");
    tableSection.className = "fallback-section";
    const tableTitle = document.createElement("h2");
    tableTitle.textContent = "Location table";
    const tableScroll = document.createElement("div");
    tableScroll.className = "table-scroll";
    const table = document.createElement("table");
    table.setAttribute("part", "table");
    tableScroll.append(table);
    tableSection.append(tableTitle, tableScroll);

    const selectionStatus = document.createElement("output");
    selectionStatus.className = "selection-status";
    selectionStatus.setAttribute("aria-live", "polite");

    alternatives.append(listSection, tableSection);
    root.append(heading, mapFrame, attribution, layers, alternatives, selectionStatus);
    this.shadowRoot.append(stylesheet, root);

    this.#root = root;
    this.#labelElement = label;
    this.#descriptionElement = description;
    this.#mapCanvas = mapCanvas;
    this.#mapStatus = mapStatus;
    this.#attributionElement = attribution;
    this.#layersElement = layers;
    this.#listElement = list;
    this.#tableElement = table;
    this.#selectionStatus = selectionStatus;

    this.#listElement.addEventListener("click", (event) =>
      this.#handleLocationAction(event, "list"),
    );
    this.#tableElement.addEventListener("click", (event) =>
      this.#handleLocationAction(event, "table"),
    );
    this.#layersElement.addEventListener("change", (event) => this.#handleLayerChange(event));
  }

  #syncHeading() {
    this.#labelElement.textContent = this.label;
    this.#labelElement.hidden = !this.label;
    this.#descriptionElement.textContent = this.description;
    this.#descriptionElement.hidden = !this.description;
    this.#mapCanvas.setAttribute("role", "group");
    this.#mapCanvas.setAttribute("aria-label", `${this.label || "Map"} map view`);
  }

  #syncAttribution() {
    const fragment = document.createDocumentFragment();
    this.#attributionElement.hidden = this.#attribution.length === 0;

    this.#attribution.forEach((item, index) => {
      if (index > 0) fragment.append(document.createTextNode(", "));

      if (item.href) {
        const link = document.createElement("a");
        link.href = item.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = item.label;
        fragment.append(link);
      } else {
        fragment.append(document.createTextNode(item.label));
      }
    });

    this.#attributionElement.replaceChildren(fragment);
  }

  #syncLayers() {
    this.#layersElement.hidden = this.#layers.length === 0;
    if (this.#layersElement.hidden) return;

    const legend = document.createElement("legend");
    legend.textContent = "Visible map layers";
    const fragment = document.createDocumentFragment();
    fragment.append(legend);

    for (const layer of this.#layers) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = this.#isLayerVisible(layer.id);
      input.dataset.layerId = layer.id;

      const swatch = document.createElement("span");
      swatch.className = "layer-swatch";
      swatch.setAttribute("aria-hidden", "true");
      if (layer.color) swatch.style.background = layer.color;

      label.append(input, swatch, document.createTextNode(layer.label));
      fragment.append(label);
    }

    this.#layersElement.replaceChildren(fragment);
  }

  #syncLocations() {
    this.#renderLocationList();
    this.#renderLocationTable();
  }

  #renderLocationList() {
    const fragment = document.createDocumentFragment();
    const locations = this.#visibleLocations();

    if (locations.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No locations are available.";
      fragment.append(empty);
    }

    for (const location of locations) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.locationId = location.id;
      button.setAttribute("aria-label", this.#locationAccessibleName(location));

      const label = document.createElement("strong");
      label.textContent = location.label;
      const coordinates = document.createElement("span");
      coordinates.className = "coordinates";
      coordinates.textContent = this.#locationCoordinates(location);
      button.append(label, coordinates);

      if (location.description) {
        const description = document.createElement("span");
        description.className = "location-description";
        description.textContent = location.description;
        button.append(description);
      }

      item.append(button);
      fragment.append(item);
    }

    this.#listElement.replaceChildren(fragment);
  }

  #renderLocationTable() {
    const fragment = document.createDocumentFragment();
    const caption = document.createElement("caption");
    caption.className = "sr-only";
    caption.textContent = `${this.label || "Map"} location table`;
    fragment.append(caption);

    const head = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.append(
      createCell("th", "Location", "col"),
      createCell("th", "Description", "col"),
      createCell("th", "Coordinates", "col"),
      createCell("th", "Map", "col"),
    );
    head.append(headerRow);
    fragment.append(head);

    const body = document.createElement("tbody");
    const locations = this.#visibleLocations();
    if (locations.length === 0) {
      const row = document.createElement("tr");
      const cell = createCell("td", "No locations are available.");
      cell.colSpan = 4;
      row.append(cell);
      body.append(row);
    }

    for (const location of locations) {
      const row = document.createElement("tr");
      row.dataset.locationId = location.id;
      row.append(
        createCell("th", location.label, "row"),
        createCell("td", location.description || "Not provided"),
        createCell("td", this.#locationCoordinates(location)),
      );

      const actionCell = document.createElement("td");
      const action = document.createElement("button");
      action.type = "button";
      action.dataset.locationId = location.id;
      action.textContent = "Show on map";
      actionCell.append(action);
      row.append(actionCell);
      body.append(row);
    }

    fragment.append(body);
    this.#tableElement.replaceChildren(fragment);
  }

  #syncProvider() {
    if (!this.#canStartProvider()) {
      this.#disposeMap();
      this.#providerLoading = false;
      this.#providerState = "fallback";
      this.#providerMessage = this.#fallbackMessage();
      return;
    }

    if (this.#providerState === "error") return;

    if (this.#map || this.#providerLoading) {
      this.#syncMarkers();
      return;
    }

    const version = ++this.#providerVersion;
    this.#providerLoading = true;
    this.#providerState = "loading";
    this.#providerMessage = "Loading map view.";

    this.#resolveProvider()
      .then((provider) => this.#createMap(provider, version))
      .catch(() => this.#handleProviderFailure(version));
  }

  #canStartProvider() {
    return Boolean(this.#mapStyle) && this.#attribution.length > 0;
  }

  #fallbackMessage() {
    if (!this.#mapStyle) {
      return "Map view unavailable until the application supplies a MapLibre style.";
    }
    if (this.#attribution.length === 0) {
      return "Map view unavailable until the application supplies provider attribution.";
    }
    return "Map view unavailable. The location list and table remain available.";
  }

  #resolveProvider() {
    if (this.#maplibre) return Promise.resolve(this.#maplibre);
    return import("maplibre-gl").then((module) => {
      if (typeof module.Map === "function") return module;
      if (typeof module.default?.Map === "function") return module.default;
      if (typeof globalThis.maplibregl?.Map === "function") return globalThis.maplibregl;
      return module.default ?? module;
    });
  }

  #createMap(provider, version) {
    if (!this.isConnected || version !== this.#providerVersion) return;
    if (!provider || typeof provider.Map !== "function" || typeof provider.Marker !== "function") {
      this.#handleProviderFailure(version);
      return;
    }

    let map;
    try {
      map = new provider.Map({
        container: this.#mapCanvas,
        style: cloneMapStyle(this.#mapStyle),
        attributionControl: false,
      });
    } catch (_error) {
      this.#handleProviderFailure(version);
      return;
    }

    if (version !== this.#providerVersion || !this.isConnected) {
      map.remove?.();
      return;
    }

    this.#map = map;
    this.#provider = provider;

    const markReady = () => {
      if (version !== this.#providerVersion || this.#map !== map) return;
      this.#providerLoading = false;
      this.#providerState = "ready";
      this.#providerMessage = "";
      this.#syncMarkers();
      this.#fitLocations();
      this.#requestRender();
    };
    const fail = () => {
      if (!this.#providerLoading || this.#providerState !== "loading") return;
      this.#handleProviderFailure(version, map);
    };

    map.on?.("error", fail);
    if (typeof map.once === "function") {
      map.once("load", markReady);
    } else if (typeof map.on === "function") {
      map.on("load", markReady);
    } else {
      markReady();
    }
  }

  #handleProviderFailure(version, map = this.#map) {
    if (version !== this.#providerVersion || (map && map !== this.#map)) return;

    this.#providerVersion += 1;
    this.#providerLoading = false;
    this.#disposeMap();
    this.#providerState = "error";
    this.#providerMessage = "Map view unavailable. The location list and table remain available.";
    this.#requestRender();
  }

  #restartProvider() {
    this.#providerVersion += 1;
    this.#providerLoading = false;
    this.#disposeMap();
    this.#providerState = "fallback";
    this.#providerMessage = "";
    this.#requestRender();
  }

  #disposeMap() {
    for (const { marker } of this.#markers.values()) {
      marker.remove?.();
    }
    this.#markers.clear();
    this.#markerElements.clear();

    const map = this.#map;
    this.#map = null;
    this.#provider = null;
    map?.remove?.();
    this.#mapCanvas?.replaceChildren();
  }

  #syncMarkers() {
    if (!this.#map || !this.#provider || this.#providerState === "error") return;

    const locations = this.#visibleLocations();
    const locationIds = new Set(locations.map((location) => location.id));

    for (const [id, { marker }] of this.#markers) {
      if (locationIds.has(id)) continue;
      marker.remove?.();
      this.#markerElements.get(id)?.remove();
      this.#markers.delete(id);
      this.#markerElements.delete(id);
    }

    for (const location of locations) {
      const record = this.#markers.get(location.id);
      const markerElement = this.#markerElements.get(location.id);
      if (record && markerElement) {
        if (record.latitude !== location.latitude || record.longitude !== location.longitude) {
          record.marker.setLngLat([location.longitude, location.latitude]);
          record.latitude = location.latitude;
          record.longitude = location.longitude;
        }
        this.#syncMarkerElement(markerElement, location);
        continue;
      }

      record?.marker.remove?.();
      markerElement?.remove();
      this.#markers.delete(location.id);
      this.#markerElements.delete(location.id);
      this.#createMarker(location);
    }

    this.#syncActiveLocation();
  }

  #createMarker(location) {
    const markerElement = document.createElement("button");
    markerElement.className = "marker";
    markerElement.type = "button";
    markerElement.setAttribute("part", "marker");
    this.#syncMarkerElement(markerElement, location);

    const locationId = location.id;
    markerElement.addEventListener("click", () => {
      const currentLocation = this.#locations.find((item) => item.id === locationId);
      if (currentLocation) this.#activateLocation(currentLocation, "marker");
    });

    try {
      const marker = new this.#provider.Marker({ element: markerElement })
        .setLngLat([location.longitude, location.latitude])
        .addTo(this.#map);
      this.#markers.set(location.id, {
        marker,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      this.#markerElements.set(location.id, markerElement);
    } catch (_error) {
      markerElement.remove();
    }
  }

  #syncMarkerElement(markerElement, location) {
    markerElement.dataset.locationId = location.id;
    markerElement.setAttribute("aria-label", this.#locationAccessibleName(location));

    const layer = this.#layers.find((item) => item.id === location.layerId);
    if (layer?.color) {
      markerElement.style.setProperty("--marker-color", layer.color);
    } else {
      markerElement.style.removeProperty("--marker-color");
    }
  }

  #fitLocations() {
    if (!this.#map || this.#locations.length === 0 || typeof this.#map.fitBounds !== "function")
      return;

    const coordinates = this.#visibleLocations().map((location) => [
      location.longitude,
      location.latitude,
    ]);
    if (coordinates.length === 0) return;

    if (coordinates.length === 1) {
      this.#map.flyTo?.({ center: coordinates[0], zoom: 12, essential: true });
      return;
    }

    const longitudes = coordinates.map(([longitude]) => longitude);
    const latitudes = coordinates.map(([, latitude]) => latitude);
    this.#map.fitBounds(
      [
        [Math.min(...longitudes), Math.min(...latitudes)],
        [Math.max(...longitudes), Math.max(...latitudes)],
      ],
      { padding: 48, maxZoom: 12 },
    );
  }

  #syncProviderStatus() {
    this.#mapCanvas.hidden = this.#providerState === "fallback" || this.#providerState === "error";
    this.#mapStatus.textContent = this.#providerMessage;
    this.#mapStatus.hidden = !this.#providerMessage;
  }

  #handleLocationAction(event, source) {
    const button = event
      .composedPath()
      .find((node) => node instanceof HTMLButtonElement && node.dataset.locationId);
    if (!button) return;

    const location = this.#locations.find((item) => item.id === button.dataset.locationId);
    if (location) this.#activateLocation(location, source);
  }

  #handleLayerChange(event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.dataset.layerId) return;

    const layer = this.#layers.find((item) => item.id === input.dataset.layerId);
    if (!layer) return;

    this.#layerVisibility.set(layer.id, input.checked);
    this.#syncLocations();
    this.#syncMarkers();
    this.dispatchEvent(
      new CustomEvent("rowan-layer-change", {
        bubbles: true,
        composed: true,
        detail: { id: layer.id, visible: input.checked },
      }),
    );
  }

  #activateLocation(location, source) {
    this.#activeLocationId = location.id;
    this.#map?.flyTo?.({
      center: [location.longitude, location.latitude],
      zoom: 12,
      essential: true,
    });
    if (source !== "marker") {
      this.#markerElements.get(location.id)?.focus({ preventScroll: true });
    }

    this.#syncActiveLocation();
    this.dispatchEvent(
      new CustomEvent("rowan-location-activate", {
        bubbles: true,
        composed: true,
        detail: {
          id: location.id,
          location: eventLocation(location),
          source,
        },
      }),
    );
  }

  #syncActiveLocation() {
    for (const button of this.#listElement?.querySelectorAll("button[data-location-id]") ?? []) {
      button.toggleAttribute("data-active", button.dataset.locationId === this.#activeLocationId);
    }
    for (const row of this.#tableElement?.querySelectorAll("tr[data-location-id]") ?? []) {
      row.toggleAttribute("data-active", row.dataset.locationId === this.#activeLocationId);
    }
    for (const [id, marker] of this.#markerElements) {
      marker.toggleAttribute("data-active", id === this.#activeLocationId);
    }

    const active = this.#locations.find((location) => location.id === this.#activeLocationId);
    this.#selectionStatus.textContent = active ? `${active.label} selected.` : "";
  }

  #visibleLocations() {
    return this.#locations.filter(
      (location) => !location.layerId || this.#isLayerVisible(location.layerId),
    );
  }

  #isLayerVisible(id) {
    const layer = this.#layers.find((item) => item.id === id);
    return !layer || (this.#layerVisibility.get(id) ?? layer.visible);
  }

  #locationCoordinates(location) {
    return `${formatCoordinate(location.latitude)}, ${formatCoordinate(location.longitude)}`;
  }

  #locationAccessibleName(location) {
    const description = location.description ? `, ${location.description}` : "";
    return `${location.label}${description}, latitude ${formatCoordinate(location.latitude)}, longitude ${formatCoordinate(location.longitude)}`;
  }

  #observeSize() {
    if (this.#resizeObserver || typeof ResizeObserver === "undefined") return;

    this.#resizeObserver = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) return;

      const next = `${Math.round(box.width)}x${Math.round(box.height)}`;
      if (next === this.#lastMapSize) return;
      this.#lastMapSize = next;

      if (this.#resizeFrame) cancelAnimationFrame(this.#resizeFrame);
      this.#resizeFrame = requestAnimationFrame(() => {
        this.#resizeFrame = 0;
        this.#map?.resize?.();
      });
    });
    this.#resizeObserver.observe(this);
  }

  #applyDefaultA11y() {
    if (!this.#internals) return;

    if (!this.hasAttribute("role") && "role" in this.#internals) {
      this.#internals.role = "group";
    }
    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.#internals) {
      this.#internals.ariaLabel = this.label || "Map";
    }
    if (!this.hasAttribute("aria-description") && "ariaDescription" in this.#internals) {
      this.#internals.ariaDescription = this.description || null;
    }
  }
}

define("rowan-maplibre-map", RowanMapLibreMap);
