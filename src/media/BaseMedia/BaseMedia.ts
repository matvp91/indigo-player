import { Media } from '@src/media/Media';

export class BaseMedia extends Media {
  public name = 'base';

  public async load() {
    await super.load();

    this.instance.player.setSource(this.instance.format.src);
  }
}
