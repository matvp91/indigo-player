import { StateExtension } from '@src/extensions/StateExtension/StateExtension';
import { Instance } from '@src/Instance';
import { Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';

export const StateExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: (instance: Instance) => new StateExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<StateExtension>;
