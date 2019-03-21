import { DimensionsExtension } from '@src/extensions/DimensionsExtension/DimensionsExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const DimensionsExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: IInstance) => new DimensionsExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<DimensionsExtension>;
