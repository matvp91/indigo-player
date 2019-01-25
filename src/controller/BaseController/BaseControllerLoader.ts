import { BaseController } from '@src/controller/BaseController/BaseController';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const BaseControllerLoader = {
  type: ModuleLoaderTypes.CONTROLLER,

  create: (instance: IInstance) => new BaseController(instance),

  isSupported: ({ config }: { config: Config }): boolean => {
    return config.sources.length > 0;
  },
} as IModuleLoader<BaseController>;
