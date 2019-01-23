const { createAPI } = require('@src/createAPI');
const { Instance } = require('@src/Instance');
const { addModuleLoader } = require('@src/ModuleLoader');
const { ErrorCodes, Events, ModuleLoaderTypes } = require('@src/types');
const { Module } = require('@src/Module');

import { Config } from '@src/types';

declare var __webpack_public_path__: string;
declare var VERSION: string;

module.exports = {
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
};
