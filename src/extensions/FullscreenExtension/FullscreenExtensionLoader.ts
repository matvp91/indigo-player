import { FullscreenExtension } from '@src/extensions/FullscreenExtension/FullscreenExtension';
import { Instance } from '@src/Instance';
import { Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';

export const FullscreenExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: Instance) => new FullscreenExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<FullscreenExtension>;
