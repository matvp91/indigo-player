import { IInstance, IModule, IPlayer } from './types';

export {
  // Types for development
  IInstance,
  IModuleLoader,

  // Types related to IndigoPlayer.<VAR>,
  // make sure they are in sync with "./index.ts".
  Events,
  ErrorCodes,
  ModuleLoaderTypes,
} from './types';

// Exported class constructors
interface ModuleConstructor {
  new (instance: IInstance): IModule;
}
export const Module: ModuleConstructor;

// Interfaces
export interface HTML5Player extends IPlayer {
  mediaElement: HTMLMediaElement;
}

export as namespace IndigoPlayer;
