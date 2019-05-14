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
    if (!config.thumbnails || !config.thumbnails.src) {
      return false;
    }

    if (
      ["vtt", "bif"].indexOf(config.thumbnails.src.split(".").pop()) < 0
    ) {
      return false;
    }

    return true;
  },
} as IModuleLoader<ThumbnailsExtension>;
