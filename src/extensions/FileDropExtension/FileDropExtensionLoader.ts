import { FileDropExtension } from '@src/extensions/FileDropExtension/FileDropExtension';
import { Instance } from '@src/Instance';
import { Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';

export const FileDropExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: async (instance: Instance) => new FileDropExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => !!config.fileDrop,
} as IModuleLoader<FileDropExtension>;
