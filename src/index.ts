import { Controller } from '@src/controller/Controller';
import { createAPI } from '@src/createAPI';
import { Instance } from '@src/Instance';
import { Media } from '@src/media/Media';
import { Module } from '@src/Module';
import { addModuleLoader } from '@src/ModuleLoader';
import { Player } from '@src/player/Player';
import { Config, ErrorCodes, Events, ModuleLoaderTypes } from '@src/types';
import { setConsoleLogs } from '@src/utils/log';
import { resolveScriptPath } from '@src/utils/webpack';

declare var __webpack_public_path__: string;
declare var VERSION: string;

__webpack_public_path__ = resolveScriptPath('indigo-player.js');

export default {
  VERSION,
  setChunksPath(chunksPath: string) {
    __webpack_public_path__ = chunksPath;
  },
  setConsoleLogs,
  init(element: HTMLElement | string, config: Config) {
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
