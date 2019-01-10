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

### Sources

Set one or multiple sources of your video asset. indigo-player will take the first format in the list where browser support is positive. When formats are DRM protected, multiple sources are needed to cover Widevine & PlayReady (DASH) - Chrome/FF/Edge and FairPlay (HLS) - Safari.

```javascript
{
  ...
  sources: [
    // Play a Dash manifest
    {
      type: 'dash',
      src: 'https://samples.com/dash.mpd',
    },
    // OR Play a HLS manifest
    {
      type: 'hls',
      src: 'https://samples.com/hls.m3u8',
    },
    // OR Play a simple mp4 file
    {
      type: 'mp4',
      src: 'https://samples.com/video.mp4',
    },
    // OR Play a webm file
    {
      type: 'webm',
      src: 'https://samples.com/video.webm',
    },
  ],
}
```

#### Dash DRM (Widevine & PlayReady)

With DRM encrypted content, provide the license URL for both Widevine and PlayReady.

```javascript
{
  ...
  sources: [
    {
      type: 'dash',
      src: 'https://drm.samples.com/dash.mpd',
      drm: {
        widevine: {
          licenseUrl: 'https://widevine.samples.com/proxy',
        },
        playready: {
          licenseUrl: 'https://playready.samples.com/rightsmanager.asmx',
        },
      },
    },
    ...
  ],
}
```

#### Native HLS DRM (FairPlay)

Work in progress.

### Captions

Provide the WebVTT files with their configuration in order to provide subtitles.

```javascript
{
  ...
  captions: [
    {
      label: 'English',
      srclang: 'en',
      src: './subtitles/en-subs.vtt',
    },
    ...
  ],
}
```

### Advertising

The following advertisement providers are supported:

#### FreeWheel (client-side)

Before you start, you must load the `AdManager.js` (https://mssl.fwmrm.net/libs/adm/6.00.0/AdManager.js) file from FreeWheel **before** the `indigo-player.js` file is loaded. If this is not the case, indig-player will simply ignore the ads configuration you provide.

```javascript
{
  ...
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