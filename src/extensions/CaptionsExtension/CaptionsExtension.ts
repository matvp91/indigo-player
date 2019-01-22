import { Instance } from '@src/Instance';
import { Module } from '@src/Module';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { CaptionsChangeEventData, Events, Caption } from '@src/types';

export class CaptionsExtension extends Module {
  public name: string = 'CaptionsExtension';

  constructor(instance: Instance) {
    super(instance);

    const tracks = instance.config.captions.map(this.createTrackElement);

    this.once(Events.READY, () => {
      const mediaElement: HTMLMediaElement = this.getMediaElement();

      tracks.forEach(track => {
        mediaElement.appendChild(track);
      });
    });
  }

  public loadSubtitleFile(file: File) {
    const caption: Caption = {
      label: file.name,
      srclang: file.name,
      src: URL.createObjectURL(file)
    }

    const track = this.createTrackElement(caption);

    this.getMediaElement().appendChild(track);
    this.setSubtitle(caption.srclang);
  }

  public setSubtitle(srclang: string) {
    const mediaElement: HTMLMediaElement = this.getMediaElement();

    for (let i = 0; i < mediaElement.textTracks.length; i++) {
      const track = mediaElement.textTracks[i];
      track.mode = track.language === srclang ? 'showing' : 'hidden';
    }

    this.emit(Events.PLAYER_STATE_CAPTIONSCHANGE, {
      srclang,
    } as CaptionsChangeEventData);
  }

  private createTrackElement = (caption: Caption): HTMLTrackElement => {
    const track = document.createElement('track');

    track.kind = 'captions';
    track.label = caption.label;
    track.srclang = caption.srclang;
    track.src = caption.src;

    return track;
  }

  private getMediaElement = (): HTMLMediaElement => (this.instance.player as HTML5Player).mediaElement;
}
