export function createEventScriptParameters({ steps, events }?: {
    steps?: any[];
    events?: any[];
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
