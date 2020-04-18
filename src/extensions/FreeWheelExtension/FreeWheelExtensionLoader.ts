import { FreeWheelExtension } from '@src/extensions/FreeWheelExtension/FreeWheelExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const FreeWheelExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: (instance: IInstance) => new FreeWheelExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => {
    return config.freewheel && config.freewheel.clientSide;
  },
} as IModuleLoader<FreeWheelExtension>;
