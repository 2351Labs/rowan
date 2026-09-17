export function isFalseBooleanAttributeValue(value: any): boolean;
export function readBooleanAttribute(element: any, attributeName: any): boolean;
export function reflectBooleanAttribute(element: any, attributeName: any, value: any): void;
export function readStringAttribute(element: any, attributeName: any, fallback?: string): any;
/**
 * Reflects a string to an attribute. An empty string removes the attribute, so
 * "explicitly empty" and "absent" are the same state; every Rowan getter defaults
 * to `""`, so the property round-trips. Pass `value || null` when a call site
 * wants that collapse to be explicit.
 */
export function reflectStringAttribute(element: any, attributeName: any, value: any): void;
export function readNumberAttribute(element: any, attributeName: any, fallback?: number): number;
export function reflectNumberAttribute(element: any, attributeName: any, value: any): void;
export const BOOLEAN_ATTRIBUTES: Set<string>;
