import { BaseMedia } from '@src/media/BaseMedia/BaseMedia';
import {
  Format,
  FormatTypes,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const BaseMediaLoader = {
  type: ModuleLoaderTypes.MEDIA,

  create: (instance: IInstance) => new BaseMedia(instance),

  isSupported: (instance: IInstance, format: Format): boolean => {
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
