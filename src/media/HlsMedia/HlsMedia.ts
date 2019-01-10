import { Instance } from '@src/Instance';
import { Media } from '@src/media/Media';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { Events, Format } from '@src/types';
import HlsJs from 'hls.js';

export class HlsMedia extends Media {
  public player: any;

  public async load() {
    await super.load();

    this.player = new HlsJs({
      autoStartLoad: false,
    });

    const mediaElement: HTMLMediaElement = (this.instance.player as HTML5Player)
      .mediaElement;

    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    this.once(Events.PLAYER_STATE_READY, resolvePromise);

    this.player.attachMedia(mediaElement);

    this.player.loadSource(this.instance.format.src);

    this.player.startLoad();

    await promise;
  }

  public unload() {
    this.player.destroy();
    this.player = null;
  }
}
