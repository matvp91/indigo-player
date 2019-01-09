function MediaSourceEngine_isBrowserSupported(): boolean {
  return !!(window as any).MediaSource && !!MediaSource.isTypeSupported;
}

function DrmEngine_isBrowserSupported(): boolean {
  const basic =
    !!(window as any).MediaKeys &&
    !!(window as any).navigator &&
    !!(window as any).navigator.requestMediaKeySystemAccess &&
    !!(window as any).MediaKeySystemAccess &&
    !!(window as any).MediaKeySystemAccess.prototype.getConfiguration;

  return basic;
}

export const isBrowserSupported = (): boolean => {
  const basic =
    !!(window as any).Promise &&
    !!(window as any).Uint8Array &&
    !!Array.prototype.forEach;

  return (
    basic &&
    MediaSourceEngine_isBrowserSupported() &&
    DrmEngine_isBrowserSupported()
  );
};
