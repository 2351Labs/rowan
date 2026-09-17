export class BaseElement extends HTMLElement {
	static shadowRootOptions: ShadowRootInit;
	static styles: string | string[];
	static styleUrl: string;
	static observedAttributes: string[];
	static formAssociated: boolean;
	static useElementInternals: boolean;
	static upgradeProperties: string[];
	static componentTokenPrefixes: string[];

	readonly internals: ElementInternals | null;
	readonly renderRoot: HTMLElement;
	readonly form: HTMLFormElement | null;
	readonly labels: NodeListOf<HTMLLabelElement> | null;
	readonly validity: ValidityState | undefined;
	readonly validationMessage: string;
	readonly willValidate: boolean;
	readonly externalLabelText: string;

	connectedCallback(): void;
	disconnectedCallback(): void;
	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
	formDisabledCallback(disabled: boolean): void;
	setCustomValidity(message: string): void;
	applyValidity(flags?: ValidityStateFlags, message?: string, anchor?: HTMLElement): void;
	requestRender(): void;
	render(): void;
	setComponentStyles(cssText: string): void;
	addCleanup(cleanup: () => void): () => void;
	listen(
		target: EventTarget,
		type: string,
		handler: EventListenerOrEventListenerObject,
		options?: AddEventListenerOptions | boolean,
	): () => void;
	observe(observer: { disconnect(): void }, restore?: () => void): () => void;
	reflectBoolean(attributeName: string, value: boolean): void;
	reflectString(attributeName: string, value: string | null | undefined): void;
	reflectNumber(attributeName: string, value: number | null | undefined): void;
	readBoolean(attributeName: string): boolean;
	readString(attributeName: string, fallback?: string): string;
	readNumber(attributeName: string, fallback?: number): number;
}