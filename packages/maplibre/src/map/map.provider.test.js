import { expect } from "@esm-bundle/chai";
import "./map.js";

const MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [{ id: "background", type: "background", paint: { "background-color": "#eef3ea" } }],
};

function waitUntil(predicate, timeout = 8000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const poll = () => {
      if (predicate()) {
        resolve();
        return;
      }
      if (Date.now() - started > timeout) {
        reject(new Error("timed out waiting for MapLibre provider"));
        return;
      }
      setTimeout(poll, 50);
    };
    poll();
  });
}

function readProvider(module) {
  if (typeof module.Map === "function") return module;
  if (typeof module.default?.Map === "function") return module.default;
  if (typeof globalThis.maplibregl?.Map === "function") return globalThis.maplibregl;
  return module.default ?? module;
}

describe("rowan-maplibre-map real provider", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("creates a map from the real maplibre-gl module and a local style", async () => {
    const href = new URL(
      "../../../../node_modules/maplibre-gl/dist/maplibre-gl.js",
      import.meta.url,
    ).href;
    const response = await fetch(href);
    expect(response.ok, `${href} status ${response.status}`).to.equal(true);

    const module = await import(href);
    const provider = readProvider(module);
    expect(typeof provider.Map).to.equal("function");
    expect(typeof provider.Marker).to.equal("function");

    const map = document.createElement("rowan-maplibre-map");
    map.label = "Provider check";
    map.style.width = "24rem";
    map.style.setProperty("--rowan-maplibre-map-height", "12rem");
    map.attribution = { label: "Test attribution" };
    map.maplibre = provider;
    map.mapStyle = MAP_STYLE;
    map.locations = [
      {
        id: "dispatch-17",
        label: "Generator inspection",
        latitude: 47.6062,
        longitude: -122.3321,
      },
    ];
    document.body.append(map);

    await waitUntil(() => {
      const frame = map.shadowRoot?.querySelector("[part='map']");
      const status = map.shadowRoot?.querySelector(".map-status");
      if (!frame || !status) return false;
      return !frame.hidden || /unavailable/i.test(status.textContent ?? "");
    });

    expect(map.shadowRoot.querySelector("[part='list']").textContent).to.include(
      "Generator inspection",
    );
    const frame = map.shadowRoot.querySelector("[part='map']");
    const status = map.shadowRoot.querySelector(".map-status");
    expect(!frame.hidden || /unavailable/i.test(status.textContent)).to.equal(true);
  });
});
