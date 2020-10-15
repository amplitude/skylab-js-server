import { performance } from 'perf_hooks';

import { SkylabConfig, Defaults } from './config';
import { Storage } from './storage/interface';
import { InMemoryStorage } from './storage/memory';
import { HttpClient, SimpleResponse } from './transport/interface';
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

  public async getAllVariants(
    user: SkylabUser,
  ): Promise<{ [flagKey: string]: string }> {
    if (!this.apiKey) {
      return {};
    }
    try {
      const start = performance.now();
      const userContext = user || {};
      const encodedContext = urlSafeBase64Encode(JSON.stringify(userContext));
      const response = await this.httpClient.request(
        `${this.serverUrl}/sdk/variants/${encodedContext}`,
        'GET',
        { Authorization: `Api-Key ${this.apiKey}` },
      );
      const json = JSON.parse(response.body);
      this.storage.clear();
      for (const flag of Object.keys(json)) {
        this.storage.put(flag, response[flag]);
      }
      const end = performance.now();
      console.debug(
        `[Skylab] Fetched all variants in ${(end - start).toFixed(3)} ms`,
      );
      return json;
    } catch (e) {
      console.error(e);
    }
    return {};
  }
}
