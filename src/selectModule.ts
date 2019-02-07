import { createAllSupported, createFirstSupported } from '@src/ModuleLoader';
import {
  Format,
  IController,
  IInstance,
  IMedia,
  IModule,
  IPlayer,
  ModuleLoaderTypes,
} from '@src/types';

export async function selectMedia(
  instance: IInstance,
): Promise<[Format, IMedia]> {
  const sources: Format[] = instance.config.sources;

  for (const format of sources) {
    const media = await createFirstSupported<IMedia>(
      ModuleLoaderTypes.MEDIA,
      instance,
      format,
    );
    if (media) {
      return [format, media];
    }
  }

  return [null, null];
}

export async function selectPlayer(instance: IInstance): Promise<IPlayer> {
  return createFirstSupported<IPlayer>(ModuleLoaderTypes.PLAYER, instance);
}

export async function selectExtensions(
  instance: IInstance,
): Promise<IModule[]> {
  return createAllSupported<IModule>(ModuleLoaderTypes.EXTENSION, instance);
}

export async function selectController(
  instance: IInstance,
): Promise<IController> {
  return createFirstSupported<IController>(
    ModuleLoaderTypes.CONTROLLER,
    instance,
  );
}
