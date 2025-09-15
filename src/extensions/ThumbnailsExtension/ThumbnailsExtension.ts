
// import BIFParser from './BIFParser';

import urlParse from 'url-parse';
import vttToJson from 'vtt-to-json';
import { Module } from '../../Module';
import { IThumbnail } from '../../types';
import { IInstance } from '../../types/IInstance';

export class ThumbnailsExtension extends Module {
  public name: string = 'ThumbnailsExtension';

  private thumbnails: IThumbnail[] = [];

  private extension: string | undefined = '';

  // private bifParser: BIFParser;

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
        const url = (urlParse as any)(item.part);
        const parts = (urlParse as any)(url.hash.replace('#', '?'), true);
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

  // private async loadBifThumbs(file) {
  //   const response = await fetch(file);
  //   const data = await response.arrayBuffer();

  //   // Since we already have functionality to grab the bif image that we
  //   // need at a given second, we are only prepping the parser class and
  //   // do not need to create an array of thumbs
  //   // this.bifParser = new BIFParser(data);
  // }

  public async load() {
    if (!this.instance.config.thumbnails?.src) return;

    const file = this.instance.config.thumbnails.src;

    // Get the file extension for conditional processing
    this.extension = file.split('.').pop();

    if (this.extension === 'vtt') {
      this.loadVttThumbs(file);
    } else if (this.extension === 'bif') {
      // this.loadBifThumbs(file);
    } else {
      // We shouldn't get here, but still
      this.instance.log('ThumbnailsExtension')(
        'Invalid file type passed for thumbnails. Acceptable file types: vtt, bif',
      );
    }
  }

  public getThumbnail(seconds: number): IThumbnail | null {
    if (this.extension === 'vtt' && this.thumbnails.length > 0) {
      return this.thumbnails.find(thumbnail => thumbnail.start <= seconds) || null;
    } else if (this.extension === 'bif') {
      return null;
      // return this.bifParser.getImageDataAtSecond(seconds) as IThumbnail;
    } else {
      return null;
    }
  }
}
