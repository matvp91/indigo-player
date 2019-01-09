const keySystems = [
  ['widevine', 'com.widevine.alpha'],

  ['playready', 'com.microsoft.playready'],
  ['playready', 'com.youtube.playready'],

  ['clearkey', 'webkit-org.w3.clearkey'],
  ['clearkey', 'org.w3.clearkey'],

  ['primetime', 'com.adobe.primetime'],
  ['primetime', 'com.adobe.access'],

  ['fairplay', 'com.apple.fairplay'],
];

export const getDrmSupport = async () => {
  const video = document.createElement('video');

  if (video.mediaKeys) {
    return false;
  }

  const isKeySystemSupported = async keySystem => {
    if (
      !window.navigator.requestMediaKeySystemAccess ||
      typeof window.navigator.requestMediaKeySystemAccess !== 'function'
    ) {
      return false;
    }

    try {
      await window.navigator.requestMediaKeySystemAccess(keySystem, [
        {
          initDataTypes: ['cenc'],
          videoCapabilities: [
            {
              contentType: 'video/mp4;codecs="avc1.42E01E"',
              robustness: 'SW_SECURE_CRYPTO',
            },
          ],
        },
      ]);

      return true;
    } catch (error) {
      return false;
    }
  };

  const drmSupport = {};
  const keySystemsSupported = [];

  await Promise.all(
    keySystems.map(async ([drm, keySystem]) => {
      const supported = await isKeySystemSupported(keySystem);

      if (supported) {
        keySystemsSupported.push(keySystem);

        if (!drmSupport[drm]) {
          drmSupport[drm] = true;
        }
      }
    }),
  );

  return {
    drmSupport,
    keySystemsSupported,
  };
};
