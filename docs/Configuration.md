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

#### MPEG-DASH

```javascript
{
  ...
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
  ui: true,
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
  ...
  sources: [
    // Play a Dash manifest
    {
      type: 'hls',
      src: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    },
  ],
}
```

<div class="sample-player" data-optin="1">
{
  ui: true,
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
  ...
  sources: [
    // Play a Dash manifest
    {
      type: 'mp4',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  ],
}
```

<div class="sample-player" data-optin="1">
{
  ui: true,
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
  ...
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
  ui: true,
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

!> **Disable your adblocker** before you run the sample.

<div class="sample-player" data-optin="1">
{
  ui: true,
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
  ...
  googleIMA: {
    src: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpost&cmsid=496&vid=short_onecue&correlator=',
  },
}
```

!> **Disable your adblocker** before you run the sample.

<div class="sample-player" data-optin="1">
{
  ui: true,
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