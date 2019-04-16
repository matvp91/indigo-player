import { Module } from '@src/Module';
import {
  AdBreakType,
  Events,
  IAd,
  IAdBreak,
  IAdBreakEventData,
  IAdBreaksEventData,
  IAdBreakTimeUpdateEventData,
  IAdEventData,
  IEventData,
  IInstance,
  ITimeUpdateEventData,
  NextHook,
} from '@src/types';
import find from 'lodash/find';

interface IFWAdBreak extends IAdBreak {
  maxAds: number;
  freewheelSlot?: any;
}

export class FreeWheelExtension extends Module {
  public name: string = 'FreeWheelExtension';

  private sdk: any;

  private mediaElement: HTMLMediaElement;

  private adManager: any;

  private adContext: any;

  private adsRequested: boolean = false;

  private adBreaks: IFWAdBreak[] = [];

  private currentAdBreak: IFWAdBreak;

  private currentAd: IAd;

  private adSequenceIndex: number;

  private adContainer: HTMLElement;

  // Store the previous current time to omit playing a midroll
  // if the start position !== 0.
  private prevCurrentTime: number = 0;

  constructor(instance: IInstance) {
    super(instance);

    if (
      !(window as any).tv ||
      !(window as any).tv.freewheel ||
      !(window as any).tv.freewheel.SDK
    ) {
      return;
    }

    this.sdk = (window as any).tv.freewheel.SDK;
    this.sdk.setLogLevel(this.sdk.LOG_LEVEL_QUIET);

    this.once(
      Events.INSTANCE_INITIALIZED,
      this.onInstanceInitialized.bind(this),
    );
    this.on(Events.PLAYER_STATE_TIMEUPDATE, this.onPlayerTimeUpdate.bind(this));
    this.on(Events.PLAYER_STATE_ENDED, this.onPlayerEnded.bind(this));

    this.instance.controller.hooks.create(
      'play',
      this.onControllerPlay.bind(this),
    );
    this.instance.controller.hooks.create(
      'pause',
      this.onControllerPause.bind(this),
    );
    this.instance.controller.hooks.create(
      'setVolume',
      this.onControllerSetVolume.bind(this),
    );
    this.instance.controller.hooks.create(
      'seekTo',
      this.onControllerSeekTo.bind(this),
    );
  }

  public onControllerPlay(next: NextHook) {
    if (!this.adsRequested) {
      this.emit(Events.ADBREAK_STATE_PLAY);
      this.adContext.submitRequest();
      return;
    }

    if (this.currentAdBreak) {
      this.emit(Events.ADBREAK_STATE_PLAY);
      this.mediaElement.play();
      return;
    }

    next();
  }

  public onControllerPause(next: NextHook) {
    if (this.currentAdBreak) {
      this.emit(Events.ADBREAK_STATE_PAUSE);
      this.mediaElement.pause();
      return;
    }

    next();
  }

  public onControllerSetVolume(next: NextHook, volume: number) {
    this.mediaElement.volume = volume;
    this.mediaElement.muted = volume === 0;
    next();
  }

  public onControllerSeekTo(next: NextHook) {
    if (this.currentAdBreak) {
      return;
    }

    next();
  }

  public createMediaElement() {
    this.mediaElement = document.createElement('video');
    this.mediaElement.style.width = '100%';
    this.mediaElement.style.height = '100%';

    this.mediaElement.addEventListener('playing', () => {
      this.emit(Events.ADBREAK_STATE_PLAYING);
    });

    this.mediaElement.addEventListener('timeupdate', () => {
      if (this.currentAdBreak) {
        this.emit(Events.ADBREAK_STATE_TIMEUPDATE, {
          currentTime: this.currentAdBreak.freewheelSlot.getPlayheadTime(),
        } as IAdBreakTimeUpdateEventData);
      }
    });

    this.mediaElement.addEventListener('waiting', () => {
      this.emit(Events.ADBREAK_STATE_BUFFERING);
    });

    this.adContainer.appendChild(this.mediaElement);
  }

