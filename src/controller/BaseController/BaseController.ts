import { Controller } from '@src/controller/Controller';
import { PlayerError } from '@src/PlayerError';
import { selectMedia, selectPlayer } from '@src/selectModule';
import { ErrorCodes, ITrack } from '@src/types';

export class BaseController extends Controller {
  public name: string = 'BaseController';

  public async load() {
    this.instance.player = await selectPlayer(this.instance);

    const [format, media] = await selectMedia(this.instance);
    if (!media) {
      throw new PlayerError(ErrorCodes.NO_SUPPORTED_FORMAT_FOUND);
    }

    this.instance.format = format;
    this.instance.media = media;

    this.instance.player.load();
    await this.instance.media.load();
  }

  public unload() {
    if (this.instance.media) {
      this.instance.media.unload();
    }
    if (this.instance.player) {
      this.instance.player.unload();
    }
  }

  public play() {
    this.instance.media.play();
  }

  public pause() {
    this.instance.media.pause();
  }

  public seekTo(time: number) {
    this.instance.media.seekTo(time);
  }

  public setVolume(volume: number) {
    this.instance.media.setVolume(volume);
  }

  public selectTrack(track: ITrack) {
    this.instance.media.selectTrack(track);
  }

  public selectAudioLanguage(language: string) {
    this.instance.media.selectAudioLanguage(language);
  }

  public setPlaybackRate(playbackRate: number) {
    this.instance.media.setPlaybackRate(playbackRate);
  }
}
