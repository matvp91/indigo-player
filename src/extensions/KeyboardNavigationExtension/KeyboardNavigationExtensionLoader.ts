import { KeyboardNavigationExtension } from '@src/extensions/KeyboardNavigationExtension/KeyboardNavigationExtension';
import {
  Config,
  IInstance,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const KeyboardNavigationExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: (instance: IInstance) =>
    new KeyboardNavigationExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean =>
    !!config.keyboardNavigation,
} as IModuleLoader<KeyboardNavigationExtension>;
