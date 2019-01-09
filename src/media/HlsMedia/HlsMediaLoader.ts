import { Instance } from '@src/Instance';
import { HlsMedia } from '@src/media/HlsMedia/HlsMedia';
import {
  Format,
  FormatTypes,
  ModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const HlsMediaLoader = {
  type: ModuleLoaderTypes.MEDIA,

  create: (instance: Instance) => new HlsMedia(instance),

  isSupported: (format: Format): boolean => {
    if (format.type !== FormatTypes.HLS) {
      return false;
    }

    // TODO: Check if we support HLS!

    return true;
  },
} as ModuleLoader<HlsMedia>;
