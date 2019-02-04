import { ThumbnailsExtension } from '@src/extensions/ThumbnailsExtension/ThumbnailsExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const ThumbnailsExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: IInstance) => new ThumbnailsExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => {
    return !!config.thumbnails && !!config.thumbnails.src;
  },
} as IModuleLoader<ThumbnailsExtension>;
