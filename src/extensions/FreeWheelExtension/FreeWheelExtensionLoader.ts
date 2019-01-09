import { FreeWheelExtension } from '@src/extensions/FreeWheelExtension/FreeWheelExtension';
import { Instance } from '@src/Instance';
import { Config, ModuleLoader, ModuleLoaderTypes } from '@src/types';

export const FreeWheelExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: Instance) => new FreeWheelExtension(instance),

  isSupported: (config: Config): boolean => {
    return config.freewheel && config.freewheel.clientSide;
  },
} as ModuleLoader<FreeWheelExtension>;
