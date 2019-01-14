import { Instance } from '@src/Instance';
import { Media } from '@src/media/Media';
import {
  Format,
  FormatTypes,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';
import { isSupported } from 'hls.js/src/is-supported';

export const HlsMediaLoader = {
  type: ModuleLoaderTypes.MEDIA,

  create: (instance: Instance) =>
    import('@src/media/HlsMedia/HlsMedia').then(
      ({ HlsMedia }) => new HlsMedia(instance),
    ),

  isSupported: (instance: Instance, format: Format): boolean => {
    if (format.type !== FormatTypes.HLS) {
      return false;
    }

    if (instance.env.isSafari || instance.env.isIOS) {
      return false;
    }

    if (!isSupported()) {
      return false;
    }

    return true;
  },
} as IModuleLoader<Media>;
