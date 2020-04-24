# Configuration

In order to start the player, provide a config object to `IndigoPlayer.init(element, config)`. You'll get a `player` object in return, which can be used to interact with the player.

### Autoplay

The player will attempt to autoplay the content. Most browsers have autoplay blocking in place nowadays, keep in mind, autoplay might still fail even though it's present in the config. The `READY` event will let you know if autoplay failed.

```javascript
{
  autoplay: true,
  sources: [...],
}
```

### Aspect ratio

Changes the aspect ratio of the player container. Must be entered as the `x/y` ratio.

```javascript
{
  aspectRatio: 16/9, // 16/9, 4/3, 9/16, ...
  sources: [...],
}
```

### Initial volume & position

The following configuration sets the initial volume and position.

```javascript
{
  volume: 0.5, // Start with 50% volume, if set to 0, the video will start muted.
  startPosition: 20, // Start a 20 seconds in the content
  sources: [...],
}
```

The following example starts the video muted and at a start position of 2 minutes.

<div class="sample-player" data-optin="1">
{
  volume: 0,
  startPosition: 120,
  sources: [
    {
      type: 'mp4',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ],
}
</div>

### Sources

Set one or multiple sources of your video asset. indigo-player will take the first format in the list where browser support is positive. When formats are DRM protected, multiple sources are needed to cover Widevine & PlayReady (DASH) - Chrome/FF/Edge and FairPlay (HLS) - Safari.

#### MPEG-DASH

```javascript
{
  sources: [
    // Play a Dash manifest
    {
      type: 'dash',
      src: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
    },
  ],
}
```

<div class="sample-player" data-optin="1">
{
  sources: [
    {
      type: 'dash',
      src: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
    },
  ],
}
</div>

#### HLS

```javascript
{
  sources: [
    // Play an HLS manifest
    {
      type: 'hls',
      src: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    },
  ],
}
```

<div class="sample-player" data-optin="1">
{
  sources: [
    {
      type: 'hls',
      src: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    },
  ],
}
</div>

#### MP4

```javascript
{
  sources: [
    // Play an MP4 file
    {
      type: 'mp4',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ],
}
```

<div class="sample-player" data-optin="1">
{
  sources: [
    {
      type: 'mp4',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ],
}
</div>

#### MPEG-DASH + DRM (Widevine & PlayReady)

```javascript
{
  sources: [
    // Play a Dash manifest
    {
      type: 'dash',
      src: 'https://amssamples.streaming.mediaservices.windows.net/622b189f-ec39-43f2-93a2-201ac4e31ce1/BigBuckBunny.ism/manifest(format=mpd-time-csf)',
      drm: {
        widevine: {
          licenseUrl: 'https://amssamples.keydelivery.mediaservices.windows.net/Widevine/?KID=1ab45440-532c-4399-94dc-5c5ad9584bac',
        },
        playready: {
          licenseUrl: 'https://amssamples.keydelivery.mediaservices.windows.net/PlayReady/',
        },
      },
    },
  ],
}
```

<div class="sample-player" data-optin="1">
{
  sources: [
    {
      type: 'dash',
      src: 'https://amssamples.streaming.mediaservices.windows.net/622b189f-ec39-43f2-93a2-201ac4e31ce1/BigBuckBunny.ism/manifest(format=mpd-time-csf)',
      drm: {
        widevine: {
          licenseUrl: 'https://amssamples.keydelivery.mediaservices.windows.net/Widevine/?KID=1ab45440-532c-4399-94dc-5c5ad9584bac',
        },
        playready: {
          licenseUrl: 'https://amssamples.keydelivery.mediaservices.windows.net/PlayReady/',
        },
      },
    },
  ],
}
</div>

#### HLS + DRM (FairPlay)

Work in progress.

### Advertising

The following advertisement providers are supported:

#### FreeWheel (client-side)

Before you start, you must load the `AdManager.js` (https://mssl.fwmrm.net/libs/adm/6.00.0/AdManager.js) file from FreeWheel **before** the `indigo-player.js` file is loaded. If this is not the case, indig-player will simply ignore the ads configuration you provide.

```javascript
{
  freewheel: {
    clientSide: true,
    network: 96749,
    server: 'https://demo.v.fwmrm.net/ad/g/1',
    videoAsset: 'DemoVideoGroup.01',
    duration: 1337,
    siteSection: 'DemoSiteGroup.01',
    profile: 'global-js',
    // The following cuepoints play a preroll, a midroll at 20s and a postroll.
    cuepoints: ['preroll', 20, 'postroll'],
  },
}
```

!> **Disable your adblocker** before you run the sample.

!> FreeWheel seems to serve some ads over http in their demo configuration above, some ads may not be seen. It's best to give this a try with your own parameters. **When ads fail to fetch / play, the player will continue the content**.

<div class="sample-player" data-optin="1">
{
  freewheel: {
    clientSide: true,
    network: 96749,
    server: 'https://demo.v.fwmrm.net/ad/g/1',
    videoAsset: 'DemoVideoGroup.01',
    duration: 1337,
    siteSection: 'DemoSiteGroup.01',
    profile: 'global-js',
    cuepoints: ['preroll', 20, 'postroll'],
  },
  sources: [
    {
      type: 'mp4',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ],
}
</div>

#### Google IMA (client-side)

Before you start, you must load the `ima3.js` (https://imasdk.googleapis.com/js/sdkloader/ima3.js) file from Google **before** the `indigo-player.js` file is loaded. If this is not the case, indig-player will simply ignore the ads configuration you provide.

```javascript
{
  googleIMA: {
    src: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=',
  },
}
```

!> **Disable your adblocker** before you run the sample.

<div class="sample-player" data-optin="1">
{
  googleIMA: {
    src: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=',
  },
  sources: [
    {
      type: 'mp4',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ],
}
</div>

### Subtitles

Provide the WebVTT files with their configuration in order to provide subtitles.

```javascript
{
  sources: [
    {
      type: 'mp4',
      src: 'https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4',
    },
  ],
  subtitles: [
    {
      label: 'English',
      srclang: 'en',
      src: 'https://iandevlin.github.io/mdn/video-player-with-captions/subtitles/vtt/sintel-en.vtt',
    },
    {
      label: 'German',
      srclang: 'de',
      src: 'https://iandevlin.github.io/mdn/video-player-with-captions/subtitles/vtt/sintel-de.vtt',
    },
    {
      label: 'Spanish',
      srclang: 'es',
      src: 'https://iandevlin.github.io/mdn/video-player-with-captions/subtitles/vtt/sintel-es.vtt',
    },
  ],
}
```

<div class="sample-player" data-optin="1">
{
  sources: [
    {
      type: 'mp4',
      src: 'https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4',
    },
  ],
  subtitles: [
    {
      label: 'English',
      srclang: 'en',
      src: 'https://iandevlin.github.io/mdn/video-player-with-captions/subtitles/vtt/sintel-en.vtt',
    },
    {
      label: 'German',
      srclang: 'de',
      src: 'https://iandevlin.github.io/mdn/video-player-with-captions/subtitles/vtt/sintel-de.vtt',
    },
    {
      label: 'Spanish',
      srclang: 'es',
      src: 'https://iandevlin.github.io/mdn/video-player-with-captions/subtitles/vtt/sintel-es.vtt',
    },
  ],
}
</div>

### Thumbnails

Thumbnails are displayed in the tooltip when seeking or hovering over the seekbar. When you are seeking, the tooltip is also shown in the background (giving the user a better user experience when seeking). In order to display thumbnails, you must have a WebVTT file including a reference to a sprite with thumbnails, for example:

```
WEBVTT

00:00.000 --> 00:05.000
thumbnails-sprite.jpg#xywh=0,0,128,72

00:05.000 --> 00:10.000
thumbnails-sprite.jpg#xywh=128,0,128,72
```

Afterwards, configure the player to load the thumbnails vtt file:

```javascript
{
   thumbnails: {
    src: './thumbnails.vtt',
  },
}
```

<div class="sample-player" data-optin="1">
{
  thumbnails: {
    src: './player-assets/bbb-thumbnails.vtt',
  },
  sources: [
    {
      type: 'mp4',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ],
}
</div>

### UI

#### Chromeless

Disable the default UI. As a developer, you can easily create your own UI with the `STATE` events.

```javascript
{
  ui: {
    enabled: false,
  },
}
```

#### Locale

Changes the language of the player UI. You can find a list of locale's here: https://github.com/matvp91/indigo-player/blob/master/src/ui/i18n.ts

```javascript
{
  ui: {
    locale: 'nl-BE',
  },
}
```

#### Preview image

Instead of a black background or the first frame of the video element (if applicable), you can set your own preview image instead. This image will be shown as the background on the `StartView` and `LoadingView`.

```javascript
{
  ui: {
    image: 'https://example.com/my-image.png',
  },
}
```

#### Picture in Picture

Picture in picture mode will put the player container at the right bottom of the screen. You can move the PIP container by dragging it by the handle at the top of the player (your cursor should change to a drag icon).

```javascript
{
  ui: {
    pip: true, // by default, pip is not enabled in the UI.
  },
}
```

<div class="sample-player" data-optin="1">
{
  ui: {
    pip: true,
  },
  sources: [
    {
      type: 'mp4',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ],
}
</div>

### Keyboard navigation

By default, the player is controllable by using various [keyboard keys](Features.md?id=keyboard-navigation). Setting it to `focus` will only make the player controllable by keyboard controls when it has focus.

```javascript
{
  keyboardNavigation: true; // or: false, or focus.
}
```
