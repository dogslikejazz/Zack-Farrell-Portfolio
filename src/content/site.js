// ─── Edit me! ───────────────────────────────────────────────
// Everything about YOU lives here. Change any value and save —
// the site updates automatically.

export const site = {
  name: 'Zack Farrell',
  tagline: 'Filmmaker & Photographer',
  location: 'Gainesville, FL',
  school: 'University of Florida — Media Production',
  email: 'zackfarrell2005@gmail.com',
  socials: [
    { label: 'INSTAGRAM', url: 'https://www.instagram.com/zackofarrell/' },
    { label: 'YOUTUBE', url: 'https://www.youtube.com/@zackofarrell' },
    { label: 'LINKEDIN', url: 'https://www.linkedin.com/in/zackfarrell/' },
  ],
  // Resume PDF — drop the file into public/ with this exact name (or change
  // the name here). Set to null to hide every RESUME link.
  resume: '/Zack-Farrell-Resume.pdf',
  // About panel under the desk. Headshot: a square, web-sized JPG (plus a
  // WebP twin with the same name) in public/about/. Each string in
  // `paragraphs` is one paragraph.
  about: {
    kicker: 'ABOUT',
    heading: 'WHO I AM',
    headshot: '/about/headshot.jpg',
    headshotWebp: '/about/headshot.webp',
    headshotAlt: 'Zack Farrell smiling while shooting on a Sony mirrorless camera at night',
    paragraphs: [
      'PLACEHOLDER — replace me in src/content/site.js. Two or three short paragraphs work best: who you are, what you make, what you are looking for.',
      'Second paragraph placeholder. Keep the voice plain and first-person. This block is capped at a comfortable reading width, so long paragraphs are fine.',
    ],
  },
  // Attribution for third-party assets currently in use (required for CC-BY).
  // Safe to remove an entry once you replace that asset with your own.
  // Full details: public/models/ATTRIBUTION.md, public/video/ATTRIBUTION.md
  credits: [
    { label: 'CAMERA: GABRIEL VALDIVIA (CC-BY)', url: 'https://poly.pizza/m/eAoNPV5bfmK' },
    { label: 'CONTROLLER: POLY BY GOOGLE (CC-BY)', url: 'https://poly.pizza/m/6365MG_Pr_f' },
  ],
}
