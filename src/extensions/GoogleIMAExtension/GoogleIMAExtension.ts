import { Instance } from '@src/Instance';
import { NextHook } from '@src/Hooks';
import { Module } from '@src/Module';
import { Events } from '@src/types';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';

export class GoogleIMAExtension extends Module {
  public name: string = 'GoogleIMAExtension';

  private adContainer: HTMLElement;

  private adDisplayContainer: any;

  private adsRequested: boolean = false;

  private adsLoader: any;

  private ima: any;

  private adsManager: any;

  constructor(instance: Instance) {
    super(instance);

    this.ima = (window as any).google.ima;

    this.once(Events.READY, this.onReady.bind(this));

    this.instance.controller.hooks.create(
      'play',
      this.onControllerPlay.bind(this),
    );
  }

  onReady() {
    this.adContainer = document.createElement('div');
    this.adContainer.style.width = '100%';
    this.adContainer.style.height = '100%';
    this.instance.adsContainer.appendChild(this.adContainer);

    const mediaElement: HTMLMediaElement = (this.instance
        .player as HTML5Player).mediaElement;

    this.adDisplayContainer = new this.ima.AdDisplayContainer(this.adContainer, mediaElement);
    this.adDisplayContainer.initialize();

    // Stretch the container that Google IMA adds to the DOM
    const imaContainer: HTMLElement = this.adContainer.firstChild as HTMLElement;
    imaContainer.style.top = '0px';
    imaContainer.style.left = '0px';
    imaContainer.style.right = '0px';
    imaContainer.style.bottom = '0px';

    this.adsLoader = new this.ima.AdsLoader(this.adDisplayContainer);
    this.adsLoader.addEventListener(this.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdsManagerLoaded.bind(this), false);
  }

  public onControllerPlay(next: NextHook) {
    if (!this.adsRequested) {
      this.emit(Events.ADBREAK_STATE_PLAY);
      this.requestAds();
      return;
    }

    next();
  }

  private requestAds() {
    const adsRequest = new this.ima.AdsRequest();

    adsRequest.adTagUrl = this.instance.config.googleIMA.src;

    adsRequest.linearAdSlotWidth = 640;
    adsRequest.linearAdSlotHeight = 400;
    adsRequest.nonLinearAdSlotWidth = 640;
    adsRequest.nonLinearAdSlotHeight = 150;

    this.adsLoader.requestAds(adsRequest);
  }

  private onAdsManagerLoaded(event: any) {
    const mediaElement: HTMLMediaElement = (this.instance
        .player as HTML5Player).mediaElement;

    const adsManager = event.getAdsManager(mediaElement);

    adsManager.addEventListener(
      this.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      this.onContentPauseRequested.bind(this));

     adsManager.addEventListener(
      this.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      this.onContentResumeRequested.bind(this));

    try {
      adsManager.init('100%', '100%', this.ima.ViewMode.NORMAL);
      adsManager.start();
    } catch (error) {
      this.instance.media.play();
    }
  }

  private onContentPauseRequested() {
    this.instance.media.pause();
  }

  private onContentResumeRequested() {
    this.instance.media.play();
  }
}
