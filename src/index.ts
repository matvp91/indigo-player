import { createAPI } from '@src/createAPI';
import { Instance } from '@src/Instance';
import { addModuleLoader } from '@src/ModuleLoader';
import { exposeEnum } from '@src/utils/exposeEnum';
import { Config, Events, ModuleLoaderTypes } from './types';

declare var __webpack_public_path__: string;
declare var VERSION: string;

export const IndigoPlayer = {
  VERSION: VERSION,
  setChunksPath(chunksPath: string) {
    __webpack_public_path__ = chunksPath;
  },
  init(element: HTMLElement, config: Config) {
    const instance = new Instance(element, config);
    return createAPI(instance);
  },
  addModuleLoader,
  ModuleLoaderTypes: exposeEnum(ModuleLoaderTypes),
  Events: exposeEnum(Events),
};
