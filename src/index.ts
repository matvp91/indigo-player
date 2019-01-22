import { createAPI } from '@src/createAPI';
import { Instance } from '@src/Instance';
import { addModuleLoader } from '@src/ModuleLoader';
import { exposeEnum } from '@src/utils/exposeEnum';
import { Config, ErrorCodes, Events, ModuleLoaderTypes } from './types';

declare var __webpack_public_path__: string;
declare var VERSION: string;

const IndigoPlayer = {
  VERSION,
  setChunksPath(chunksPath: string) {
    __webpack_public_path__ = chunksPath;
  },
  init(element: HTMLElement, config: Config) {
    const instance = new Instance(element, config);
    return createAPI(instance);
  },
  addModuleLoader,
  Events: exposeEnum(Events),
  ErrorCodes: exposeEnum(ErrorCodes),
};

(window as any).IndigoPlayer = IndigoPlayer;

export { Module } from '@src/Module';

export { IModuleLoader, ModuleLoaderTypes, Events } from '@src/types';

export { Instance } from '@src/Instance';
