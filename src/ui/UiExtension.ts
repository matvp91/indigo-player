import { Module } from '@src/Module';
import { Events, IInstance } from '@src/types';
import { render } from '@src/ui/render';

declare var __webpack_public_path__: string;

let loadedThemeStylesheet = false;

export class UiExtension extends Module {
  public name: string = 'UiExtension';

  constructor(instance: IInstance) {
    super(instance);

    this.setTheme();

    const container = this.instance.container.querySelector(
      '.ig-ui',
    ) as HTMLElement;

    this.instance.on(Events.STATE_CHANGE, state =>
      render(container, state, this.instance),
    );
  }

  setTheme() {
    if (this.instance.config.ui.ignoreStylesheet || loadedThemeStylesheet) {
      return;
    }

    const hasThemeStylesheet = !!document.body.querySelector('link[data-indigo]');
    if (hasThemeStylesheet) {
      return;
    }

    loadedThemeStylesheet = true;

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', `${__webpack_public_path__}indigo-theme.css`);
    link.setAttribute('data-indigo', 'internal');
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}
