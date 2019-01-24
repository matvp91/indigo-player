import { Media } from '@src/media/Media';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { Events, Format } from '@src/types';
import HlsJs from 'hls.js';

export class HlsMedia extends Media {
  public name: string = 'HlsMedia';

  public player: any;

  public async load() {
    await super.load();

    this.player = new HlsJs({
      autoStartLoad: false,
    });

    const mediaElement: HTMLMediaElement = (this.instance.player as HTML5Player)
      .mediaElement;

    this.player.attachMedia(mediaElement);

    this.player.loadSource(this.instance.format.src);

    this.player.startLoad();
  }

  public seekTo(time: number) {
    if (time === Infinity) {
      this.instance.player.seekTo(this.player.liveSyncPosition);
      return;
    }
    super.seekTo(time);
  }

  public unload() {
    this.player.destroy();
    this.player = null;
  }
}
