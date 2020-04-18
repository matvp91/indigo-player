import { SubtitlesExtension } from '@src/extensions/SubtitlesExtension/SubtitlesExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const SubtitlesExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: (instance: IInstance) => new SubtitlesExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => {
    return config.subtitles && config.subtitles.length > 0;
  },
} as IModuleLoader<SubtitlesExtension>;
