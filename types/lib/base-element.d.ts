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
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    get internals(): any;
    get renderRoot(): any;
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
