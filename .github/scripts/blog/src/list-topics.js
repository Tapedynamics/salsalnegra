const fs = require('fs');
const path = require('path');
const topics = require('./topics');

const statePath = path.join(__dirname, '..', 'state', 'published.json');
const published = new Set(JSON.parse(fs.readFileSync(statePath, 'utf8')).published.map((p) => p.id));

console.log('Topic pool (', topics.length, 'total,', topics.length - published.size, 'remaining):\n');

for (const t of topics) {
  const mark = published.has(t.id) ? '[X]' : '[ ]';
  console.log(`${mark} #${t.id.toString().padStart(2, '0')}  ${t.category_es.padEnd(12)}  ${t.title_es}`);
}
