import { Instance } from '@src/Instance';
import { isBrowserSupported } from '@src/media/DashMedia/isBrowserSupported';
import { Media } from '@src/media/Media';
import {
  Format,
  FormatTypes,
  ModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';
import { getDrmSupport } from '@src/utils/getDrmSupport';

export const DashMediaLoader = {
  type: ModuleLoaderTypes.MEDIA,

  create: (instance: Instance) =>
    import('@src/media/DashMedia/DashMedia').then(
      ({ DashMedia }) => new DashMedia(instance),
    ),

  isSupported: async (format: Format): Promise<boolean> => {
    if (format.type !== FormatTypes.DASH) {
      return false;
    }

    if (!isBrowserSupported()) {
      return false;
    }

    if (format.drm) {
      const support: any = await getDrmSupport();
      if (!support.drmSupport.widevine && !support.drmSupport.playready) {
        return false;
      }
    }

    return true;
  },
} as ModuleLoader<Media>;
