const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const files = ['index.html', 'script.js', 'styles.css', 'README.md', 'LICENSE'];

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true });
}
fs.mkdirSync(dist, { recursive: true });

files.forEach(file => {
  const src = path.join(__dirname, '..', file);
  const dest = path.join(dist, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

console.log('Build REPLACE COMPLETE: MOVE ', files.length, 'files to dist/');
