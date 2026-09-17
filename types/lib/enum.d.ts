/**
 * Canonicalize a documented string union.
 * @param {unknown} value
 * @param {ReadonlySet<string>} allowed
 * @param {string} fallback
 */
export function normalizeEnum(value: unknown, allowed: ReadonlySet<string>, fallback: string): string;
/**
 * Reflect a canonical enum, omitting the documented default.
 * @param {{ reflectString: (name: string, value: string | null) => void }} element
 * @param {string} attribute
 * @param {unknown} value
 * @param {ReadonlySet<string>} allowed
 * @param {string} fallback
 */
export function reflectEnum(element: {
    reflectString: (name: string, value: string | null) => void;
}, attribute: string, value: unknown, allowed: ReadonlySet<string>, fallback: string): string;
/**
 * Rewrite an observed enum attribute to its canonical form.
 * @param {{ reflectString: (name: string, value: string | null) => void }} element
 * @param {string} name
 * @param {string | null} newValue
 * @param {ReadonlySet<string>} allowed
 * @param {string} fallback
 * @returns {boolean} whether the attribute was rewritten
 */
export function rewriteEnumAttribute(element: {
    reflectString: (name: string, value: string | null) => void;
}, name: string, newValue: string | null, allowed: ReadonlySet<string>, fallback: string): boolean;
