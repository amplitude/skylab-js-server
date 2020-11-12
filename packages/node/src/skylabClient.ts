import { SkylabConfig, Defaults } from './config';
import { evaluateFlag } from './evaluation/engine';
import { FlagConfig } from './flagConfig';
import { InMemoryStorage } from './storage/memory';
import { FetchHttpClient } from './transport/http';
import { Storage } from './types/storage';
import { HttpClient } from './types/transport';
import { SkylabUser } from './user';
import { urlSafeBase64Encode } from './util/encode';
import { performance } from './util/performance';

export class SkylabClient {
  protected readonly apiKey: string;
  protected readonly storage: Storage;
  protected readonly httpClient: HttpClient;

  protected serverUrl: string;
  protected config: SkylabConfig;
  protected user: SkylabUser;
  protected debug: boolean;

  public constructor(apiKey: string, config: SkylabConfig) {
    this.apiKey = apiKey;
    this.config = config;
    this.serverUrl = config?.serverUrl || Defaults.SERVER_URL;
    this.httpClient = FetchHttpClient;
    this.storage = new InMemoryStorage();
    this.debug = config?.debug;
  }

  // should be called at initialization and periodically in the background
  private async getRules(): Promise<{ [flagKey: string]: FlagConfig }> {
    if (!this.apiKey) {
      return {};
    }
    try {
      const start = performance.now();
      const response = await this.httpClient.request(
        `${this.serverUrl}/sdk/rules`,
        'GET',
        { Authorization: `Api-Key ${this.apiKey}` },
      );
      const flagConfigs = JSON.parse(response.body);
      const flagConfigsMap = {};
      for (const flagConfig of flagConfigs) {
        flagConfigsMap[flagConfig.flagKey] = flagConfig;
      }
      // TODO: cache this flagConfigsMap on the server and refresh it periodically

      const end = performance.now();
      if (this.debug) {
        console.debug(
          `[Skylab] Fetched all rules in ${(end - start).toFixed(3)} ms`,
        );
      }
      return flagConfigsMap;
    } catch (e) {
      console.error(e);
    }
  }

  public async getVariant(flagKey: string, user: SkylabUser): Promise<string> {
    const flagConfigsMap = await this.getRules();
    const flagConfig = flagConfigsMap[flagKey];
    if (!flagConfig) {
      return null;
    }
    const flagVariant = evaluateFlag(flagConfig, user);
    return flagVariant;
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
      if (this.debug) {
        console.debug(
          `[Skylab] Fetched all variants in ${(end - start).toFixed(3)} ms`,
        );
      }
      return json;
    } catch (e) {
      console.error(e);
    }
    return {};
  }
}
