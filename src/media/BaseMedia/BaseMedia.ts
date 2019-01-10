import { Media } from '@src/media/Media';

export class BaseMedia extends Media {
  public name: string = 'BaseMedia';

  public async load() {
    await super.load();

    this.instance.player.setSource(this.instance.format.src);
  }
}
