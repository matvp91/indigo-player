import { GoogleIMAExtension } from '@src/extensions/GoogleIMAExtension/GoogleIMAExtension';
import { Instance } from '@src/Instance';
import { Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';

export const GoogleIMAExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: Instance) => new GoogleIMAExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => {
    return !!config.googleIMA;
  },
} as IModuleLoader<GoogleIMAExtension>;
