/**
 * @category Configuration
 */
export type SkylabConfig = {
  /**
   * Set to true to log some extra information to the console.
   */
  debug?: boolean;

  /**
   * The instance name for the SkylabClient. Instance names are case _sensitive_.
   */
  instanceName?: string;

  /**
   * The server endpoint from which to request variants.
   */
  serverUrl?: string;
};

/**
 Defaults for Skylab Config options

 | **Option**       | **Default**                       |
 |----------------|---------------------------------|
 | **debug**        | false                           |
 | **instanceName** | `"$default_instance"`             |
 | **serverUrl**    | `"https://api.lab.amplitude.com"` |

 *
 * @category Configuration
 */
export const Defaults: SkylabConfig = {
  debug: false,
  instanceName: '$default_instance',
  serverUrl: 'https://api.lab.amplitude.com',
};
