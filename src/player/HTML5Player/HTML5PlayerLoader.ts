import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const HTML5PlayerLoader = {
  type: ModuleLoaderTypes.PLAYER,

  create: (instance: IInstance) => new HTML5Player(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<HTML5Player>;
