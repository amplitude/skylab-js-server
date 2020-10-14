import { SkylabConfig } from './config';
import { SkylabClient } from './skylabClient';
export declare const Skylab: {
    init: (apiKey?: string, config?: SkylabConfig) => SkylabClient;
    getInstance: (name?: string) => SkylabClient;
};
