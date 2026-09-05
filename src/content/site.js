// ─── Edit me! ───────────────────────────────────────────────
// Everything about YOU lives here. Change any value and save —
// the site updates automatically.

export const site = {
  name: 'Zack Farrell',
  tagline: 'Videographer & Photographer',
  location: 'Gainesville, FL',
  school: 'University of Florida — Media Production',
  email: 'zackfarrellmedia@gmail.com',
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
      "I’m Zachary, a photographer and videographer splitting my time between Gainesville and Tampa, Florida. I’m always looking for new projects, but in the past I’ve shot weddings, marketing videos for a startup, and my own personal projects. I’m in love with the logistical nightmare that filmmaking is, and I’m eager to keep building the technical skills it takes to fully commit to it.",
      "I’m currently working on my first short film and starting a channel with a friend. I’m looking for an internship — out of state works — and taking on freelance clients. If you’re interested, reach out below.",
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
