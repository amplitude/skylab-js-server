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
 * @category Configuration
 */
export const Defaults = {
  INSTANCE_NAME: '$default_instance',
  SERVER_URL: 'https://api.lab.amplitude.com',
};
