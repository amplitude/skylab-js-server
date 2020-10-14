import { SkylabConfig } from './config';
import { Storage } from './storage/interface';
import { HttpClient } from './transport/interface';
import { SkylabUser } from './user';
export declare class SkylabClient {
    protected readonly instanceName: string;
    protected readonly apiKey: string;
    protected readonly storage: Storage;
    protected readonly storageNamespace: string;
    protected readonly httpClient: HttpClient;
    protected serverUrl: string;
    protected config: SkylabConfig;
    protected user: SkylabUser;
    constructor(instanceName: string, apiKey: string, config: SkylabConfig, httpClient: HttpClient);
    protected fetchAll(): Promise<SkylabClient>;
    getVariant(flagKey: string, fallback?: string): Promise<string>;
}
