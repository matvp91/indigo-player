import { Module } from '@src/Module';
import { Events, IInstance } from '@src/types';
import { render } from '@src/ui/render';
import { IStateStore } from '@src/ui/types';
import React, { RefObject } from 'react';

declare var __webpack_public_path__: string;

let loadedThemeStylesheet = false;

export class UiExtension extends Module {
  public name: string = 'UiExtension';

  private ref: RefObject<IStateStore> = React.createRef();

  constructor(instance: IInstance) {
    super(instance);

    this.setTheme();

    const container = this.instance.container.querySelector(
      '.ig-ui',
    ) as HTMLElement;

    this.instance.on(Events.STATE_CHANGE, state =>
      render(container, state, this.instance, this.ref),
    );
  }

  private setTheme() {
    if (this.instance.config.ui.ignoreStylesheet || loadedThemeStylesheet) {
      return;
    }

    const regex: RegExp = /indigo-theme-[a-zA-Z]+\.css/;
    for (const link of Array.from(document.querySelectorAll('link'))) {
      if (regex.test(link.href)) {
        return;
      }
    }

    loadedThemeStylesheet = true;

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', `${__webpack_public_path__}indigo-theme.css`);
    link.setAttribute('data-indigo', 'internal');
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  // Provide a way for overlays to trigger a mouse move on it's own elements.
  public triggerMouseMove() {
    if (this.ref && this.ref.current) {
      this.ref.current.showControls();
    }
  }
}
