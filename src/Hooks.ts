import { IHooks, IModule, NextHook } from '@src/types';
import filter from 'lodash/filter';

interface IHook {
  name: string;
  callback: NextHook;
}

/**
 * @Hookable
 * Decorator to let a class know that methods inside can
 * be hooked.
 */
export function Hookable<T extends new (...args: any[]) => {}>(constructor: T) {
  return class extends constructor {
    public hooks = new Hooks((this as unknown) as IModule);
  };
}

class Hooks implements IHooks {
  private module: IModule;

  private hooks: IHook[] = [];

  private origFunctions: any = {};

  constructor(module: IModule) {
    this.module = module;
  }

  public create(name: string, callback: NextHook) {
    this.hookFunction(name);

    this.hooks.push({
      name,
      callback,
    });
  }

  private hookFunction(name: string) {
    if (typeof this.module[name] !== 'function') {
      throw new Error(
        `The method "${name}" does not exist in ${
          this.module.constructor.name
        }`,
      );
    }

    if (this.origFunctions[name]) {
      return;
    }

    // Store the original function and apply a hook.
    this.origFunctions[name] = this.module[name];
    this.module[name] = this.hookedFunction(name);
  }

  private hookedFunction = (name: string) => (...args: any) => {
    const selectedHooks = filter(this.hooks, { name });
    let index = -1;

    const runOrigFunction = () =>
      this.origFunctions[name].call(this.module, ...args);

    const runNextHook = () => {
      const hook = selectedHooks[(index += 1)];

      // If we have no hook to call anymore, call the original function.
      if (!hook) {
        runOrigFunction();
        return;
      }

      let proceed = false;
      const next = () => {
        proceed = true;
      };

      // We've got a hook to call, call it.
      hook.callback.call(null, next, ...args);

      // Did the hook proceed?
      if (proceed) {
        runNextHook();
      }
    };

    runNextHook();
  };
}
