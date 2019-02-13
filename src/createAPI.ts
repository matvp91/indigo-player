import { PlayerError } from '@src/PlayerError';
import { EventCallback, IEventData, IInstance, ITrack } from '@src/types';
import { createFunctionFn } from '@src/utils/defineProperty';

/**
 * Defines the public API, this is the return value of init().
 * @param  {IInstance} instance
 * @return {Object}   External API.
 */
export function createAPI(instance: IInstance) {
  const api: any = {};

  const createFunction = createFunctionFn(api);

  [
    // Bind listeners continuously
    [
      'on',
      (name: string, callback: EventCallback) => instance.on(name, callback),
    ],

    // Bind listeners once
    [
      'once',
      (name: string, callback: EventCallback) => instance.once(name, callback),
    ],

    // Remove a listener
    [
      'removeListener',
      (name: string, callback: EventCallback) =>
        instance.removeListener(name, callback),
    ],

    // Emit an event on the listeners
    [
      'emit',
      (name: string, eventData?: IEventData) => instance.emit(name, eventData),
    ],

    // Play
    ['play', () => instance.play()],

    // Pause
    ['pause', () => instance.pause()],

    // Seek to a time
    ['seekTo', (time: number) => instance.seekTo(time)],

    // Set the volume
    ['setVolume', (volume: number) => instance.setVolume(volume)],

    // Select a track
    ['selectTrack', (track: ITrack) => instance.selectTrack(track)],

    // Select an audio language
    [
      'selectAudioLanguage',
      (language: string) => instance.selectAudioLanguage(language),
    ],

    // Select playback rate
    [
      'setPlaybackRate',
      (playbackRate: number) => instance.setPlaybackRate(playbackRate),
    ],

    // Set a fatal error
    ['setError', (error: PlayerError) => instance.setError(error)],

    // Destroy the player
    ['destroy', () => instance.destroy()],

    // Get stats
    ['getStats', () => instance.getStats()],

    // Get a specific module by name
    ['getModule', (name: string) => instance.getModule(name)],
  ].forEach(tuple => createFunction(tuple[0], tuple[1]));

  api._getInstanceForDev = () => instance;

  return api;
}
