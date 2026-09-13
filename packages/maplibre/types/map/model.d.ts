/**
 * @typedef {object} RowanMapLocation
 * @property {string} id
 * @property {string} label
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} [description]
 * @property {string} [layerId]
 * @property {string} [status]
 */
/**
 * @typedef {object} RowanMapLayer
 * @property {string} id
 * @property {string} label
 * @property {string} [color]
 * @property {boolean} [visible]
 */
/**
 * @typedef {object} RowanMapAttribution
 * @property {string} label
 * @property {string} [href]
 */
/**
 * @typedef {RowanMapAttribution | Array<RowanMapAttribution | string> | string | null | undefined} RowanMapAttributionInput
 */
/**
 * @typedef {object} RowanNormalizedMapLocation
 * @property {string} id
 * @property {string} label
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} description
 * @property {string} layerId
 * @property {string} status
 */
/**
 * @typedef {object} RowanNormalizedMapLayer
 * @property {string} id
 * @property {string} label
 * @property {string} color
 * @property {boolean} visible
 */
/**
 * @typedef {object} RowanNormalizedMapAttribution
 * @property {string} label
 * @property {string} href
 */
/**
 * Normalizes a property-only location collection and omits invalid coordinates.
 * @param {unknown} value
 * @returns {RowanNormalizedMapLocation[]}
 */
export function normalizeMapLocations(value: unknown): RowanNormalizedMapLocation[];
/**
 * Normalizes optional marker layer metadata without interpreting source or tile data.
 * @param {unknown} value
 * @returns {RowanNormalizedMapLayer[]}
 */
export function normalizeMapLayers(value: unknown): RowanNormalizedMapLayer[];
/**
 * Normalizes attribution into text and safe HTTP(S) links for map and fallback views.
 * @param {RowanMapAttributionInput} value
 * @returns {RowanNormalizedMapAttribution[]}
 */
export function normalizeMapAttribution(value: RowanMapAttributionInput): RowanNormalizedMapAttribution[];
/**
 * Takes a detached snapshot of an application-owned MapLibre style.
 * @param {unknown} value
 * @returns {string | Record<string, unknown> | null}
 */
export function cloneMapStyle(value: unknown): string | Record<string, unknown> | null;
/**
 * @param {RowanNormalizedMapLocation[]} locations
 * @returns {RowanNormalizedMapLocation[]}
 */
export function cloneMapLocations(locations: RowanNormalizedMapLocation[]): RowanNormalizedMapLocation[];
/**
 * @param {RowanNormalizedMapLayer[]} layers
 * @returns {RowanNormalizedMapLayer[]}
 */
export function cloneMapLayers(layers: RowanNormalizedMapLayer[]): RowanNormalizedMapLayer[];
/**
 * @param {RowanNormalizedMapAttribution[]} attribution
 * @returns {RowanNormalizedMapAttribution[]}
 */
export function cloneMapAttribution(attribution: RowanNormalizedMapAttribution[]): RowanNormalizedMapAttribution[];
export type RowanMapLocation = {
    id: string;
    label: string;
    latitude: number;
    longitude: number;
    description?: string | undefined;
    layerId?: string | undefined;
    status?: string | undefined;
};
export type RowanMapLayer = {
    id: string;
    label: string;
    color?: string | undefined;
    visible?: boolean | undefined;
};
export type RowanMapAttribution = {
    label: string;
    href?: string | undefined;
};
export type RowanMapAttributionInput = RowanMapAttribution | Array<RowanMapAttribution | string> | string | null | undefined;
export type RowanNormalizedMapLocation = {
    id: string;
    label: string;
    latitude: number;
    longitude: number;
    description: string;
    layerId: string;
    status: string;
};
export type RowanNormalizedMapLayer = {
    id: string;
    label: string;
    color: string;
    visible: boolean;
};
export type RowanNormalizedMapAttribution = {
    label: string;
    href: string;
};
