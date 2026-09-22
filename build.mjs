// Builds dist/ from content/site.json + src/. Run with: npm run build
import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { render } from './src/render.mjs';

const out = 'dist';

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const data = JSON.parse(await readFile('content/site.json', 'utf8'));
const css = await readFile('src/styles.css', 'utf8');

await writeFile(`${out}/index.html`, render(data, css.trimEnd()));

// Photos and the CMS ship as-is.
if (existsSync('img')) await cp('img', `${out}/img`, { recursive: true });
if (existsSync('admin')) await cp('admin', `${out}/admin`, { recursive: true });

console.log('Built dist/index.html');
