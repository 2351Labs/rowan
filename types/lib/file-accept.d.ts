export function parseAcceptList(accept: any): string[];
export function fileMatchesAccept(file: any, accept: any): boolean;
export function partitionAcceptedFiles(files: any, accept: any): {
    accepted: any[];
    rejected: any[];
};
