import {
  IInstance,
  IController,
  IMedia,
  IPlayer,
  IModuleLoader,
  IModule,
} from './types';

/**
 * Export types.
 * External module developers can use these types to write their own modules,
 * external modules are not bundled within the core package.
 */
export {
  /**
   * The main interface for the instance, this is always the first
   * parameter in any module's constructor.
   * @type {IInstance} interface
   */
  IInstance,

  /**
   * The interface you need to comply to when writing your own module loader.
   * @type {IModuleLoader} interface
   */
  IModuleLoader,

  /**
   * The main config interface. It's best to extend from this if you want
   * to add your own variables to the config.
   * @type {Config} interface
   */
  Config,

  // Enums

  /**
   * The different types of module loaders (eg: extension, controller, ...).
   * @prop ModuleLoaderTypes
   * @type {ModuleLoaderTypes}
   */
  ModuleLoaderTypes,

  /**
   * A list of events.
   * @prop Events
   * @type {Events}
   */
  Events,

  /**
   * A list of error codes.
   * @prop ErrorCodes
   * @type {ErrorCodes}
   */
  ErrorCodes,
} from './types';

interface ModuleConstructor<T> {
  new (instance: IInstance): T;
}

/**
 * The current version of indigo-player
 * @type {string}
 */
export const VERSION: string;

/**
 * Set the chunks path, this will tell the player where to get the chunks.
 * Defaults to: https://cdn.jsdelivr.net/npm/indigo-player@<VERSION>/lib/
 * @param {string} chunksPath string
 */
export function setChunksPath(chunksPath: string);

/**
 * Registers an external module within the player eco system.
 * @param {IModuleLoader<IModule>} moduleLoader The module loader
 */
export function addModuleLoader(moduleLoader: IModuleLoader<IModule>);

/**
 * Class constructor for a Module
 * @prop Module
 * @type {ModuleConstructor<IModule>}
 */
export const Module: ModuleConstructor<IModule>;

/**
 * Class constructor for a Controller
 * @prop Controller
 * @type {ModuleConstructor<IController>}
 */
export const Controller: ModuleConstructor<IController>;

/**
 * Class constructor for Media
 * @prop Media
 * @type {ModuleConstructor<IMedia>}
 */
export const Media: ModuleConstructor<IMedia>;

/**
 * Class constructor for Player
 * @prop Player
 * @type {ModuleConstructor<IPlayer>}
 */
export const Player: ModuleConstructor<IPlayer>;

export as namespace IndigoPlayer;
