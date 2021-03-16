import { SkylabConfig, Defaults } from './config';
import { FetchHttpClient } from './transport/http';
import { HttpClient } from './types/transport';
import { SkylabUser } from './user';
import { urlSafeBase64Encode } from './util/encode';
import { performance } from './util/performance';
import { Variant } from './variant';

/**
 * Main client for fetching variant data.
 */
export class SkylabClient {
  protected readonly apiKey: string;
  protected readonly httpClient: HttpClient;

  protected serverUrl: string;
  protected config: SkylabConfig;
  protected user: SkylabUser;
  protected debug: boolean;

  /**
   * Creates a new SkylabClient instance.
   * @param apiKey The environment API Key
   * @param config See {@link SkylabConfig} for config options
   */
  public constructor(apiKey: string, config: SkylabConfig) {
    this.apiKey = apiKey;
    this.config = config;
    this.serverUrl = config?.serverUrl || Defaults.SERVER_URL;
    this.httpClient = FetchHttpClient;
    this.debug = config?.debug;
  }

  private async fetchAll(user: SkylabUser): Promise<{ [flagKey: string]: Variant}> {
    try {
      const start = performance.now();
      const userContext = user || {};
      const encodedContext = urlSafeBase64Encode(JSON.stringify(userContext));
      const endpoint = `${this.serverUrl}/sdk/vardata/${encodedContext}`;
      const headers = {
        Authorization: `Api-Key ${this.apiKey}`,
      }
      const response = await this.httpClient.request(
        endpoint, 'GET', headers
      );
      if (response.status === 200) {
        const json = JSON.parse(response.body);
        const end = performance.now();
        this.debug && console.debug(
          `[Skylab] Fetched all variants in ${(end - start).toFixed(3)} ms`,
        );
        return json;
      } else {
        console.error(`[Skylab] Received ${response.status}: ${response.body}`);
      }
    } catch (e) {
      console.error(e);
    }
    return {};
  }

  /**
   * Returns all variants for the user
   */
  public async getVariants(
    user: SkylabUser,
  ): Promise<{ [flagKey: string]: Variant }> {
    if (!this.apiKey) {
      return {};
    }
    const variants = await this.fetchAll(user);
    return variants;
  }
}
