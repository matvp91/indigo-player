import { Module } from '@src/Module';
import { Events, IEventData, IInstance, IThumbnail } from '@src/types';
import { BIFParser as BIFParserClass } from './ThumbnailsExtensionBifParser';
import parse from 'url-parse';
import vttToJson from 'vtt-to-json';

export class ThumbnailsExtension extends Module {
  public name: string = 'ThumbnailsExtension';

  private thumbnails: IThumbnail[] = [];

  constructor(instance: IInstance) {
    super(instance);

    this.load();
  }

  private async loadVttThumbs(file) {
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

  private async loadBifThumbs(file) {
    const response = await fetch(file);
    const data = await response.arrayBuffer();

    const BifParser = new BIFParserClass(data);
    const imgs = BifParser.getImageData();

    this.thumbnails = imgs
      .map(item => {
        const { start, src, x, y, width, height } = item;
        return {
          start,
          src,
          x,
          y,
          width,
          height,
        };
      })
      .sort((a, b) => b.start - a.start);
  }

  public async load() {
    const file = this.instance.config.thumbnails.src;
    // Get the file extension for conditional processing
    const ext = file.split(".").pop();

    if (ext === "vtt") {
      this.loadVttThumbs(file);
    } else if (ext === "bif") {
      this.loadBifThumbs(file);
    } else {
      // We shouldn't get here, but still
      console.warn("Invalid file type passed for thumbnails. Acceptable file types: vtt, bif");
    }
  }

  public getThumbnail(seconds: number): IThumbnail {
    return this.thumbnails.find(thumbnail => thumbnail.start <= seconds);
  }
}
