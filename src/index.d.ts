import {
  IInstance,
  IModule,
  IPlayer,
  IController,
  IMedia,
  IModuleLoader,
} from './types';

export {
  // Types for development
  IInstance,
  IModuleLoader,
  Config,

  // Types related to IndigoPlayer.<VAR>,
  // make sure they are in sync with "./index.ts".
  Events,
  ErrorCodes,
  ModuleLoaderTypes,
} from './types';

interface ModuleConstructor<T> {
  new (instance: IInstance): T;
}

export const Module: ModuleConstructor<IModule>;

export const Controller: ModuleConstructor<IController>;

export const Media: ModuleConstructor<IMedia>;

export const Player: ModuleConstructor<IPlayer>;

export declare function addModuleLoader(moduleLoader: IModuleLoader<IModule>): void;

// Interfaces for implementations of modules.

export interface HTML5Player extends IPlayer {
  mediaElement: HTMLMediaElement;
}

export as namespace IndigoPlayer;
