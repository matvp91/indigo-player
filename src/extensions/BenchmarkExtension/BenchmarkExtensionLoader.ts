import { BenchmarkExtension } from '@src/extensions/BenchmarkExtension/BenchmarkExtension';
import { IInstance, Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';

export const BenchmarkExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: IInstance) => new BenchmarkExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<BenchmarkExtension>;
