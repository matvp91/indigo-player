import { Instance } from '@src/Instance';
import { Media } from '@src/media/Media';
import { createFirstSupported } from '@src/ModuleLoader';
import { Format, ModuleLoaderTypes } from '@src/types';

export async function selectMedia(
  instance: Instance,
  sources: Format[],
): Promise<[Format, Media]> {
  for (const format of sources) {
    const media = await createFirstSupported<Media>(
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
