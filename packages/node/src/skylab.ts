/**
 * This is a factory module for Skylab, provided for convenience of initializing
 * and accessing Skylab instances.
 */
import { Defaults, SkylabConfig } from './config';
import { SkylabClient } from './skylabClient';

const instances = {};

const init = (apiKey?: string, config?: SkylabConfig): SkylabClient => {
  const normalizedName = config?.instanceName || Defaults.INSTANCE_NAME;
  if (!instances[normalizedName]) {
    instances[normalizedName] = new SkylabClient(apiKey, {
      ...config,
      instanceName: normalizedName,
    });
  }
  return instances[normalizedName];
};

const getInstance = (name: string): SkylabClient => {
  const instance = instances[name || Defaults.INSTANCE_NAME];
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
