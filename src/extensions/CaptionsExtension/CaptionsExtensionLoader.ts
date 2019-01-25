import { CaptionsExtension } from '@src/extensions/CaptionsExtension/CaptionsExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const CaptionsExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: IInstance) => new CaptionsExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => {
    return !!config.captions;
  },
} as IModuleLoader<CaptionsExtension>;
