<p align="center">
  <a href="https://github.com/matvp91/indigo-player">
    <img align="center" src="https://raw.githubusercontent.com/matvp91/indigo-player/master/docs/indigo-player.png">
  </a>
</p>

# indigo-player

Highly extensible, modern, JavaScript player. 👊

[![](https://img.shields.io/npm/v/indigo-player.svg)](https://www.npmjs.com/package/indigo-player)
[![](https://img.shields.io/github/license/matvp91/indigo-player.svg)](https://github.com/matvp91/indigo-player)
[![](https://img.shields.io/snyk/vulnerabilities/github/matvp91/indigo-player.svg)](https://github.com/matvp91/indigo-player)
[![](https://img.shields.io/npm/types/indigo-player.svg)](https://www.npmjs.com/package/indigo-player)

**Important:** This package is under construction and although it offers a fair amount of features already, this is a work in progress. At the moment, it lacks the proper documentation but with time comes improvement.

<img width="350px" align="center" src="https://raw.githubusercontent.com/matvp91/indigo-player/master/docs/example.gif">

## Features

* Fluid mp4 playback.
* Support for Dash (+ DRM / Widevine & PlayReady). - *shaka-player*
* Support for HLS. - *hls.js*
* Advertisement support with FreeWheel.
* A modular structure that allows any developer to hook into the player logic and write custom business rules and extensions. Basically the entire player structure is built as a set of modules.
* Bundle splitting, only loads JS files (eg: HLS.js) when actually needed.

**Note:** Native HLS (+ FairPlay) is a work in progress

## Documentation

Visit the [documentation](https://matvp91.github.io/indigo-player). 😎

## Getting started

The example below will load a simple MP4 file, and attempt to autoplay it.

```javascript
<html>
  <body>
    <div id="playerContainer"></div>
    <script src="https://cdn.jsdelivr.net/npm/indigo-player@1/lib/indigo-player.js"></script>
    <script>
      const config = {
        ui: true,
        sources: [
          {
            type: 'mp4',
            src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }
        ],
      };

      const element = document.getElementById('playerContainer');
      const player = IndigoPlayer.init(element, config);

      // You can use the player object now to access the player and it's methods (play, pause, ...)
    </script>
  </body>
</html>
```

## Cheers 🍺
* [@ambroos](https://github.com/ambroos) for being a video nerd!
* [@google](https://github.com/google) for maintaining [shaka-player](https://github.com/google/shaka-player)
* [@video-dev](https://github.com/video-dev) for maintaining [hls.js](https://github.com/video-dev/hls.js/)
