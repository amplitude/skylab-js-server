import { Defaults, SkylabConfig } from './config';
import { SkylabClient } from './skylabClient';
import { fetchHttpClient } from './transport/http';
import { normalizeInstanceName } from './util/normalize';

const instances = {};

const init = (apiKey?: string, config?: SkylabConfig): SkylabClient => {
  const normalizedName = normalizeInstanceName(
    config?.instanceName || Defaults.INSTANCE_NAME,
  );
  if (!instances[normalizedName]) {
    instances[normalizedName] = new SkylabClient(
      normalizedName,
      apiKey,
      config,
      fetchHttpClient,
    );
  }
  return instances[normalizedName];
};

const getInstance = (name: string = Defaults.INSTANCE_NAME): SkylabClient => {
  const normalizedName = normalizeInstanceName(name) || Defaults.INSTANCE_NAME;
  return instances[normalizedName];
};

export const Skylab = {
  init,
  getInstance,
};