  private onInstanceInitialized() {
    this.adContainer = document.createElement('div');
    this.adContainer.style.position = 'absolute';
    this.adContainer.style.left = '0px';
    this.adContainer.style.right = '0px';
    this.adContainer.style.top = '0px';
    this.adContainer.style.bottom = '0px';
    this.adContainer.style.display = 'none';
    this.adContainer.id = 'fwAdsContainer';
    this.instance.adsContainer.appendChild(this.adContainer);

    // Create ads specific media element.
    this.createMediaElement();

    const { AdManager }: { AdManager: any } = this.sdk;
    this.adManager = new AdManager();
    this.adContext = this.adManager.newContext();

    this.adContext.addEventListener(
      this.sdk.EVENT_REQUEST_COMPLETE,
      this.onAdRequestComplete.bind(this),
    );
    this.adContext.addEventListener(
      this.sdk.EVENT_SLOT_STARTED,
      this.onSlotStarted.bind(this),
    );
    this.adContext.addEventListener(
      this.sdk.EVENT_SLOT_ENDED,
      this.onSlotEnded.bind(this),
    );
    this.adContext.addEventListener(
      this.sdk.EVENT_AD_IMPRESSION,
      this.onAdImpression.bind(this),
    );
    this.adContext.addEventListener(
      this.sdk.EVENT_AD_IMPRESSION_END,
      this.onAdImpressionEnd.bind(this),
    );

    const freewheel = this.instance.config.freewheel;
    this.adManager.setNetwork(freewheel.network);
    this.adManager.setServer(freewheel.server);
    this.adContext.setVideoAsset(
      freewheel.videoAsset,
      freewheel.duration,
      freewheel.network,
    );
    this.adContext.setSiteSection(freewheel.siteSection);
    this.adContext.setProfile(freewheel.profile);

    freewheel.cuepoints.forEach(cuepoint => {
      if (cuepoint === AdBreakType.PREROLL) {
        this.adContext.addTemporalSlot('preroll', this.sdk.ADUNIT_PREROLL, 0);
      } else if (cuepoint === AdBreakType.POSTROLL) {
        this.adContext.addTemporalSlot(
          'postroll',
          this.sdk.ADUNIT_POSTROLL,
          freewheel.duration,
        );
      } else {
        const time = cuepoint as number;
        this.adContext.addTemporalSlot(
          `midroll-${time}`,
          this.sdk.ADUNIT_MIDROLL,
          time,
        );
      }
    });

    this.adContext.registerVideoDisplayBase(this.adContainer.id);
  }

  public onAdRequestComplete(event) {
    this.adsRequested = true;

    if (event.success) {
      const slots = this.adContext.getTemporalSlots();
      this.adBreaks = slots.map(
        (slot, index) =>
          ({
            sequenceIndex: index,
            id: slot.getCustomId(),
            type: slot.getAdUnit(),
            startsAt: slot.getTimePosition(),
            duration: slot.getTotalDuration(),
            hasBeenWatched: false,
            maxAds: slot.getAdCount(),
            freewheelSlot: slot,
          } as IFWAdBreak),
      );
    }

    this.emit(Events.ADBREAKS, {
      adBreaks: this.adBreaks,
    } as IAdBreaksEventData);

    const preroll: IFWAdBreak = find(this.adBreaks, {
      type: AdBreakType.PREROLL,
    });
    if (preroll && !this.shouldSkipPreroll()) {
      this.playAdBreak(preroll);
    } else {
      this.instance.media.play();
    }
  }

  public adClick() {
    if (!this.currentAd) {
      return;
    }

    this.currentAd.freewheelAdInstance
      .getRendererController()
      .processEvent({ name: this.sdk.EVENT_AD_CLICK });
  }

  private onSlotStarted(event) {
    const slot: any = event.slot;

    const adBreak = this.slotToAdBreak(slot);
    this.currentAdBreak = adBreak;

    this.emit(Events.ADBREAK_STARTED, {
      adBreak,
    } as IAdBreakEventData);

    this.instance.media.pause();
  }

  private onSlotEnded(event) {
    const slot: any = event.slot;

    const adBreak = this.slotToAdBreak(slot);
    adBreak.hasBeenWatched = true;

    this.currentAdBreak = null;

    this.emit(Events.ADBREAK_ENDED, {
      adBreak,
    } as IAdBreakEventData);

    if (adBreak.type !== AdBreakType.POSTROLL) {
      this.instance.media.play();
    }

    this.adContainer.style.display = 'none';
  }

  private onAdImpression(event) {
    this.adSequenceIndex = 0;

    this.currentAd = {
      sequenceIndex: this.adSequenceIndex,
      freewheelAdInstance: event.adInstance,
    };

    this.emit(Events.AD_STARTED, {
      adBreak: this.currentAdBreak,
      ad: this.currentAd,
    } as IAdEventData);
  }

  private onAdImpressionEnd(event) {
    const ad = this.currentAd;

    this.currentAd = null;

    this.emit(Events.AD_ENDED, {
      adBreak: this.currentAdBreak,
      ad,
    } as IAdEventData);

    this.adSequenceIndex += 1;
  }

  private onPlayerTimeUpdate({ currentTime }: ITimeUpdateEventData) {
    const midroll: IFWAdBreak = find(
      this.adBreaks,
      adBreak =>
        adBreak.type === AdBreakType.MIDROLL &&
        adBreak.startsAt <= currentTime &&
        adBreak.startsAt > this.prevCurrentTime &&
        !adBreak.hasBeenWatched,
    );

    if (midroll) {
      this.playAdBreak(midroll);
    }

    this.prevCurrentTime = currentTime;
  }

  private onPlayerEnded() {
    const postroll: IFWAdBreak = find(
      this.adBreaks,
      adBreak =>
        adBreak.type === AdBreakType.POSTROLL && !adBreak.hasBeenWatched,
    );

    if (postroll) {
      this.playAdBreak(postroll);
    }
  }

  private slotToAdBreak(slot: any): IFWAdBreak {
    return find<IFWAdBreak>(this.adBreaks, {
      id: slot.getCustomId(),
    });
  }

  private playAdBreak(adBreak: IFWAdBreak) {
    try {
      adBreak.freewheelSlot.play();
    } catch (error) {
      this.instance.media.play();
    }
    this.adContainer.style.display = 'block';
  }

  private shouldSkipPreroll() {
    return this.instance.config.startPosition > 0;
  }
}
