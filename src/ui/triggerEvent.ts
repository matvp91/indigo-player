import { Events, IInstance } from '@src/types';
import { IData } from '@src/ui/types';

const createEventQueue = (instance: IInstance, { state, prevState }) => (eventName: string, data: any) => {
  instance.emit(eventName, data);
  instance.emit(Events.UI_STATE_CHANGE, {
    state,
    prevState,
  });
};

export function triggerEvent(
  instance: IInstance,
  data: IData,
  prevData: IData,
) {
  if (!prevData) {
    return;
  }

  const eventQueue:{ eventName: string, data: any }[] = [];
  const queueEvent = (eventName: string, data?: any) => {
    eventQueue.push({ eventName, data });
  };

  // UI state management

  // Trigger the controls visibility.
  if (data.visibleControls && !prevData.visibleControls) {
    queueEvent(Events.UI_VISIBLECONTROLS_CHANGE, {
      visibleControls: true,
    });
  } else if (!data.visibleControls && prevData.visibleControls) {
    queueEvent(Events.UI_VISIBLECONTROLS_CHANGE, {
      visibleControls: false,
    });
  }

  if (data.view !== prevData.view) {
    queueEvent(Events.UI_VIEW_CHANGE, {
      view: data.view,
    });
  }

  // Release the queue
  if (Boolean(eventQueue.length)) {
    eventQueue.forEach(({ eventName, data }) => {
      instance.emit(eventName, data);
    });

    instance.emit(Events.UI_STATE_CHANGE, {
      state: data,
      prevState: prevData,
    });
  }

  // Extension triggers

  // Trigger subtitles to move up.
  const subtitlesExtension = instance.getModule('SubtitlesExtension');
  if (subtitlesExtension) {
    if (data.visibleControls && !prevData.visibleControls) {
      (subtitlesExtension as any).setOffset(42);
    } else if (!data.visibleControls && prevData.visibleControls) {
      (subtitlesExtension as any).setOffset(0);
    }
  }
}
