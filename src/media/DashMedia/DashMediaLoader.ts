import { Instance } from '@src/Instance';
import {
  isBrowserSupported,
  isBrowserSupportedDRM,
} from '@src/media/DashMedia/isBrowserSupported';
import { Media } from '@src/media/Media';
import {
  Format,
  FormatTypes,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';
import { getDrmSupport } from '@src/utils/getDrmSupport';

export const DashMediaLoader = {
  type: ModuleLoaderTypes.MEDIA,

  create: (instance: Instance) =>
    import(/* webpackChunkName: 'DashMedia' */ '@src/media/DashMedia/DashMedia').then(
      ({ DashMedia }) => new DashMedia(instance),
    ),

  isSupported: async (instance: Instance, format: Format): Promise<boolean> => {
    if (format.type !== FormatTypes.DASH) {
      return false;
    }

    if (!isBrowserSupported()) {
      return false;
    }

    if (format.drm) {
      if (!isBrowserSupportedDRM()) {
        return false;
      }

      const support: any = await getDrmSupport();
      if (!support.drmSupport.widevine && !support.drmSupport.playready) {
        return false;
      }
    }

    return true;
  },
} as IModuleLoader<Media>;
