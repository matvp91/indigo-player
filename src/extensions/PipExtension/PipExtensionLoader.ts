import { PipExtension } from '@src/extensions/PipExtension/PipExtension';
import { Instance } from '@src/Instance';
import { Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';

export const PipExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: Instance) => new PipExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<PipExtension>;
