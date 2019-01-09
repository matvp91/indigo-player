# Configuration

In order to start the player, provide a config object to `IndigoPlayer.init(element, config`.

#### Autoplay

The player will attempt to autoplay the content. Most browsers have autoplay blocking in place nowadays, keep in mind, autoplay might still fail even though it's present in the config. The `READY` event will let you know if autoplay failed.

```javascript
{
  autoplay: true,
  sources: [...],
}
```

#### Sources

Set one or multiple sources of your video asset. indigo-player will take the first format in the list where browser support is positive. When formats are DRM protected, multiple sources are needed to cover Widevine & PlayReady (DASH) - Chrome/FF/Edge and FairPlay (HLS) - Safari.

```javascript
{
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
  ],
}
```

##### Dash DRM (Widevine & PlayReady)

With DRM encrypted content, provide the license URL for both Widevine and PlayReady.

```javascript
{
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

##### Native HLS DRM (FairPlay)

Work in progress.