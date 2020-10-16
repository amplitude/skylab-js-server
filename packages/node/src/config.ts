export type SkylabConfig = {
  instanceName?: string;
  serverUrl?: string;
  debug?: boolean;
};

export const Defaults = {
  INSTANCE_NAME: '$default_instance',
  SERVER_URL: 'https://api.lab.amplitude.com',
};
