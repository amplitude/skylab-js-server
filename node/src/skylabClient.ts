import { performance } from 'perf_hooks';

import { SkylabConfig, Defaults } from './config';
import { Storage } from './storage/interface';
import { InMemoryStorage } from './storage/memory';
import { HttpClient } from './transport/interface';
import { SkylabUser } from './user';
import { urlSafeBase64Encode } from './util/base64';

export class SkylabClient {
  protected readonly instanceName: string;
  protected readonly apiKey: string;
  protected readonly storage: Storage;
  protected readonly storageNamespace: string;
  protected readonly httpClient: HttpClient;

  protected serverUrl: string;
  protected config: SkylabConfig;
  protected user: SkylabUser;

  public constructor(
    instanceName: string,
    apiKey: string,
    config: SkylabConfig,
    httpClient: HttpClient,
  ) {
    this.instanceName = instanceName;
    this.apiKey = apiKey;
    this.httpClient = httpClient;
    this.config = config;
    this.serverUrl = config?.serverUrl || Defaults.SERVER_URL;
    this.storage = new InMemoryStorage();
  }

  protected async fetchAll(): Promise<SkylabClient> {
    if (this.apiKey === null) {
      return this;
    }
    try {
      const user = this.user;
      const userContext = {
        ...user,
      };
      const encodedContext = urlSafeBase64Encode(JSON.stringify(userContext));
      const response = await this.httpClient.request(
        `${this.serverUrl}/sdk/variants/${encodedContext}`,
        'GET',
        { Authorization: `Api-Key ${this.apiKey}` },
      );
      this.storage.clear();
      for (const flag of Object.keys(response)) {
        this.storage.put(flag, response[flag]);
      }
    } catch (e) {
      console.error(e);
    }
    return this;
  }

  public async getVariant(
    flagKey: string,
    fallback: string = Defaults.FALLBACK_VARIANT,
  ): Promise<string> {
    if (this.apiKey === null) {
      return null;
    }
    const start = performance.now();
    await this.fetchAll();
    const variant = this.storage.get(flagKey) || fallback;
    const end = performance.now();
    console.debug(
      `[Skylab] Fetched ${variant} for ${flagKey} in ${(end - start).toFixed(
        3,
      )} ms`,
    );
    return variant;
  }
}
