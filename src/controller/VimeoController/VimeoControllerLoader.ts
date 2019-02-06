import { VimeoController } from '@src/controller/VimeoController/VimeoController';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const VimeoControllerLoader = {
  type: ModuleLoaderTypes.CONTROLLER,

  create: (instance: IInstance) => new VimeoController(instance),

  isSupported: ({ config }: { config: Config }): boolean => !!config.vimeo,
} as IModuleLoader<VimeoController>;
