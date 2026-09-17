export class BaseElement extends HTMLElement {
    static shadowRootOptions: {
        mode: string;
    };
    static styles: string;
    static styleUrl: string;
    static observedAttributes: any[];
    static formAssociated: boolean;
    static useElementInternals: boolean;
    static upgradeProperties: any[];
    static componentTokenPrefixes: any[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    setAttribute(name: any, value: any): void;
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    formDisabledCallback(disabled: any): void;
    get internals(): null;
    get renderRoot(): null;
    get form(): any;
    get labels(): any;
    get validity(): any;
    get validationMessage(): any;
    get willValidate(): any;
    /** Text of any `<label for>` bound to the host. `label`/`for` cannot cross a shadow boundary. */
    get externalLabelText(): string;
    setCustomValidity(message: any): void;
    /** Applies validity with the consumer's custom error merged in, so renders cannot erase it. */
    applyValidity(flags?: {}, message?: string, anchor?: undefined): void;
    requestRender(): void;
    render(): void;
    setComponentStyles(cssText: any): void;
    addCleanup(cleanup: any): () => boolean;
    listen(target: any, type: any, handler: any, options: any): () => void;
    observe(observer: any, restore: any): () => void;
    reflectBoolean(attributeName: any, value: any): void;
    reflectString(attributeName: any, value: any): void;
    reflectNumber(attributeName: any, value: any): void;
    readBoolean(attributeName: any): any;
    readString(attributeName: any, fallback?: string): any;
    readNumber(attributeName: any, fallback?: number): any;
    #private;
}
