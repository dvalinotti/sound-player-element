# \<sound-player> Web Component

A Lit Web Component that allows you to reference and play an audio file in the browser with minimal config.

Uses the Web Audio API to take a provided `src` url and control playback.

## Usage

```bash
npm i sound-player-element
# OR
yarn add sound-player-element
```

```html
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <sound-player id="audio-el-id" src="https://url-to-audio/file.mp3"></sound-player>
  </body>
</html>
```

## Features

- [x] Play/pause audio
- [x] Display progress
- [ ] Volume controls
- [ ] Skip/seek audio
- [ ] Skip beginning/end button
