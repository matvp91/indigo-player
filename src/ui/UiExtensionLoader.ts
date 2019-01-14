import { Instance } from '@src/Instance';
import { Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';
import { UiExtension } from '@src/ui/UiExtension';

export const UiExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: Instance) => new UiExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => {
    return true;
  },
} as IModuleLoader<UiExtension>;
