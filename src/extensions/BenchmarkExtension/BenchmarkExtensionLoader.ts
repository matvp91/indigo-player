import { BenchmarkExtension } from '@src/extensions/BenchmarkExtension/BenchmarkExtension';
import { Instance } from '@src/Instance';
import { Config, ModuleLoader, ModuleLoaderTypes } from '@src/types';

export const BenchmarkExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: Instance) => new BenchmarkExtension(instance),

  isSupported: (config: Config): boolean => {
    return true;
  },
} as ModuleLoader<BenchmarkExtension>;
