import { createAPI } from '@src/createAPI';
import { Instance } from '@src/Instance';
import { addModuleLoader } from '@src/ModuleLoader';
import { ErrorCodes, Events, ModuleLoaderTypes, Config } from '@src/types';
import { Module } from '@src/Module';
import { Controller } from '@src/controller/Controller';
import { Media } from '@src/media/Media';
import { Player } from '@src/player/Player';

declare var __webpack_public_path__: string;
declare var VERSION: string;

export default {
  VERSION,
  setChunksPath(chunksPath: string) {
    __webpack_public_path__ = chunksPath;
  },
  init(element: HTMLElement, config: Config) {
    const instance = new Instance(element, config);
    return createAPI(instance);
  },
  addModuleLoader,

  // Export enums
  Events,
  ErrorCodes,
  ModuleLoaderTypes,

  // Export class constructors
  Module,
  Controller,
  Media,
  Player,
};
