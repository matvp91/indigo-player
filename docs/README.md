# Hello!

**indigo-player** is an **extensible**, **modern**, JavaScript player. With our module system, it's childsplay for developers to add their own logic. Whether it's ads, custom business rules or supporting a new stream format, this documentation should get you started in no time.

## Hosting

* unpkg.com: https://unpkg.com/indigo-player/lib/indigo-player.js
* by using your own host:
  * 1) Let's say you host it at *https://mysite.com/js/indigo-player.js*,
  * 2) Make sure you set *IndigoPlayer.setChunksPath('https://mysite.com/js/')** before calling `init(...)` as the chunks path.

## Basic example

The example below will load a simple MP4 file, and attempt to autoplay it. In order to interact with the player, you can use the `player` object returned when initializing indigo-player.

```javascript
<html>
  <body>
    <script src="https://unpkg.com/indigo-player/lib/indigo-player.js"></script>
    <script>
      const config = {
        autoplay: false,
        sources: [
          {
            type: 'mp4',
            src: 'https://samples.com/BigBuckBunny.mp4',
          }
        ],
      };

      const element = document.getElementById('player');
      const player = IndigoPlayer.init(element, config);
    </script>
  </body>
</html>
```

<div class="sample-player" data-expose-player="player">
{
  autoplay: false,
  showNativeControls: true,
  sources: [
    {
      type: 'mp4',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ],
}
</div>

**Note:** Open up the console, and use `window.player` to interact with the player above.

## Features

* **media** - mp4
* **media** - Dash (+ DRM / Widevine & PlayReady) - *shaka-player*
* **media** - HLS - *hls.js*
* **media** - Native HLS (+ FairPlay) - *work in progress*
* **player** - HTML5 video element
* **ads** - FreeWheel (client-side)
* **misc** - Fullscreen

## Supported browsers

* Chrome 71+
* Firefox 64+
* Edge 44+ on Windows 10
* IE11 on Windows 7 except for DRM content