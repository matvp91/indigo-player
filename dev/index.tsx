import * as React from 'react';
import * as ReactDOM from 'react-dom';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import omit from 'lodash/omit';

// Start the player

const IndigoPlayer = (window as any).IndigoPlayer;

const player = IndigoPlayer.init(document.getElementById('playerContainer'), {
  autoplay: true,
  ui: true,
  // freewheel: {
  //   clientSide: true,
  //   network: 96749,
  //   server: 'https://demo.v.fwmrm.net/ad/g/1',
  //   videoAsset: 'DemoVideoGroup.01',
  //   // videoAsset: 'TEST_AD_BRAND_ANV_10003623',
  //   duration: 594,
  //   siteSection: 'DemoSiteGroup.01',
  //   profile: 'global-js',
  //   cuepoints: [/*'preroll',*/ 12, 'postroll'],
  // },
  // googleIMA: {
  //   // src: 'https://pubads.g.doubleclick.net/gampad/ads?' +
  //   // 'sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&' +
  //   // 'impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&' +
  //   // 'cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=',
  //   src: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostpod&cmsid=496&vid=short_onecue&correlator=',
  // },
  sources: [
    // {
    //   type: 'mp4',
    //   src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    // },
    // {
    //   type: 'dash',
    //   src: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd',
    //   drm: {
    //     widevine: {
    //       licenseUrl: 'https://widevine-proxy.appspot.com/proxy',
    //     },
    //     playready: {
    //       licenseUrl: 'https://playready.directtaps.net/pr/svc/rightsmanager.asmx?PlayRight=1&#038;ContentKey=EAtsIJQPd5pFiRUrV9Layw==',
    //     },
    //   },
    // },
    // {
    //   type: 'dash',
    //   src: 'http://dash.edgesuite.net/akamai/bbb_30fps/bbb_30fps.mpd',
    // },
    {
      type: 'hls',
      src: 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/m3u8s/11331.m3u8',
    },
    // {
    //   type: 'webm',
    //   src: 'http://ptgmedia.pearsoncmg.com/imprint_downloads/peachpit/peachpit/downloads/0321793935/media//elephants-dream-medium.webm',
    // },
    // {
    //   type: 'mp4',
    //   src: 'http://techslides.com/demos/sample-videos/small.mp4',
    // },
  ],
  captions: [
    {
      label: 'English',
      srclang: 'en',
      src: './en-subs.vtt',
    },
  ],
});
(window as any).player = player;

player.on(IndigoPlayer.Events.STATE_CHANGE, ({ state }) => {
  render(state);
});

export interface StateProps { state: any };

export const State = (props: StateProps) => {
  const state = omit(props.state, ['ad.freewheelAdInstance']);
  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button onClick={() => location.reload()}>Reload</button>
    </div>
   );
};

function render(state) {
  ReactDOM.render(<State state={state} />, document.getElementById('state'));
}