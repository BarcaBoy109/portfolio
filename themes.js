export const themes = {
  monsoon: { name:'Raining', accent:'#91d3d2' },
  spring: { name:'Spring', note:'A little room for new beginnings.', symbol:'✿', accent:'#c0d99b', rgb:'192,217,155', secondary:'#526f44' },
  summer: { name:'Summer', note:'Long days. Bright ideas.', symbol:'☀', accent:'#f4cd70', rgb:'244,205,112', secondary:'#ad632b' },
  autumn: { name:'Autumn', note:'A season for making something meaningful.', symbol:'✳', accent:'#eaa57a', rgb:'234,165,122', secondary:'#894733' },
  winter: { name:'Winter', note:'Quiet moments. Clear possibilities.', symbol:'❄', accent:'#a9c9ee', rgb:'169,201,238', secondary:'#45638f' },
  celebration: { name:'Celebration', note:'Some days deserve a little extra magic.', symbol:'✦', accent:'#d7b0f5', rgb:'215,176,245', secondary:'#8b4b98' },
};
// Annual dates use MM-DD. Exact dates use YYYY-MM-DD. First matching event wins.
// Add your birthday, anniversary, graduation, or any day worth celebrating here.
export const specialDays = [
  { date:'11-12', theme:'celebration', title:'Celebration' },
  { date:'05-16', theme:'celebration', title:'Celebration' },
  { date:'01-05', theme:'celebration', title:'Celebration' },
  { date:'05-02', theme:'celebration', title:'Celebration' },
  { date:'08-18', theme:'celebration', title:'Celebration' },
  { date:'07-13', theme:'celebration', title:'Celebration' },
  { date:'07-04', theme:'celebration', title:'Celebration' },
  { date:'03-24', theme:'celebration', title:'Celebration' },
];
export function resolveTheme(date = new Date(), events = specialDays, timeZone = 'Asia/Singapore') {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).map(p=>[p.type,p.value]));
  const annual = `${parts.month}-${parts.day}`;
  const exact = `${parts.year}-${annual}`;
  const event = events.find(e=>e.enabled !== false && (e.date === annual || e.date === exact) && themes[e.theme]);
  if(event) return {key:event.theme, occasion:event.title};
  const month = Number(parts.month);
  return {key:month>=3&&month<=5?'spring':month>=6&&month<=8?'summer':month>=9&&month<=11?'autumn':'winter',occasion:null};
}
