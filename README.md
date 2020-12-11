**Note:** Due to other commitments, I'm having a hard time responding to issues (& actually getting them fixed for you guys). I'd be more than happy to accept PR's.

<p align="center">
  <a href="https://github.com/matvp91/indigo-player">
    <img align="center" src="https://raw.githubusercontent.com/matvp91/indigo-player/master/docs/indigo-player.png">
  </a>
</p>

# indigo-player

Highly extensible, modern, JavaScript player. 👊

![Travis CI](https://img.shields.io/travis/matvp91/indigo-player/master.svg)
[![](https://img.shields.io/npm/v/indigo-player.svg)](https://www.npmjs.com/package/indigo-player)
[![](https://img.shields.io/github/license/matvp91/indigo-player.svg)](https://github.com/matvp91/indigo-player)
[![](https://img.shields.io/snyk/vulnerabilities/github/matvp91/indigo-player.svg)](https://github.com/matvp91/indigo-player)
[![](https://img.shields.io/npm/types/indigo-player.svg)](https://www.npmjs.com/package/indigo-player)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hy/indigo-player)

* **Strict defined API**, which makes it easy to build analytics and various other plugins on top of indigo-player.
* **Dynamic bundle loading**, automatically determines and loads which modules are needed for playback.
* **Highly modular** plugin system to extend functionality without modifying it's core.
* **Out-of-the-box** features such as subtitles, thumbnails, quality selection if applicable, ...
* **React** based UI.

<p align="center">
  <a href="https://github.com/matvp91/indigo-player">
    <img align="center" src="https://raw.githubusercontent.com/matvp91/indigo-player/master/docs/indigo-player-screencap.png">
  </a>
</p>

## Documentation

Visit the [documentation](https://matvp91.github.io/indigo-player). 😎

## Getting started

**In a browser**

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

**As a module in your bundle**

The example below will add `indigo-player` as a module in your project.

```
yarn add indigo-player
```

```
npm i indigo-player
```

```javascript
import IndigoPlayer from "indigo-player";
// Bundle the css file too, or provide your own.
import "indigo-player/lib/indigo-theme.css";

const player = IndigoPlayer.init(container, config);
```

## Mentions
Much ❤️ on getting the word out!
* [Hacker News](https://news.ycombinator.com/item?id=18939145)
* [codrops Collective 503](https://tympanus.net/codrops/collective/collective-503/)
* [Smashing Magazine](https://twitter.com/smashingmag/status/1095001768365252608)
* [Web Design Weekly #345](https://web-design-weekly.com/2019/02/12/web-design-weekly-345/)
* Let me know!

## Cheers 🍺
* [@ambroos](https://github.com/ambroos) for being a video nerd!
* [@google](https://github.com/google) for maintaining [shaka-player](https://github.com/google/shaka-player)
* [@video-dev](https://github.com/video-dev) for maintaining [hls.js](https://github.com/video-dev/hls.js/)
