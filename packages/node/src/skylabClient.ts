import { SkylabConfig, Defaults } from './config';
import { FetchHttpClient } from './transport/http';
import { HttpClient } from './types/transport';
import { SkylabUser } from './user';
import { urlSafeBase64Encode } from './util/encode';
import { performance } from './util/performance';
import { Variant } from './variant';

export class SkylabClient {
  protected readonly apiKey: string;
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
    this.debug = config?.debug;
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
        `${this.serverUrl}/sdk/vardata/${encodedContext}`,
        'GET',
        { Authorization: `Api-Key ${this.apiKey}` },
      );
      if (response.status === 200) {
        const json = JSON.parse(response.body);
        const end = performance.now();
        if (this.debug) {
          console.debug(
            `[Skylab] Fetched all variants in ${(end - start).toFixed(3)} ms`,
          );
        }
        const variants = {};
        for (const key of Object.keys(json)) {
          variants[key] = json[key].value;
        }
        return variants;
      } else {
        console.error(`[Skylab] Received ${response.status}: ${response.body}`);
      }
    } catch (e) {
      console.error(e);
    }
    return {};
  }

  public async getAllVariantsData(
    user: SkylabUser,
  ): Promise<{ [flagKey: string]: Variant }> {
    if (!this.apiKey) {
      return {};
    }
    try {
      const start = performance.now();
      const userContext = user || {};
      const encodedContext = urlSafeBase64Encode(JSON.stringify(userContext));
      const response = await this.httpClient.request(
        `${this.serverUrl}/sdk/vardata/${encodedContext}`,
        'GET',
        { Authorization: `Api-Key ${this.apiKey}` },
      );
      if (response.status === 200) {
        const json = JSON.parse(response.body);
        const end = performance.now();
        if (this.debug) {
          console.debug(
            `[Skylab] Fetched all variant data in ${(end - start).toFixed(
              3,
            )} ms`,
          );
        }
        return json;
      } else {
        console.error(`[Skylab] Received ${response.status}: ${response.body}`);
      }
    } catch (e) {
      console.error(e);
    }
    return {};
  }
}
