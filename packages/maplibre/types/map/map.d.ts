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
    static observedAttributes: string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set label(value: string);
    get label(): string;
    set description(value: string);
    get description(): string;
    /** @param {Array<import("./model.js").RowanMapLocation>} value */
    set locations(value: import("./model.js").RowanMapLocation[]);
    /** @returns {Array<import("./model.js").RowanMapLocation>} */
    get locations(): import("./model.js").RowanMapLocation[];
    /** @param {Array<import("./model.js").RowanMapLayer>} value */
    set layers(value: import("./model.js").RowanMapLayer[]);
    /** @returns {Array<import("./model.js").RowanMapLayer>} */
    get layers(): import("./model.js").RowanMapLayer[];
    /** @param {string | Record<string, unknown> | null} value */
    set mapStyle(value: string | Record<string, unknown> | null);
    /** @returns {string | Record<string, unknown> | null} */
    get mapStyle(): string | Record<string, unknown> | null;
    /** @param {import("./model.js").RowanMapAttributionInput} value */
    set attribution(value: import("./model.js").RowanMapAttribution[]);
    /** @returns {Array<import("./model.js").RowanMapAttribution>} */
    get attribution(): import("./model.js").RowanMapAttribution[];
    /** @param {object | null} value */
    set maplibre(value: any);
    /** @returns {object | null} */
    get maplibre(): any;
    #private;
}
