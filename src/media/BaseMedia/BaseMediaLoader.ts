import { Instance } from '@src/Instance';
import { BaseMedia } from '@src/media/BaseMedia/BaseMedia';
import {
  Format,
  FormatTypes,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const BaseMediaLoader = {
  type: ModuleLoaderTypes.MEDIA,

  create: (instance: Instance) => new BaseMedia(instance),

  isSupported: (instance: Instance, format: Format): boolean => {
    if (
      format.type === FormatTypes.MP4 ||
      format.type === FormatTypes.MOV ||
      format.type === FormatTypes.WEBM
    ) {
      return true;
    }

    if (
      format.type === FormatTypes.HLS &&
      (instance.env.isSafari || instance.env.isIOS)
    ) {
      return true;
    }

    return false;
  },
} as IModuleLoader<BaseMedia>;
