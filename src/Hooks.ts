import { Hook, HookActions } from '@src/types';

export class Hooks {
  public hooks: Hook[] = [];

  public create(hook: Hook) {
    this.hooks.push(hook);
  }

  public canExecute(name: string, ...args: any) {
    const selectedHooks: Hook[] = this.hooks.filter(hook => hook.name === name);

    for (const hook of selectedHooks) {
      const action: HookActions = hook.method(...args);

      if (action === HookActions.ABORT) {
        return false;
      }
    }

    return true;
  }
}
