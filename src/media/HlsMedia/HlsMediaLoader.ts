import { HlsMedia } from '@src/media/HlsMedia/HlsMedia';
import {
  Format,
  FormatTypes,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';
import { isSupported } from 'hls.js/src/is-supported';

export const HlsMediaLoader = {
  type: ModuleLoaderTypes.MEDIA,

  create: (instance: IInstance) => new HlsMedia(instance),

  isSupported: (instance: IInstance, format: Format): boolean => {
    if (instance.player.name !== 'HTML5Player') {
      return false;
    }

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
} as IModuleLoader<HlsMedia>;
