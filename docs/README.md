# Hello!

**indigo-player** is an **extensible**, **modern**, JavaScript player. With our module system, it's childsplay for developers to add their own logic. Whether it's ads, custom business rules or supporting a new stream format, this documentation should get you started in no time.

## Hosting

* jsdelivr.net: https://cdn.jsdelivr.net/npm/indigo-player/lib/indigo-player.js
* by using your own host:
  * 1) Let's say you host it at *https://mysite.com/js/indigo-player.js*,
  * 2) Make sure you set *IndigoPlayer.setChunksPath('https://mysite.com/js/')** before calling `init(...)` as the chunks path.

## Getting started

The example below will load a simple mp4 file and attempt to autoplay the video.

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

## Example

The example below will load a dash file, has demo subtitles, thumbnails, and attempt to autoplay it. In order to interact with the player, you can use the `player` object returned when initializing indigo-player.

<div class="sample-player" data-expose-player="player">
{
  sources: [
    {
      type: 'dash',
      src: 'https://amssamples.streaming.mediaservices.windows.net/683f7e47-bd83-4427-b0a3-26a6c4547782/BigBuckBunny.ism/manifest(format=mpd-time-csf)',
    },
    {
      type: 'hls',
      src: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
    },
  ],
  thumbnails: {
    src: './player-assets/bbb-thumbnails.vtt',
  },
  captions: [
    {
      label: 'English',
      srclang: 'en',
      src: './player-assets/bbb-en-subs.vtt',
    },
    {
      label: 'French',
      srclang: 'fr',
      src: './player-assets/bbb-fr-subs.vtt',
    },
    {
      label: 'German',
      srclang: 'de',
      src: './player-assets/bbb-de-subs.vtt',
    },
  ],
}
</div>

?> Open up the console, and use `window.player` to interact with the player above.

<iframe style="margin: 0; border: 0;" src="https://ghbtns.com/github-btn.html?user=matvp91&repo=indigo-player&type=star&count=true&size=medium" frameborder="0" scrolling="0" width="160px" height="30px"></iframe>


## Features

* **media** - mp4
* **media** - Dash (+ DRM / Widevine & PlayReady) - *shaka-player*
* **media** - HLS - *hls.js*
* **media** - Native HLS (+ FairPlay) - *work in progress*
* **player** - HTML5 video element
* **ads** - FreeWheel (client-side)
* **ads** - Google IMA (client-side)

## Supported browsers

* Chrome 71+
* Firefox 64+
* Edge 44+ on Windows 10
* IE11 on Windows 7 except for DRM content

Previous browser versions will most likely work because we rely heavily on feature detection based on the given configuration.