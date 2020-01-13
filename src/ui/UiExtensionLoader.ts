import { Instance } from '@src/Instance';
import { Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';
import { UiExtension } from '@src/ui/UiExtension';

export const UiExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: (instance: Instance) => new UiExtension(instance),

  isSupported: ({ config }: { config: Config }): boolean =>
    config.ui && config.ui.enabled,
} as IModuleLoader<UiExtension>;
