/**
 * This is a factory module for Skylab, provided for convenience of initializing
 * and accessing Skylab instances.
 */
import { Defaults, SkylabConfig } from './config';
import { SkylabClient } from './skylabClient';

const instances = {};

const init = (clientApiKey?: string, config?: SkylabConfig): SkylabClient => {
  const normalizedName = config?.instanceName || Defaults.INSTANCE_NAME;
  if (!instances[normalizedName]) {
    instances[normalizedName] = new SkylabClient(clientApiKey, {
      ...config,
      instanceName: normalizedName,
    });
  }
  return instances[normalizedName];
};

const getInstance = (name: string = Defaults.INSTANCE_NAME): SkylabClient => {
  const instance = instances[name];
  if (!instance) {
    console.warn(
      `[Skylab] Instance ${name} has not been initialized. Call init before calling getInstance.`,
    );
  }
  return instance;
};

export const Skylab = {
  init,
  getInstance,
};
