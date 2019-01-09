import { FullscreenExtension } from '@src/extensions/FullscreenExtension/FullscreenExtension';
import { Instance } from '@src/Instance';
import { ModuleLoader, ModuleLoaderTypes } from '@src/types';

export const FullscreenExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: Instance) => new FullscreenExtension(instance),

  isSupported: (): boolean => {
    return true;
  },
} as ModuleLoader<FullscreenExtension>;
