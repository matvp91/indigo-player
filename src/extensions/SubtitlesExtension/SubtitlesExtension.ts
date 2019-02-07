import { Module } from '@src/Module';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { Events, IEventData, IInstance, Subtitle } from '@src/types';

interface ISubtitleChangeEventData extends IEventData {
  subtitle: Subtitle;
}

export class SubtitlesExtension extends Module {
  public name: string = 'SubtitlesExtension';

  constructor(instance: IInstance) {
    super(instance);

    const tracks = instance.config.subtitles.map(subtitle => {
      const track = document.createElement('track');

      track.kind = 'captions';
      track.label = subtitle.label;
      track.srclang = subtitle.srclang;
      track.src = subtitle.src;

      return track;
    });

    this.once(Events.READY, () => {
      if (!this.instance.getModule('HTML5Player')) {
        return;
      }

      const mediaElement: HTMLMediaElement = (this.instance.getModule(
        'HTML5Player',
      ) as any).mediaElement;

      tracks.forEach(track => {
        mediaElement.appendChild(track);
      });
    });
  }

  public setSubtitle(srclang: string) {
    const mediaElement: HTMLMediaElement = (this.instance.getModule(
      'HTML5Player',
    ) as any).mediaElement;

    for (let i = 0; i < mediaElement.textTracks.length; i++) {
      const track = mediaElement.textTracks[i];
      track.mode = track.language === srclang ? 'showing' : 'hidden';
    }

    const subtitle =
      this.instance.config.subtitles.find(
        subtitle => subtitle.srclang === srclang,
      ) || null;

    this.emit(Events.PLAYER_STATE_SUBTITLECHANGE, {
      subtitle,
    } as ISubtitleChangeEventData);
  }
}
