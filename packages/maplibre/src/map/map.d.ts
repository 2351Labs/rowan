import "../elements.js";

import type {
  RowanMapAttribution,
  RowanMapAttributionInput,
  RowanMapLayer,
  RowanMapLocation,
} from "../../types/map/model.js";

export declare class RowanMapLibreMap extends HTMLElement {
	static observedAttributes: string[];

	label: string;
	description: string;
	locations: RowanMapLocation[];
	layers: RowanMapLayer[];
	mapStyle: string | Record<string, unknown> | null;
	maplibre: object | null;

	get attribution(): RowanMapAttribution[];
	set attribution(value: RowanMapAttributionInput);
}
