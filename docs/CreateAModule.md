# Create a module

!> **This is a beta feature**. Small changes can happen in the future before marked as stable.

?> You can start with the example project: https://github.com/matvp91/indigo-player-extension-example

Registering your own module within the player is one of the core principles of indigo-player. We aim to make it as easy as possible for developers to extend functionality as plugins, or as we call them, modules. A detailed explanation of a module structure can be found [here](./ModuleStructure.md).

A custom module is hosted on your own GitHub account, published on npm and is versioned. Once published on npm, the awesome jsdeliver CDN makes it automatically available for others to integrate.

The following format is suggested: `indigo-player-<type>-<name>`. For example: indigo-player-extension-drmtoday, indigo-player-media-dashjs

## Prerequisites

* A TypeScript project with a bundler, we use webpack.
* A basic webpack config.

## Setup

Add the latest version to your project, which includes the `addModuleLoader(moduleLoader: IModuleLoader)` API. 

```
npm install indigo-player
```

You don't want to bundle indigo-player player in your custom module, but merely reference it. Add the following external to your `webpack.config.js` file:

```javascript
module.exports = {
  ...
  externals: {
    'indigo-player': 'IndigoPlayer',
  },
};
```

Make sure you load your module **after** loading indigo-player.js. If the global `IndigoPlayer` variable is not available when your module executes, it's not going to register the module and you'll see an error.

```html
<html>
  <body>
    <div id="playerContainer"></div>
    <script src="https://cdn.jsdelivr.net/npm/indigo-player@1/lib/indigo-player.js"></script>
    <script src="./indigo-player-custom-extension.js"></script>
    <script>
      const config = {
        sources: [
          {
            type: 'mp4',
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }
        ],
      };

      const element = document.getElementById('playerContainer');
      const player = IndigoPlayer.init(element, config);
    </script>
  </body>
</html>
```

## Write your module

Now we're ready to start developing a custom module. Your entry file will be responsible for registering the module loader and your module loader will load the module. In the example below, we will create a custom extension with the following use case:

> When the user clicks on the play button, we want to confirm that the user actually wants to play by asking the question.

##### 1. ExampleExtension.ts

Let's start by writing our extension:

```typescript
import { Module, Events, IInstance } from 'indigo-player';

export class ExampleExtension extends Module {
  public name: string = 'ExampleExtension';

  constructor(instance: IInstance) {
    super(instance);

    instance.controller.hooks.create('play', this.onControllerPlay.bind(this));
  }

  onControllerPlay(next) {
    const confirmStart = (window as any).confirm('Do you really want to play?');
    if (confirmStart) {
      next();
    }
  }
}
```

##### 2. ExampleExtensionLoader.ts

Now we need to create a loader that is responsible for loading our extension inside of the player.

```typescript
import { Config, ModuleLoaderTypes } from 'indigo-player';
import { ExampleExtension } from './ExampleExtension';

export const ExampleExtensionLoader = {
  // We're going to write a custom extension, 
  // you can also use MEDIA, CONTROLLER or PLAYER here.
  type: ModuleLoaderTypes.EXTENSION,

  create: instance => new ExampleExtension(instance),

  // Let's always load our extension. You can add additional logic here whether
  // or not the extension is supported.
  isSupported: ({ config: Config }): boolean => true,
};
```

##### 3. index.ts

Finally, let's register the module loader in the entry point of our package.

```typescript
import { ExampleExtensionLoader } from './ExampleExtensionLoader';
import { addModuleLoader } from 'indigo-player';

addModuleLoader(ExampleExtensionLoader);
```

If you need more references, take a look at the default extensions, media and controllers shipped with the indigo-player core.

* Extensions: https://github.com/matvp91/indigo-player/tree/master/src/extensions
* Media: https://github.com/matvp91/indigo-player/tree/master/src/media
* Player: https://github.com/matvp91/indigo-player/tree/master/src/player
* Controllers: https://github.com/matvp91/indigo-player/tree/master/src/controller