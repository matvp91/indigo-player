import { Module } from '@src/Module';
import { IController, ITrack, ErrorCodes } from '@src/types';
import { PlayerError } from '@src/PlayerError';

export class Controller extends Module implements IController {
  public async load() {}

  public unload() {}

  public play() {}

  public pause() {}

  public seekTo(time: number) {}

  public setVolume(volume: number) {}

  public selectTrack(track: ITrack) {}

  public setPlaybackRate(playbackRate: number) {}
}
