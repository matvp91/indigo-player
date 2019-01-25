import {
  IController,
  IInstance,
  IMedia,
  IModule,
  IModuleLoader,
  IPlayer,
} from './types';

/**
 * Export all the internal types to module developers.
 */
export * from './types';

type ModuleConstructor<T> = new (instance: IInstance) => T;

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
 * Enable console logs.
 * @param {boolean} enableConsoleLogs true/false
 */
export function setConsoleLogs(enableConsoleLogs: boolean);

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
