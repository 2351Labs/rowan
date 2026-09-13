/**
 * Creates an SVG icon from a static icon definition.
 *
 * Icons are decorative by default. Pass `label` only when the icon itself
 * communicates information not already supplied by nearby text or control labels.
 *
 * @param {IconDefinition} definition
 * @param {IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function createIcon(definition: IconDefinition, options?: IconOptions | undefined): SVGSVGElement;
export type IconNode = [tagName: string, attributes: Record<string, string>, children?: [tagName: string, attributes: Record<string, string>, children?: IconNode[] | undefined][]];
export type IconDefinition = {
    name: string;
    nodes: IconNode[];
};
export type IconOptions = {
    className?: string | undefined;
    label?: string | undefined;
    size?: string | number | undefined;
    strokeWidth?: string | number | undefined;
};
