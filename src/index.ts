import { Instance } from '@src/Instance';
import { addModuleLoader } from '@src/ModuleLoader';
import { exposeEnum } from '@src/utils/exposeEnum';
import { Config, ModuleLoaderTypes, Events } from './types';

declare var __webpack_public_path__: string;

export const IndigoPlayer = {
  VERSION: 'experimental',
  setChunksPath(chunksPath: string) {
    __webpack_public_path__ = chunksPath;
  },
  init(element: HTMLElement, config: Config) {
    return new Instance(element, config);
  },
  addModuleLoader,
  ModuleLoaderTypes: exposeEnum(ModuleLoaderTypes),
  Events: exposeEnum(Events),
};
