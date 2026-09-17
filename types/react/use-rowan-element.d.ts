/**
 * Binds React state and native event listeners to a Rowan custom-element ref.
 * This hook does not register Rowan elements; import registration modules from
 * client-only React effects or another browser-only application boundary.
 *
 * Properties are assigned only when their value changes, so the object and array
 * APIs Rowan exposes as property-only keep their identity across renders.
 * Listeners bind once per event type and dispatch to the latest handler.
 * If the host is missing on the first effect, listeners attach when it mounts.
 *
 * @param {{ current: HTMLElement | null }} ref
 * @param {{ properties?: Record<string, unknown>, events?: Record<string, EventListener | undefined> }} [options]
 */
export function useRowanElement(ref: {
    current: HTMLElement | null;
}, options?: {
    properties?: Record<string, unknown> | undefined;
    events?: Record<string, EventListener | undefined> | undefined;
} | undefined): void;
