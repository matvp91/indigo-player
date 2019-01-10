import { CaptionsExtension } from '@src/extensions/CaptionsExtension/CaptionsExtension';
import { Instance } from '@src/Instance';
import { Config, ModuleLoader, ModuleLoaderTypes } from '@src/types';

export const CaptionsExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: Instance) => new CaptionsExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => {
    return true;
  },
} as ModuleLoader<CaptionsExtension>;
