/**
 * @param {{ tagName: string, events?: Record<string, string>, displayName?: string }} options
 */
export function createRowanComponent(options: {
    tagName: string;
    events?: Record<string, string>;
    displayName?: string;
}): import("react").ForwardRefExoticComponent<import("react").RefAttributes<any>>;
