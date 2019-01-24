import { createFirstSupported } from '@src/ModuleLoader';
import { IInstance, IMedia, Format, ModuleLoaderTypes } from '@src/types';

export async function selectMedia(
  instance: IInstance,
  sources: Format[],
): Promise<[Format, IMedia]> {
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
