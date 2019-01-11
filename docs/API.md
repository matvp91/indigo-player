# API

You can initialize the player by calling `ÌndigoPlayer.init(domElement, container)`, and the **return value** is a player object, which you can use to interact with the player or listen to events.

## Methods

Use the following methods to instruct the player to do an action.

<table class="api-table">
  <thead>
    <tr>
        <th>Method</th>
        <th>Arguments</th>
        <th>Description>
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
      <td><code>player.setSubtitle(srclang)</code></td>
      <td>
        <ul>
          <li>srclang: <i>string</i> from the config.captions list.</li>
        </ul>
      </td>
      <td>Sets the captions if found. If no caption can be found, none is shown.</td>
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

The player can emit the following events:

TBD