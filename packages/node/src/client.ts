import { SkylabConfig, Defaults } from './config';
import { FetchHttpClient } from './transport/http';
import { HttpClient } from './types/transport';
import { SkylabUser } from './types/user';
import { Variant, Variants } from './types/variant';
import { urlSafeBase64Encode } from './util/encode';
import { performance } from './util/performance';

/**
 * Main client for fetching variant data.
 * @category Core Usage
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
   * In most cases, a SkylabClient should be initialized and accessed using
   * the factory functions {@link skylabInit} and {@link skylabInstance}
   * @param apiKey The environment API Key
   * @param config See {@link SkylabConfig} for config options
   */
  public constructor(apiKey: string, config: SkylabConfig) {
    this.apiKey = apiKey;
    this.config = { ...Defaults, ...config };
    this.httpClient = FetchHttpClient;
    this.debug = this.config?.debug;
  }

  private async fetchAll(
    user: SkylabUser,
  ): Promise<{ [flagKey: string]: Variant }> {
    try {
      const start = performance.now();
      const userContext = user || {};
      const encodedContext = urlSafeBase64Encode(JSON.stringify(userContext));
      const endpoint = `${this.config.serverUrl}/sdk/vardata/${encodedContext}`;
      const headers = {
        Authorization: `Api-Key ${this.apiKey}`,
      };
      const response = await this.httpClient.request(endpoint, 'GET', headers);
      if (response.status === 200) {
        const json = JSON.parse(response.body);
        const end = performance.now();
        this.debug &&
          console.debug(
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
   * @param user The {@link SkylabUser} context
   */
  public async getVariants(user: SkylabUser): Promise<Variants> {
    if (!this.apiKey) {
      return {};
    }
    const variants = await this.fetchAll(user);
    return variants;
  }
}