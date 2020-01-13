import { FullscreenExtension } from '@src/extensions/FullscreenExtension/FullscreenExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const FullscreenExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: (instance: IInstance) => new FullscreenExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<FullscreenExtension>;
