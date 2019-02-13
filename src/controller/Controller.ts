import { Module } from '@src/Module';
import { PlayerError } from '@src/PlayerError';
import { ErrorCodes, IController, ITrack } from '@src/types';

export class Controller extends Module implements IController {
  public async load() {}

  public unload() {}

  public play() {}

  public pause() {}

  public seekTo(time: number) {}

  public setVolume(volume: number) {}

  public selectTrack(track: ITrack) {}

  public selectAudioLanguage(language: string) {}

  public setPlaybackRate(playbackRate: number) {}
}
