export function createEventScriptParameters({ steps, events }?: {
    steps?: any[] | undefined;
    events?: any[] | undefined;
}): {
    docs: {
        description: {
            story: string;
        };
    };
    rowanEventTrace: {
        script: any[];
        events: any[];
    };
};
