# API

You can initialize the player by calling `ÌndigoPlayer.init(domElement, container)`, and the **return value** is a player object, which you can use to interact with the player or listen to events.

## Methods

Use the following methods to instruct the player to do an action.

<table class="api-table">
  <thead>
    <tr>
        <th>Method</th>
        <th>Arguments</th>
        <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="3" class="title">Actions</td>
    </tr>
    <tr>
      <td><code>player.play()</code></td>
      <td></td>
      <td>The player will start playing the content (or ads)</td>
    </tr>
    <tr>
      <td><code>player.pause()</code></td>
      <td></td>
      <td>Pauses content (or ads)</td>
    </tr>
    <tr>
      <td><code>player.seekTo(time)</code></td>
      <td>
        <ul>
          <li>time: <i>number</i></li>
        </ul>
      </td>
      <td>Seeks to a time in the content</td>
    </tr>
    <tr>
      <td><code>player.setVolume(volume)</code></td>
      <td>
        <ul>
          <li>volume: <i>number</i> between 0 and 1</li>
        </ul>
      </td>
      <td>Seeks to a time in the content</td>
    </tr>
    <tr>
      <td><code>player.setError(error)</code></td>
      <td>
        <ul>
          <li>error: <i>PlayerError</i></li>
        </ul>
      </td>
      <td>Triggers a <b>fatal</b> error.</td>
    </tr>
    <tr>
      <td><code>player.destroy()</code></td>
      <td></td>
      <td>Destroys the player entirely, the original DOM container is put back in place and can be reused.</td>
    </tr>
    <tr>
      <td colspan="3" class="title">Events</td>
    </tr>
    <tr>
      <td><code>player.on(name, callback)</code></td>
      <td>
        <ul>
          <li>name: <i>string</i></li>
          <li>callback: <i>function</i></li>
        </ul>
      </td>
      <td>Registers an event listener for a given event.</td>
    </tr>
    <tr>
      <td><code>player.once(name, callback)</code></td>
      <td>
        <ul>
          <li>name: <i>string</i></li>
          <li>callback: <i>function</i></li>
        </ul>
      </td>
      <td>Registers an event listener for a given event, but it gets removed once it's triggered once.</td>
    </tr>
    <tr>
      <td><code>player.removeListener(name, callback)</code></td>
      <td>
        <ul>
          <li>name: <i>string</i></li>
          <li>callback: <i>function</i></li>
        </ul>
      </td>
      <td>Removes a previously registered event listener.</td>
    </tr>
    <tr>
      <td><code>player.emit(name, data)</code></td>
      <td>
        <ul>
          <li>name: <i>string</i></li>
          <li>data: <i>object</i></li>
        </ul>
      </td>
      <td>Emits an event to all the registered event listeners.</td>
    </tr>
    <tr>
      <td colspan="3" class="title">Misc</td>
    </tr>
    <tr>
      <td><code>player.getStats()</code></td>
      <td></td>
      <td>Returns an object with all the loaded modules (controller, media, player and extensions)</td>
    </tr>
    <tr>
      <td><code>player.getModule(name)</code></td>
      <td>
        <ul>
          <li>name: <i>string</i></li>
        </ul>
      </td>
      <td>Returns a module by the given name.</td>
    </tr>
  </tbody>
</table>

## Events

The player emits a lot of events. Most events are used for development purposes. The ones listed here are related to the state of the player and the events that get triggered when the state changes. State events are standardized events across the different modules.

All events are available in `IndigoPlayer.Events.<Event>`.

