# Zack's Portfolio — "The Desk"

Your interactive portfolio: b-roll background, bird's-eye 3D desk, camera → Photography, clapperboard → Films.

## Run it

```
npm install     # first time only
npm run dev     # → http://localhost:5173
```

## Everything you'll ever edit

All your content lives in **`src/content/`** and **`public/`**. You should never need to touch `src/components/`.

| What | Where |
|---|---|
| Your name, tagline, email, socials, credits | `src/content/site.js` |
| The 3D objects on the desk | `src/content/deskObjects.js` |
| Photos | `src/content/photos.js` + `public/photos/` |
| Films | `src/content/films.js` + `public/films/` |
| Background video | `public/video/` |
| 3D model files | `public/models/` |
| Click sounds | `public/sfx/` |

## Add a photo (3 steps)

1. Export it web-sized at [squoosh.app](https://squoosh.app): ≤2000px long edge, JPEG quality ~75, aim ≤500KB. Drop it into `public/photos/full/`.
2. Make a thumbnail (~500px wide, ≤120KB) with the **same filename** into `public/photos/thumbs/`.
3. Add one entry in `src/content/photos.js`. Delete the placeholder entries as you go.

## Add a film (2 steps)

1. Upload it to YouTube (unlisted is fine) or Vimeo.
2. Add an entry in `src/content/films.js` — the comments at the top of that file show the exact format. Films not online yet: use `source: 'local'` for a "coming soon" card.

## Swap in YOUR b-roll (when you export it)

1. Export a 10–20s clip from Premiere/Resolve. No audio needed.
2. Install ffmpeg once: `winget install Gyan.FFmpeg` (then reopen the terminal).
3. Run (replace `broll.mov` with your export):

```
ffmpeg -i broll.mov -t 18 -an -vf "scale=1920:-2,fps=24" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart public/video/bg-loop.mp4
ffmpeg -i broll.mov -t 18 -an -vf "scale=1920:-2,fps=24" -c:v libvpx-vp9 -crf 38 -b:v 0 public/video/bg-loop.webm
ffmpeg -i public/video/bg-loop.mp4 -frames:v 1 -q:v 3 public/video/poster.jpg
```

Keep `bg-loop.mp4` under ~10MB (raise `-crf` a little if it's over). The `.webm` is optional but smaller — if you export it, also add `<source src="/video/bg-loop.webm" type="video/webm" />` above the mp4 source in `src/components/VideoBackground.jsx`. Copy `poster.jpg` over `public/fallback/home-static.jpg` too.
The current video is a Pexels placeholder (night highway) — details in `public/video/ATTRIBUTION.md`.

## Swap in YOUR 3D models (from Blender)

1. In Blender: File → Export → glTF 2.0 (.glb).
2. Optimize it for web (one command):

```
npx @gltf-transform/cli optimize my-camera.glb public/models/camera.glb --compress quantize --texture-size 1024
```

3. Overwrite `public/models/camera.glb` (or `clapperboard.glb`). The site **auto-scales and grounds any model**, so it should just work — if the resting angle looks off, tweak `rotationY`/`size` for that object in `src/content/deskObjects.js`.
4. Once you replace the camera model, you can delete the "CAMERA MODEL: DOOK" credit in `src/content/site.js` (it's legally required only while his CC-BY model is in use). Current model credits: `public/models/ATTRIBUTION.md`.

## Add a THIRD desk object later (script paper → Writing)

1. Drop `public/models/script.glb` and `public/sfx/page.mp3` in place.
2. Copy an entry in `src/content/deskObjects.js`, set `id: 'writing'`, `route: '/writing'`, position it (x: 0, z: 1 puts it front-center).
3. Create `src/components/sections/WritingSection.jsx` (copy `FilmsGrid.jsx` as a starting point) and add a `<Route path="/writing" ...>` in `src/App.jsx` next to the existing two.

## Deploy

Pushed to GitHub + imported in Vercel = auto-deploys on every push. Framework preset: Vite (auto-detected). `vercel.json` already handles direct links to `/photography` and `/films`.

## How it's built (30-second tour)

- `src/store.js` — the transition state machine (`idle → focusing → section → returning`). Think of it as the game manager.
- `src/components/scene/CameraRig.jsx` — owns the camera every frame, like a Unity `Update()` on the main camera. The dive is a 1.2s eased lerp toward the clicked object.
- `src/components/scene/DeskObject.jsx` — generic interactive prop: hover lift, label, click → sound + dive. All its data comes from `deskObjects.js`.
- `src/TransitionController.jsx` — keeps the URL and the state machine in sync (deep links, browser back).
- Sections are plain DOM overlays on top of the canvas — the 3D scene never unmounts.
