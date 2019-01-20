# Theming

The default UI that ships with indigo-player is defined by plenty of straight forward classnames, you can use these classnames to override, for example, the default colors. This is the current theme that we use in the documentation that you're reading right now:

```html
<html>
  <body>
    <script src="../indigo-player.js"></script>
    <style>
    .igui_seekbar_progress,
    .igui_seekbar_scrubber {
      background-color: #4b0082;
    }
    </style>
  </body>
</html>
```

!> **Important**, it is advised to load your stylesheet (or inline style tag) **AFTER** you've imported `indigo-player.js`. If you don't, CSS precedence will ignore your own styles.