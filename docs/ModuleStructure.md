# Module structure

This page should get you familiar with the structure of the player and the different type of modules. The entire player base consists of multiple modules and each module has it's own set of events. In order to proceed, it is important to keep the following structure in mind:

`instance` → `controller` → `media` → `player base`

`instance` → `controller` → `extensions`

It's best to browse the source code and get yourself familiar with the code base.

## Module types

### Controller

This is the highest level of all module types. There is a small chance you'll have to write your own controller but the API is available anyways.

* Example 1) In order to play a video, we need to fetch the streams from somewhere. We can inherit the `async controller.load()` method in order to populate the config with the proper streams.
* Example 2) A third party SDK requires it's own implementation of `controller.play()` and various other methods.

Each controller module inherits the base Controller class, it provides a basic set of functionality (such as loading the proper player & media): https://github.com/matvp91/indigo-player/blob/master/src/controller/Controller.ts

### Media

Media provides support for multiple formats (eg: MPEG-Dash / HLS / ...).

* Example 1) We have a MPEG-Dash format, but the browser does not natively support Dash playback. This is the reason we create a Dash Media module that implements Shaka Player.
* Example 2) HLS cannot be played natively on Chrome / Firefox / Edge, thus we create a HLS Media module that implements HLS.js in order to provide HLS playback.

Each media module inherits the base Media class, it provides a basic set of functionality: https://github.com/matvp91/indigo-player/blob/master/src/media/Media.ts

### Player

This is the lowest level of all module types.  By default, the HTML5 video element is used to play video in the browser.

* Example 1) A player module could be built to load an underlying Flash player, in order to support Windows 7 + IE11 + DRM.
* Example 2) Using Silverlight as the underlying video player (this is merely an example, nobody will do this obviously...).

Each player module inherits the base Player class, this is merely an interface of the methods that need to be implemented by the actual player: https://github.com/matvp91/indigo-player/blob/master/src/player/Player.ts

### Extension

Extensions are used to, well, extend functionality. They can hook into the controller, the media or the player and they can manipulate methods.

* Example 1) Implement the fullscreen API in the player.
* Example 2) Create support for an ad provider (Google IMA / FreeWheel / ...).

## Module loader

Each module must have it's own module loader. The sole purpose of the module loader is to figure out if the module needs to be loaded or not. And if it has to be loaded, it will provide an instance of the module.

Let's take the BaseModule loader as an example:

```javascript
import { Instance } from '@src/Instance';
import { BaseMedia } from '@src/media/BaseMedia/BaseMedia';
import {
  Format,
  FormatTypes,
  ModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

export const BaseMediaLoader = {
  // Let the player know which module type we're about to load
  type: ModuleLoaderTypes.MEDIA,

  // Only when isSupported(...) below is true, 
  // the create function will be executed and 
  // it is only responsible for providing an instance of the module.
  create: (instance: Instance) => new BaseMedia(instance),

  // ---OR--- create a chunk and return the instance asynchronously.
  // IMPORTANT: IF YOU LOAD AS A CHUNK, REMOVE THE IMPORT 
  //            AT THE TOP OF THE FILE 
  //            (or it will not be chunked but included right away).
  create: async (instance: Instance) => {
    const { BaseMedia } = await import('@src/media/BaseMedia/BaseMedia');
    return new BaseMedia(instance);
  },

  // isSupported(...) will decided whether we need to create the module or not. 
  // If false is returned, the player will ignore this module.
  isSupported: (instance: Instance, format: Format): boolean => {
    if (format.type === FormatTypes.MP4 || format.type === FormatTypes.MOV) {
      return true;
    }
    return false;
  },
} as ModuleLoader<BaseMedia>;
```

The implementation in the player can be found here: https://github.com/matvp91/indigo-player/blob/master/src/media/BaseMedia/BaseMediaLoader.ts

Or if you'd like to see an async (chunked) implementation: https://github.com/matvp91/indigo-player/blob/master/src/media/HlsMedia/HlsMediaLoader.ts