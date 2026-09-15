import { expect } from "@esm-bundle/chai";
import {
  cloneMapAttribution,
  cloneMapLayers,
  cloneMapLocations,
  normalizeMapAttribution,
  normalizeMapLayers,
  normalizeMapLocations,
} from "./model.js";

describe("rowan-map model", () => {
  it("normalizes property-only locations without retaining caller mutations", () => {
    const source = [
      { id: "dispatch-1", label: "North route", latitude: 37.78, longitude: -122.42 },
      { id: "dispatch-1", label: "South route", latitude: 37.76, longitude: -122.4 },
      { id: "outside", label: "Outside", latitude: 91, longitude: 0 },
    ];

    const locations = normalizeMapLocations(source);
    source[0].label = "Changed after assignment";

    expect(locations).to.deep.equal([
      {
        id: "dispatch-1",
        label: "North route",
        latitude: 37.78,
        longitude: -122.42,
        description: "",
        layerId: "",
        status: "",
      },
      {
        id: "dispatch-1-2",
        label: "South route",
        latitude: 37.76,
        longitude: -122.4,
        description: "",
        layerId: "",
        status: "",
      },
    ]);
    expect(cloneMapLocations(locations)).to.not.equal(locations);
  });

  it("normalizes marker layer colors and safe attribution links", () => {
    const layers = normalizeMapLayers([
      { id: "active", label: "Active routes", color: "var(--rowan-color-accent)" },
      { id: "unsafe", label: "Unsafe", color: "url(javascript:alert(1))" },
    ]);
    const attribution = normalizeMapAttribution([
      { label: "Open source tiles", href: "https://tiles.example.test/terms" },
      { label: "Unsafe", href: "java\nscript:void(globalThis.__rowanMapProbe = true)" },
    ]);

    expect(layers).to.deep.equal([
      {
        id: "active",
        label: "Active routes",
        color: "var(--rowan-color-accent)",
        visible: true,
      },
      { id: "unsafe", label: "Unsafe", color: "", visible: true },
    ]);
    expect(attribution).to.deep.equal([
      { label: "Open source tiles", href: "https://tiles.example.test/terms" },
      { label: "Unsafe", href: "" },
    ]);
    expect(cloneMapLayers(layers)).to.not.equal(layers);
    expect(cloneMapAttribution(attribution)).to.not.equal(attribution);
  });
});
