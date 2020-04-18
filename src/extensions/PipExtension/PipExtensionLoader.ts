import { PipExtension } from '@src/extensions/PipExtension/PipExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const PipExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: (instance: IInstance) => new PipExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<PipExtension>;
