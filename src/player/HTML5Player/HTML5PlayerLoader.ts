import { Instance } from '@src/Instance';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { ModuleLoader, ModuleLoaderTypes } from '@src/types';

export const HTML5PlayerLoader = {
  type: ModuleLoaderTypes.PLAYER,

  create: (instance: Instance) => new HTML5Player(instance),

  isSupported: (): boolean => true,
} as ModuleLoader<HTML5Player>;
