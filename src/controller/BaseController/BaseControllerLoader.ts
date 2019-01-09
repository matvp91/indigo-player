import { BaseController } from '@src/controller/BaseController/BaseController';
import { Instance } from '@src/Instance';
import { Config, ModuleLoader, ModuleLoaderTypes } from '@src/types';

export const BaseControllerLoader = {
  type: ModuleLoaderTypes.CONTROLLER,

  create: (instance: Instance) => new BaseController(instance),

  isSupported: ({ config }: { config: Config }): boolean => {
    return config.sources.length > 0;
  },
} as ModuleLoader<BaseController>;
