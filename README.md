# Will you be my Valentine? -- Webpage

This project is a single static webpage you can open in a browser. It shows a slideshow of your photos while music plays, includes your proposal video, a countdown to Valentine's Day, a memory timeline, and a playful modal where the "No" button shrinks and dodges clicks. After "Yes," a custom love letter appears with a final "Play our song + slideshow" mode.

How to use
- Place your personal video at: `valentine/valepic/video.mp4` (preferred). Fallback: `valentine/assets/video.mp4`.
- Place background music at: `valentine/valepic/music.mp3` (preferred). Fallback: `valentine/assets/music.mp3`.
- Add photos named `photo1.jpg`, `photo2.jpg`, ... up to `photo24.*` in `valentine/valepic/` (preferred). Fallback: `valentine/assets/images/`.
  - Supported extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` (the script auto-loads the first match for each number).

Files
- `index.html` -- main page
- `styles.css` -- styles
- `script.js` -- JavaScript behaviors

Open `valentine/index.html` in a browser (double-click or serve via a simple static server). Click the big "Open" button to start the music and reveal the question modal (this user gesture allows audio playback).

Customizing
- Edit the timeline entries and the love letter text in `index.html`.
- Adjust the countdown style and overall look in `styles.css`.
- To change image names or load a different list, edit `script.js` where images are loaded.

Notes
- Browsers require a user gesture to play audio/video; that is why you tap "Open" first.
- The No button is intentionally playful and avoids being clicked.
