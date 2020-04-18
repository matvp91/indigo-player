import { ContextMenuExtension } from '@src/extensions/ContextMenuExtension/ContextMenuExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const ContextMenuExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: (instance: IInstance) => new ContextMenuExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean => true,
} as IModuleLoader<ContextMenuExtension>;
