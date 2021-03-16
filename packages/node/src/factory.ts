import { Defaults, SkylabConfig } from './config';
import { SkylabClient } from './client';

const instances = {};

/**
 * Initializes a singleton {@link SkylabClient} identified by the value of
 * `config.name`, defaulting to {@link Defaults.INSTANCE_NAME}.
 * @param apiKey The environment API Key
 * @param config See {@link SkylabConfig} for config options
 * @category Core Usage
 */
const init = (apiKey: string, config?: SkylabConfig): SkylabClient => {
  const normalizedName = config?.instanceName || Defaults.INSTANCE_NAME;
  if (!instances[normalizedName]) {
    instances[normalizedName] = new SkylabClient(apiKey, {
      ...config,
      instanceName: normalizedName,
    });
  }
  return instances[normalizedName];
};

/**
 * Returns the {@link SkylabClient} identified by `name`.
 * If no such instance exists, returns `undefined`.
 * @category Core Usage
 */
const instance = (name: string = Defaults.INSTANCE_NAME): SkylabClient => {
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
  instance,
};
