import { Instance } from '@src/Instance';
import { Media } from '@src/media/Media';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { Events, Format, ShakaInstanceEventData } from '@src/types';
import * as shaka from 'shaka-player';

export class DashMedia extends Media {
  public player: any;

  constructor(instance: Instance) {
    super(instance);

    shaka.polyfill.installAll();
  }

  public async load() {
    await super.load();

    await this.loadShaka(this.instance.format);
  }

  public unload() {
    this.player.destroy();
    this.player = null;
  }

  public async loadShaka(
    format: Format,
    {
      defaultBandwidthEstimate,
      abr = true,
    }: { defaultBandwidthEstimate?: number; abr?: boolean } = {},
  ) {
    const mediaElement: HTMLMediaElement = (this.instance.player as HTML5Player)
      .mediaElement;

    this.player = new shaka.Player(mediaElement);

    this.emit(Events.SHAKA_INSTANCE, {
      shaka,
      player: this.player,
    } as ShakaInstanceEventData);

    const configuration: { drm?: any } = {};

    if (format.drm) {
      configuration.drm = {
        servers: {
          'com.widevine.alpha': format.drm.widevine.licenseUrl,
          'com.microsoft.playready': format.drm.playready.licenseUrl,
        },
        advanced: {
          'com.widevine.alpha': {
            audioRobustness: 'SW_SECURE_CRYPTO',
            videoRobustness: 'SW_SECURE_DECODE',
          },
        },
      };
    }

    this.player.configure(configuration);

    await this.player.load(format.src);
  }
}
