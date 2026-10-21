import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = new Set(['index.html','styles.css','app.js','content.js','themes.js','weather.js']);
const types = { html:'text/html',css:'text/css',js:'text/javascript',ttf:'font/ttf',jpg:'image/jpeg',png:'image/png' };
for (const id of ['objectlab','matchalert','pdf-inverter']) files.add(`assets/screenshots/${id}.jpg`);
files.add('assets/screenshots/resource-packer.png');
files.add('assets/fonts/syne.ttf');
files.add('assets/fonts/public-sans.ttf');
files.add('preview.html');
http.createServer(async (req,res) => {
  const path = new URL(req.url,'http://localhost').pathname.slice(1) || 'index.html';
  if (!files.has(path)) { res.writeHead(404); res.end('Not found'); return; }
  try { const data = await readFile(new URL(path,import.meta.url)); res.writeHead(200,{'Content-Type':types[path.split('.').pop()]}); res.end(data); }
  catch { res.writeHead(500); res.end('Unable to read file'); }
}).listen(5173,'127.0.0.1',()=>console.log('Portfolio: http://localhost:5173'));
