import { Module } from '@src/Module';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { Events, IEventData, IInstance, Subtitle } from '@src/types';
import * as SubtitleParser from 'subtitle';

interface ISubtitleChangeEventData extends IEventData {
  subtitle: Subtitle;
}

interface ISubtitleTextChangeEventData extends IEventData {
  text: string;
}

interface ITrackTiming {
  start: number;
  end: number;
  text: string;
}

interface ITrackTimingCache {
  [key: string]: ITrackTiming[];
}

export class SubtitlesExtension extends Module {
  public name: string = 'SubtitlesExtension';

  private timingsCache: ITrackTimingCache = {};

  private timings: ITrackTiming[] = null;

  private activeTiming: ITrackTiming = null;

  private currentTimeMs: number = 0;

  constructor(instance: IInstance) {
    super(instance);

    this.instance.on(Events.PLAYER_STATE_TIMEUPDATE, this.onTimeUpdate);
  }

  onTimeUpdate = data => {
    this.currentTimeMs = data.currentTime * 1000;

    if (this.timings) {
      this.selectActiveTiming();
    }
  };

  private selectActiveTiming() {
    let activeTiming: ITrackTiming = null;

    if (this.timings) {
      const timing = this.timings.find(track =>
        this.currentTimeMs >= track.start && this.currentTimeMs < track.end,
      );

      if (timing) {
        activeTiming = timing;
      }
    }

    if (activeTiming !== this.activeTiming) {
      this.activeTiming = activeTiming;

      this.emit(Events.PLAYER_STATE_SUBTITLETEXTCHANGE, {
        text: activeTiming ? activeTiming.text : null,
      } as ISubtitleTextChangeEventData);
    }
  }

  private setActiveTimings(timings: ITrackTiming[]) {
    this.timings = timings;
    this.selectActiveTiming();
  }

  private async parseSubtitleFile(url: string): Promise<ITrackTiming[]> {
    const log = this.instance.log('SubtitlesExtension.parseSubtitleFile');

    if (!this.timingsCache[url]) {
      try {
        const content = await fetch(url).then(response => response.text());
        this.timingsCache[url] = SubtitleParser.parse(content);
        log(`Parsed ${url}`, { trackTimings: this.timingsCache[url] });
      } catch (error) {
        this.timingsCache[url] = [];
        log(`Failed to parse ${url}`);
      }
    }

    return this.timingsCache[url];
  }

  public async setSubtitle(srclang: string) {
    const subtitle =
      this.instance.config.subtitles.find(
        subtitle => subtitle.srclang === srclang,
      ) || null;

    this.emit(Events.PLAYER_STATE_SUBTITLECHANGE, {
      subtitle,
    } as ISubtitleChangeEventData);

    if (!srclang) {
      this.setActiveTimings(null);
    } else {
      const subtitle = this.instance.config.subtitles
        .find(subtitle => subtitle.srclang === srclang);

      if (!subtitle) {
        this.setActiveTimings(null);
        return;
      }

      const timings = await this.parseSubtitleFile(subtitle.src);
      this.setActiveTimings(timings);
    }
  }
}
