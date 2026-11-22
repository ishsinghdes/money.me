import { readFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
execFileSync(process.execPath, [root + 'app/node_modules/typescript/bin/tsc', '--noEmit'], { cwd: root + 'app', stdio: 'inherit' });
execFileSync(process.execPath, [root + 'app/node_modules/vite/bin/vite.js', 'build'], { cwd: root + 'app', stdio: 'inherit' });
const dist = root + 'app/dist/';
let html = await readFile(dist + 'index.html', 'utf8');
const script = html.match(/<script[^>]+src="([^" ]+)"[^>]*><\/script>/)[0];
const style = html.match(/<link[^>]+rel="stylesheet"[^>]*>/)[0];
const assetPath = tag => dist + tag.match(/(?:src|href)="([^" ]+)"/)[1].replace(/^\.?\//, '');
let js = await readFile(assetPath(script), 'utf8');
const css = await readFile(assetPath(style), 'utf8');
for (const name of await readdir(dist + 'discovery')) {
  if (!name.endsWith('.webp')) continue;
  const bytes = await readFile(dist + 'discovery/' + name);
  js = js.replaceAll('/discovery/' + name, 'data:image/webp;base64,' + bytes.toString('base64'));
}
html = html.replace(script, '').replace(style, '').replace('</head>', '<style>' + css + '</style></head>');
html = html.replace('</body>', '<script type="module">' + js.replaceAll('</script', '<\\/script') + '</script></body>');
html = html.replace(/[ \t]+$/gm, '');
await Promise.all(['index.html', 'Money.me.html'].map(name => writeFile(root + name, html)));
console.log('Built self-contained Money.me HTML pages.');
