import { GoogleIMAExtension } from '@src/extensions/GoogleIMAExtension/GoogleIMAExtension';
import { IInstance, Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';

export const GoogleIMAExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: IInstance) => new GoogleIMAExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => {
    return !!config.googleIMA;
  },
} as IModuleLoader<GoogleIMAExtension>;
