import { BenchmarkExtension } from '@src/extensions/BenchmarkExtension/BenchmarkExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const BenchmarkExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: (instance: IInstance) => new BenchmarkExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<BenchmarkExtension>;
