/**
 * Binds React state and native event listeners to a Rowan custom-element ref.
 * This hook does not register Rowan elements; import registration modules from
 * client-only React effects or another browser-only application boundary.
 *
 * @param {{ current: HTMLElement | null }} ref
 * @param {{ properties?: Record<string, unknown>, events?: Record<string, EventListener | undefined> }} [options]
 */
export function useRowanElement(ref: {
    current: HTMLElement | null;
}, options?: {
    properties?: Record<string, unknown>;
    events?: Record<string, EventListener | undefined>;
}): void;
