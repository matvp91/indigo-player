import { DashMedia } from '@src/media/DashMedia/DashMedia';
import {
  isBrowserSupported,
  isBrowserSupportedDRM,
} from '@src/media/DashMedia/isBrowserSupported';
import {
  Format,
  FormatTypes,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';
import { getDrmSupport } from '@src/utils/getDrmSupport';

export const DashMediaLoader = {
  type: ModuleLoaderTypes.MEDIA,

  create: (instance: IInstance) => new DashMedia(instance),

  isSupported: async (
    instance: IInstance,
    format: Format,
  ): Promise<boolean> => {
    if (instance.player.name !== 'HTML5Player') {
      return false;
    }

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
} as IModuleLoader<DashMedia>;