<table class="api-table">
  <thead>
    <tr>
        <th>Event</th>
        <th>Parameters</th>
        <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="3" class="title">State</td>
    </tr>
    <tr>
      <td><code>STATE_CHANGE</code></td>
      <td>
        <ul>
          <li>state: <i>State</i></li>
          <li>prevState: <i>State</i></li>
        </ul>
      </td>
      <td>Whenever the state changes, this event is triggered. The state argument is <b>immutable</b>, this is great for UI's like React.</td>
    </tr>
    <tr>
      <td><code>STATE_READY</code></td>
      <td></td>
      <td>The player is ready.</td>
    </tr>
    <tr>
      <td><code>STATE_PLAY_REQUESTED</code></td>
      <td></td>
      <td>Playback has been requested (for content or ads), can be by a user click / tap or by autoplay.</td>
    </tr>
    <tr>
      <td><code>STATE_PLAYING</code></td>
      <td></td>
      <td>The video (content or ads) is actually playing.</td>
    </tr>
    <tr>
      <td><code>STATE_PAUSED</code></td>
      <td></td>
      <td>The video (content or ads) is paused.</td>
    </tr>
    <tr>
      <td><code>STATE_CURRENTTIME_CHANGE</code></td>
      <td></td>
      <td>The current time (content or ads) has changed.</td>
    </tr>
    <tr>
      <td><code>STATE_BUFFERING</code></td>
      <td></td>
      <td>The video is buffering (or rebuffering).</td>
    </tr>
    <tr>
      <td><code>STATE_ADBREAKS</code></td>
      <td>
        <ul>
          <li>adBreaks: <i>Array<AdBreak></i></li>
        </ul>
      </td>
      <td>An ad provider has provided a list of ads.</td>
    </tr>
    <tr>
      <td><code>STATE_ADBREAK_STARTED</code></td>
      <td>
        <ul>
          <li>adBreak: <i>AdBreak</i></li>
        </ul>
      </td>
      <td>The given ad break has started.</td>
    </tr>
    <tr>
      <td><code>STATE_AD_STARTED</code></td>
      <td>
        <ul>
          <li>ad: <i>Ad</i></li>
        </ul>
      </td>
      <td>An ad inside an ad break has started.</td>
    </tr>
    <tr>
      <td><code>STATE_AD_ENDED</code></td>
      <td>
        <ul>
          <li>ad: <i>Ad</i></li>
        </ul>
      </td>
      <td>An ad inside an ad break has ended.</td>
    </tr>
    <tr>
      <td><code>STATE_ADBREAK_ENDED</code></td>
      <td>
        <ul>
          <li>adBreak - <i>AdBreak</i></li>
        </ul>
      </td>
      <td>The ad break has ended.</td>
    </tr>
    <tr>
      <td><code>STATE_ENDED</code></td>
      <td></td>
      <td>The video has ended.</td>
    </tr>
    <tr>
      <td><code>STATE_ERROR</code></td>
      <td>
        <ul>
          <li>error - <i>PlayerError</i></li>
        </ul>
      </td>
      <td>An <b>unrecoverable</b> error occured.</td>
    </tr>
    <tr>
      <td><code>STATE_VOLUME_CHANGE</code></td>
      <td>
        <ul>
          <li>volume - <i>number</i></li>
        </ul>
      </td>
      <td>The volume has changed.</td>
    </tr>
    <tr>
      <td><code>STATE_DURATION_CHANGE</code></td>
      <td>
        <ul>
          <li>duration - <i>number</i></li>
        </ul>
      </td>
      <td>The duration has changed.</td>
    </tr>
    <tr>
      <td><code>STATE_FULLSCREEN_SUPPORTED</code></td>
      <td>
        <ul>
          <li>fullscreenSupported - <i>boolean</i></li>
        </ul>
      </td>
      <td>The native fullscreen API is supported.</td>
    </tr>
    <tr>
      <td><code>STATE_FULLSCREEN_CHANGE</code></td>
      <td>
        <ul>
          <li>fullscreen - <i>boolean</i></li>
        </ul>
      </td>
      <td>The fullscreen state has changed.</td>
    </tr>
    <tr>
      <td><code>STATE_TRACKS</code></td>
      <td>
        <ul>
          <li>tracks: <i>Array<Track></i></li>
        </ul>
      </td>
      <td>Media has provided several quality tracks.</td>
    </tr>
    <tr>
      <td><code>STATE_TRACK_CHANGE</code></td>
      <td>
        <ul>
          <li>track: <i>Track</i></li>
        </ul>
      </td>
      <td>A current quality track has been changed.</td>
    </tr>
    <tr>
      <td><code>STATE_SUBTITLE_CHANGE</code></td>
      <td>
        <ul>
          <li>subtitle: <i>Subtitle</i></li>
        </ul>
      </td>
      <td>An active subtitle has been changed.</td>
    </tr>
    <tr>
      <td><code>STATE_PLAYBACKRATE_CHANGE</code></td>
      <td>
        <ul>
          <li>playbackRate: <i>number</i></li>
        </ul>
      </td>
      <td>The current playback rate has been changed.</td>
    </tr>
    <tr>
      <td><code>STATE_PIP_CHANGE</code></td>
      <td>
        <ul>
          <li>pip: <i>boolean</i></li>
        </ul>
      </td>
      <td>Picture-in-Picture mode has either been enabled or disabled.</td>
    </tr>
    <tr>
      <td colspan="3" class="title">UI</td>
    </tr>
    <tr>
      <td><code>UI_VISIBLECONTROLS_CHANGE</code></td>
      <td>
        <ul>
          <li>visibleControls: <i>boolean</i></li>
        </ul>
      </td>
      <td>The controls are made visible or not.</td>
    </tr>
  </tbody>
</table>