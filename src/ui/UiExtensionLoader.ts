import { Instance } from '@src/Instance';
import { Config, IModuleLoader, ModuleLoaderTypes } from '@src/types';
import { UiExtension } from '@src/ui/UiExtension';

export const UiExtensionLoader = {
  type: ModuleLoaderTypes.EXTENSION,

  create: (instance: Instance) =>
    import('@src/ui/UiExtension').then(
      ({ UiExtension }) => new UiExtension(instance),
    ),

  isSupported: ({ config }: { config: Config }): boolean => !!config.ui,
} as IModuleLoader<UiExtension>;
