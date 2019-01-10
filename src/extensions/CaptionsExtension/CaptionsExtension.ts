import { Instance } from '@src/Instance';
import { Module } from '@src/Module';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { CaptionConfig, Events } from '@src/types';

export class CaptionsExtension extends Module {
  private tracks: HTMLTrackElement[];

  constructor(instance: Instance) {
    super(instance);

    if (!instance.config.captions) {
      return;
    }

    this.tracks = instance.config.captions.map(caption => {
      const track = document.createElement('track');

      track.kind = 'captions';
      track.label = caption.label;
      track.srclang = caption.srclang;
      track.src = caption.src;

      return track;
    });

    this.once(Events.PLAYER_STATE_READY, () => {
      const mediaElement: HTMLMediaElement = (this.instance
        .player as HTML5Player).mediaElement;

      this.tracks.forEach(track => {
        mediaElement.appendChild(track);
      });
    });
  }
}
