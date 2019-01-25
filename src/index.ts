import { Controller } from '@src/controller/Controller';
import { createAPI } from '@src/createAPI';
import { Instance } from '@src/Instance';
import { Media } from '@src/media/Media';
import { Module } from '@src/Module';
import { addModuleLoader } from '@src/ModuleLoader';
import { Player } from '@src/player/Player';
import { Config, ErrorCodes, Events, ModuleLoaderTypes } from '@src/types';

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
