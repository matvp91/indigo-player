import { BenchmarkExtension } from '@src/extensions/BenchmarkExtension/BenchmarkExtension';
import { Instance } from '@src/Instance';
import { Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';

export const BenchmarkExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: Instance) => new BenchmarkExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<BenchmarkExtension>;
