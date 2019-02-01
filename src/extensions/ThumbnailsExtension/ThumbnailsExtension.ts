import { Module } from '@src/Module';
import { Events, IEventData, IInstance, IThumbnail } from '@src/types';
import parse from 'url-parse';
import vttToJson from 'vtt-to-json';

export class ThumbnailsExtension extends Module {
  public name: string = 'ThumbnailsExtension';

  private thumbnails: IThumbnail[] = [];

  constructor(instance: IInstance) {
    super(instance);

    this.load();
  }

  public async load() {
    const file = this.instance.config.thumbnails;

    const response = await fetch(file);
    const data = await response.text();

    const json = await vttToJson(data);

    this.thumbnails = json
      .map(item => {
        const url = parse(item.part);
        const parts = parse(url.hash.replace('#', '?'), true);
        const [x, y, width, height] = parts.query.xywh.split(',').map(Number);

        url.set('hash', null);
        const src = url.toString();

        return {
          start: Math.trunc(item.start / 1000),
          src,
          x,
          y,
          width,
          height,
        };
      })
      .sort((a, b) => b.start - a.start);
  }

  public getThumbnail(seconds: number): IThumbnail {
    return this.thumbnails.find(thumbnail => thumbnail.start <= seconds);
  }
}
