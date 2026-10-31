/**
 * Prefix spreadsheet formulas so a text export cannot run as a formula.
 * Finite numbers, including negatives, are left alone.
 * @param {unknown} value
 * @param {boolean} enabled
 */
export function guardFormula(value: unknown, enabled: boolean): string;
/**
 * @param {string[]} header
 * @param {string[][]} rows
 * @param {boolean} includeHeaders
 */
export function buildCsv(header: string[], rows: string[][], includeHeaders: boolean): string;
/**
 * @param {string[]} header
 * @param {string[][]} rows
 * @param {boolean} includeHeaders
 */
export function buildTsv(header: string[], rows: string[][], includeHeaders: boolean): string;
/**
 * @param {string[]} header
 * @param {string[][]} rows
 * @param {boolean} includeHeaders
 */
export function buildHtml(header: string[], rows: string[][], includeHeaders: boolean): string;
/**
 * @param {string[]} header
 * @param {object[][]} rows
 * @param {{ includeHeaders: boolean, formatValues: boolean }} options
 */
export function buildXlsx(
  header: string[],
  rows: object[][],
  options: {
    includeHeaders: boolean;
    formatValues: boolean;
  },
): Uint8Array;
/**
 * Read stored (uncompressed) ZIP members. Used by tests and by callers that want the worksheet XML.
 * @param {Uint8Array} bytes
 */
export function readStoredZip(bytes: Uint8Array): Map<any, any>;
/**
 * @param {{ grid: Function, emit: Function, announce: Function, message: Function }} host
 * @param {object} [options]
 */
export function copyTable(
  host: {
    grid: Function;
    emit: Function;
    announce: Function;
    message: Function;
  },
  options?: object,
): Promise<
  | {
      copied: boolean;
      prevented: boolean;
      text: string;
      html: string;
      header: any;
      rows: any;
      columns: any;
      includeHeaders: any;
      scope: any;
    }
  | {
      copied: boolean;
      text: string;
      html: string;
      header: any;
      rows: any;
      columns: any;
      includeHeaders: any;
      scope: any;
    }
  | {
      copied: boolean;
      error: any;
      text: string;
      html: string;
      header: any;
      rows: any;
      columns: any;
      includeHeaders: any;
      scope: any;
    }
>;
/**
 * @param {{ grid: Function, emit: Function, announce: Function, message: Function }} host
 * @param {object} [options]
 */
export function exportCsv(
  host: {
    grid: Function;
    emit: Function;
    announce: Function;
    message: Function;
  },
  options?: object,
): Promise<
  | {
      exported: boolean;
      format: "csv" | "xlsx";
      error?: undefined;
    }
  | {
      exported: boolean;
      prevented: boolean;
      format: "csv" | "xlsx";
      filename: any;
      scope: any;
      includeHeaders: any;
      columns: any;
      header: any;
      rows: any;
      cells: any;
      truncated: any;
      error?: undefined;
    }
  | {
      csv: string;
      blob: Blob;
      exported: boolean;
      format: "csv" | "xlsx";
      filename: any;
      scope: any;
      includeHeaders: any;
      columns: any;
      header: any;
      rows: any;
      cells: any;
      truncated: any;
      error?: undefined;
    }
  | {
      bytes: Uint8Array;
      blob: Blob;
      exported: boolean;
      format: "csv" | "xlsx";
      filename: any;
      scope: any;
      includeHeaders: any;
      columns: any;
      header: any;
      rows: any;
      cells: any;
      truncated: any;
      error?: undefined;
    }
  | {
      exported: boolean;
      format: "csv" | "xlsx";
      error: any;
    }
>;
/**
 * @param {{ grid: Function, emit: Function, announce: Function, message: Function }} host
 * @param {object} [options]
 */
export function exportExcel(
  host: {
    grid: Function;
    emit: Function;
    announce: Function;
    message: Function;
  },
  options?: object,
): Promise<
  | {
      exported: boolean;
      format: "csv" | "xlsx";
      error?: undefined;
    }
  | {
      exported: boolean;
      prevented: boolean;
      format: "csv" | "xlsx";
      filename: any;
      scope: any;
      includeHeaders: any;
      columns: any;
      header: any;
      rows: any;
      cells: any;
      truncated: any;
      error?: undefined;
    }
  | {
      csv: string;
      blob: Blob;
      exported: boolean;
      format: "csv" | "xlsx";
      filename: any;
      scope: any;
      includeHeaders: any;
      columns: any;
      header: any;
      rows: any;
      cells: any;
      truncated: any;
      error?: undefined;
    }
  | {
      bytes: Uint8Array;
      blob: Blob;
      exported: boolean;
      format: "csv" | "xlsx";
      filename: any;
      scope: any;
      includeHeaders: any;
      columns: any;
      header: any;
      rows: any;
      cells: any;
      truncated: any;
      error?: undefined;
    }
  | {
      exported: boolean;
      format: "csv" | "xlsx";
      error: any;
    }
>;
export function pasteText(
  bridge: any,
  text: any,
  table: any,
): Promise<
  | {
      pasted: boolean;
      applied: never[];
      rejected: never[];
      ignored: number;
    }
  | {
      rowId: any;
      columnId: any;
      applied: {
        rowId: any;
        columnId: any;
        value: any;
      }[];
      rejected: (
        | {
            rowId: any;
            columnId: any;
            value: any;
            message: string;
          }
        | {
            message: string;
            cancelled: boolean;
            rowId: any;
            columnId: any;
            value: any;
          }
      )[];
      ignored: number;
      pasted: boolean;
    }
  | {
      pasted: boolean;
      error: any;
      applied: never[];
      rejected: never[];
    }
>;
