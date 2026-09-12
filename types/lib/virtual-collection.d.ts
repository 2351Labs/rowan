/**
 * Keyed variable-size collection layout shared by collection views.
 *
 * This intentionally owns no DOM. Views provide their own semantic markup
 * while sharing stable keys, measured sizes, and visible-window calculation.
 */
export class VirtualCollection {
    set items(value: any[]);
    get items(): any[];
    set itemKey(value: any);
    get itemKey(): any;
    set estimatedItemSize(value: number);
    get estimatedItemSize(): number;
    get entries(): any[];
    get totalSize(): number;
    get duplicateKeys(): any[];
    setMeasuredSize(key: any, value: any): boolean;
    clearMeasurements(): void;
    range(scrollOffset: any, viewportSize: any, overscan?: number): {
        start: number;
        end: number;
        entries: any[];
        totalSize: number;
    };
    entryAt(index: any): any;
    #private;
}
