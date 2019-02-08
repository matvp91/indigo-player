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

## Documentation

Visit the [documentation](https://matvp91.github.io/indigo-player). 😎

## Community

| Project | Description | Link |
| --- | --- | --- |
| Themes | A repository with themes for indigo-player. | https://github.com/matvp91/indigo-player-themes |
| Example module | If you'd like to develop your own module for indigo-player (apply own business rules, integrate an ad provider, write new media support, ...), take a look at this sample project. | https://github.com/matvp91/indigo-player-extension-example |

## Getting started

The example below will load a simple MP4 file, and attempt to autoplay it.

```html
<html>
  <body>
    <div id="playerContainer"></div>
    <script src="https://cdn.jsdelivr.net/npm/indigo-player@1/lib/indigo-player.js"></script>
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

      // You can use the player object now to access the player and it's methods (play, pause, ...)
    </script>
  </body>
</html>
```

## Cheers 🍺
* [@ambroos](https://github.com/ambroos) for being a video nerd!
* [@google](https://github.com/google) for maintaining [shaka-player](https://github.com/google/shaka-player)
* [@video-dev](https://github.com/video-dev) for maintaining [hls.js](https://github.com/video-dev/hls.js/)
