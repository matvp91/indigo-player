import { FullscreenExtension } from '@src/extensions/FullscreenExtension/FullscreenExtension';
import { IInstance, Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';

export const FullscreenExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: IInstance) => new FullscreenExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<FullscreenExtension>;
