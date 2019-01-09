import { Instance } from '@src/Instance';
import { Module } from '@src/Module';
import {
  AdBreak,
  AdBreakEventData,
  AdBreaksEventData,
  AdType,
  Events,
  Hook,
  HookActions,
  TimeUpdateEventData,
} from '@src/types';
import find from 'lodash/find';

export class FreeWheelExtension extends Module {
  public name = 'freewheel';

  private sdk: any;

  private mediaElement: HTMLMediaElement;

  private adManager: any;

  private adContext: any;

  private adsRequested: boolean;

  private adBreaks: AdBreak[] = [];

  private currentAdBreak: AdBreak;

  constructor(instance: Instance) {
    super(instance);

    if (!(window as any).tv.freewheel.SDK) {
      return;
    }

    this.sdk = (window as any).tv.freewheel.SDK;
    this.sdk.setLogLevel(this.sdk.LOG_LEVEL_QUIET);

    instance.controller.hooks.create({
      name: 'play',
      method: this.onHookControllerPlay.bind(this),
    });

    instance.controller.hooks.create({
      name: 'pause',
      method: this.onHookControllerPause.bind(this),
    });

    instance.controller.hooks.create({
      name: 'setVolume',
      method: this.onHookControllerSetVolume.bind(this),
    });

    this.once(Events.READY, this.onReady.bind(this));
    this.on(Events.PLAYER_STATE_TIMEUPDATE, this.onPlayerTimeUpdate.bind(this));
  }

  public onHookControllerPlay(): HookActions {
    if (!this.adsRequested) {
      this.adContext.submitRequest();
      return HookActions.ABORT;
    }

    return HookActions.CONTINUE;
  }

  public onHookControllerPause(): HookActions {
    if (this.currentAdBreak) {
      this.mediaElement.pause();
      return HookActions.ABORT;
    }

    return HookActions.CONTINUE;
  }

  public onHookControllerSetVolume(volume: number): HookActions {
    this.mediaElement.volume = volume;
    return HookActions.CONTINUE;
  }

  public createMediaElement() {
    this.mediaElement = document.createElement('video');
    this.mediaElement.style.width = '100%';
    this.mediaElement.style.height = '100%';

    this.mediaElement.addEventListener('play', () => {
      this.emit(Events.ADBREAK_STATE_PLAY);
    });

    this.mediaElement.addEventListener('pause', () => {
      this.emit(Events.ADBREAK_STATE_PAUSE);
    });

    this.mediaElement.addEventListener('playing', () => {
      this.emit(Events.ADBREAK_STATE_PLAYING);
    });

    this.mediaElement.addEventListener('timeupdate', () => {
      this.emit(Events.ADBREAK_STATE_TIMEUPDATE, {
        currentTime: this.mediaElement.currentTime,
      } as TimeUpdateEventData);
    });
  }

  public onReady() {
    // Create ads specific media element.
    this.createMediaElement();

    this.instance.adsContainer.appendChild(this.mediaElement);

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
      if (cuepoint === AdType.PREROLL) {
        this.adContext.addTemporalSlot('preroll', this.sdk.ADUNIT_PREROLL, 0);
      } else if (cuepoint === AdType.POSTROLL) {
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

    this.instance.adsContainer.id = 'freewheelAdsContainer';
    this.adContext.registerVideoDisplayBase(this.instance.adsContainer.id);
  }

  public onAdRequestComplete(event) {
    this.adsRequested = true;

    if (event.success) {
      const slots = this.adContext.getTemporalSlots();
      this.adBreaks = slots.map(
        slot =>
          ({
            id: slot.getCustomId(),
            type: slot.getAdUnit(),
            startsAt: slot.getTimePosition(),
            hasBeenWatched: false,
            freewheelSlot: slot,
          } as AdBreak),
      );
    }

    this.emit(Events.ADBREAKS, {
      adBreaks: this.adBreaks,
    } as AdBreaksEventData);

    const preroll: AdBreak = find(this.adBreaks, { type: AdType.PREROLL });
    if (preroll) {
      this.playAdBreak(preroll);
    } else {
      this.instance.media.play();
    }
  }

  public onSlotStarted(event) {
    const slot: any = event.slot;

    this.instance.media.pause();

    const adBreak = this.slotToAdBreak(slot);
    this.currentAdBreak = adBreak;

    this.emit(Events.ADBREAK_STARTED, {
      adBreak,
    } as AdBreakEventData);
  }

  public onSlotEnded(event) {
    const slot: any = event.slot;

    const adBreak = this.slotToAdBreak(slot);
    adBreak.hasBeenWatched = true;

    this.currentAdBreak = null;

    this.emit(Events.ADBREAK_ENDED, {
      adBreak,
    } as AdBreakEventData);

    this.instance.media.play();

    this.instance.adsContainer.style.display = 'none';
  }

  public onPlayerTimeUpdate({ currentTime }: TimeUpdateEventData) {
    const midroll: AdBreak = find(
      this.adBreaks,
      adBreak =>
        adBreak.type === AdType.MIDROLL &&
        adBreak.startsAt <= currentTime &&
        !adBreak.hasBeenWatched,
    );

    if (midroll) {
      this.playAdBreak(midroll);
    }
  }

  public slotToAdBreak(slot: any): AdBreak {
    return find(this.adBreaks, {
      id: slot.getCustomId(),
    });
  }

  public playAdBreak(adBreak: AdBreak) {
    try {
      adBreak.freewheelSlot.play();
    } catch (error) {
      this.instance.media.play();
    }
    this.instance.adsContainer.style.display = 'block';
  }
}
