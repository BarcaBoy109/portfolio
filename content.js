export const profile = {
  name: 'Shehroz Awadul Hoque',
  handle: 'BarcaBoy109',
  github: 'https://github.com/BarcaBoy109',
  linkedin: 'https://www.linkedin.com/in/shehroz-awadul-hoque-b3baa2206/',
  youtube: 'https://www.youtube.com/@Maskematics',
  timeZone: 'Asia/Singapore',
};

// Published destinations verified on 2026-10-20. Keep unavailable work below.
export const projects = [
  {
    id: 'objectlab', name: 'ObjectLab',
    description: 'See what Java is doing. Step through your code and follow objects, references, and the call stack as they change.',
    live: 'https://object-lab.vercel.app/', action: 'Open app',
    source: 'https://github.com/BarcaBoy109/object-lab',
    previewViewport: { width: 1280, height: 800 },
  },
  {
    id: 'matchalert', name: 'Match Alert',
    description: 'Football fixtures, results, and match reminders in Discord. Choose the teams you follow and where their alerts go.',
    live: 'https://discord.com/oauth2/authorize?client_id=1548667872451100682&permissions=19456&integration_type=0&scope=bot%20applications.commands',
    action: 'Add to Discord',
    website: 'https://barcaboy109.github.io/match-alert/',
    source: 'https://github.com/BarcaBoy109/match-alert',
  },
  {
    id: 'pdf-inverter', name: 'PDF Colour Inverter',
    description: 'Turn bright PDFs into darker documents while keeping text selectable. Files are processed in your browser.',
    live: 'https://pdf-colour-inverter.vercel.app/', action: 'Open app',
    source: 'https://github.com/BarcaBoy109/PDF-Colour-Inverter',
  },
  {
    id: 'resource-packer', name: 'Resource Packer',
    description: 'Replace Minecraft textures and sounds, then export a resource pack. Browse the catalog by edition and game version, and save your work on your device.',
    live: 'https://resource-packer.vercel.app/', action: 'Open app',
    source: 'https://github.com/BarcaBoy109/resource-packer',
    screenshot: 'resource-packer.png', screenshotWidth: 1917, screenshotHeight: 870,
  },
];

export const inDevelopment = [
  { name: 'CoursePlan', description: 'A course timetable planner with section comparison and conflict detection.' },
  { name: 'cohabit', description: 'Shared expenses, chores, and calendars for people living together.' },
];
