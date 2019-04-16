import { StateExtension } from '../src/extensions/StateExtension/StateExtension';
import { Instance } from './__mocks__/Instance';
import { Events, AdBreakType } from '../src/types';

/**
 * Avoid snapshotting state, we don't want tests to fail
   just because we add a state property. Explicitly stating the state value
   also makes these tests a lot more readable.
 */
let instance;
let state;
beforeEach(() => {
  instance = new Instance();
  state = new StateExtension(instance);
});

test('handle ready', () => {
  instance.emit(Events.READY);
  expect(state.getState().ready).toBe(true);
  expect(state.getState().waitingForUser).toBe(true);
  expect(instance.calledEvents).toContain(Events.STATE_READY);
});

test('handle play content', () => {
  instance.emit(Events.READY);

  instance.emit(Events.PLAYER_STATE_PLAY);
  expect(state.getState().playRequested).toBe(true);
  expect(state.getState().playing).toBe(false);
  expect(state.getState().paused).toBe(false);
  expect(state.getState().videoSessionStarted).toBe(true);
  expect(state.getState().waitingForUser).toBe(false);
  expect(instance.calledEvents).toContain(Events.STATE_PLAY_REQUESTED);
  expect(instance.calledEvents).not.toContain(Events.STATE_PLAYING);

  instance.emit(Events.PLAYER_STATE_PLAYING);
  expect(state.getState().playRequested).toBe(true);
  expect(state.getState().playing).toBe(true);
  expect(state.getState().started).toBe(true);
  expect(instance.calledEvents).toContain(Events.STATE_PLAYING);
});

test('handle pause content', () => {
  expect(state.getState().paused).toBe(false);
  instance.emit(Events.PLAYER_STATE_PAUSE);
  expect(state.getState().paused).toBe(true);
  expect(instance.calledEvents).toContain(Events.STATE_PAUSED);
  instance.emit(Events.PLAYER_STATE_PLAY);
  expect(state.getState().paused).toBe(false);
});

test('handle buffering', () => {
  expect(state.getState().buffering).toBe(false);
  instance.emit(Events.PLAYER_STATE_WAITING);
  expect(state.getState().buffering).toBe(true);
  expect(instance.calledEvents).toContain(Events.STATE_BUFFERING);
  instance.emit(Events.PLAYER_STATE_PLAYING);
  expect(state.getState().buffering).toBe(false);
});

test('handle time update', () => {
  instance.emit(Events.PLAYER_STATE_TIMEUPDATE, {
    currentTime: 20,
  });
  expect(state.getState().currentTime).toBe(20);
  expect(instance.calledEvents).toContain(Events.STATE_CURRENTTIME_CHANGE);
});

test('handle duration update', () => {
  instance.emit(Events.PLAYER_STATE_DURATIONCHANGE, {
    duration: 60,
  });
  expect(state.getState().duration).toBe(60);
  expect(instance.calledEvents).toContain(Events.STATE_DURATION_CHANGE);
});

test('content started without a preroll', () => {
  instance.emit(Events.PLAYER_STATE_PLAYING);
  expect(state.getState().contentStarted).toBe(true);
});
