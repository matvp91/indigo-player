import { ThumbnailsExtension } from '@src/extensions/ThumbnailsExtension/ThumbnailsExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const ThumbnailsExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: IInstance) =>
    import(/* webpackChunkName: 'ThumbnailsExtension' */ '@src/extensions/ThumbnailsExtension/ThumbnailsExtension').then(
      ({ ThumbnailsExtension }) => new ThumbnailsExtension(instance),
    ),

  isSupported: ({ config }: { config: Config }): boolean => {
    if (!config.thumbnails || !config.thumbnails.src) {
      return false;
    }

    const ext = config.thumbnails.src.split('.').pop();
    if (ext !== 'vtt' && ext !== 'bif') {
      return false;
    }

    return true;
  },
} as IModuleLoader<ThumbnailsExtension>;
