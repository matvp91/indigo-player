import { Events, IInstance } from '@src/types';
import { IData } from '@src/ui/types';

export function triggerEvent(
  instance: IInstance,
  data: IData,
  prevData: IData,
) {
  if (!prevData) {
    return;
  }

  // Trigger the controls visibility.
  if (data.visibleControls && !prevData.visibleControls) {
    instance.emit(Events.UI_VISIBLECONTROLS_CHANGE, {
      visibleControls: true,
    });
  } else if (!data.visibleControls && prevData.visibleControls) {
    instance.emit(Events.UI_VISIBLECONTROLS_CHANGE, {
      visibleControls: false,
    });
  }
}
