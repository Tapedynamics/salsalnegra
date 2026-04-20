#!/usr/bin/env node
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const topics = require('./topics');
const { generateArticleEs, generateArticleEn, generateExcerpt } = require('./openai');
const { renderPostEs, renderPostEn, renderCardEs, renderCardEn } = require('./templates');
const {
  prependCardToIndexEs,
  prependCardToIndexEn,
  addToSitemap,
  addNetlifyRedirects
} = require('./site-updaters');
const { commitAndPush } = require('./git');

const SITE_ROOT = process.env.SITE_ROOT;
const STATE_PATH = path.join(__dirname, '..', 'state', 'published.json');
const DRY_RUN = process.env.DRY_RUN === '1';

if (!SITE_ROOT) {
  console.error('ERROR: SITE_ROOT not set (see .env.example)');
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY not set');
  process.exit(1);
}

function loadState() {
  const raw = fs.readFileSync(STATE_PATH, 'utf8');
  return JSON.parse(raw);
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
}

function pickTopic(state) {
  if (process.env.TOPIC_ID) {
    const id = parseInt(process.env.TOPIC_ID, 10);
    const t = topics.find((x) => x.id === id);
    if (!t) throw new Error(`Topic id ${id} not found`);
    return t;
  }
  const publishedIds = new Set(state.published.map((p) => p.id));
  const next = topics.find((t) => !publishedIds.has(t.id));
  if (!next) throw new Error('All topics have been published. Add more in topics.js.');
  return next;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  console.log(`[${new Date().toISOString()}] Blog generator start. DRY_RUN=${DRY_RUN}`);

  const state = loadState();
  const topic = pickTopic(state);
  const date = todayIso();

  console.log(`Topic #${topic.id}: ${topic.title_es}`);

  console.log('Generating ES + EN articles in parallel...');
  const [bodyEs, bodyEn] = await Promise.all([
    generateArticleEs(topic),
    generateArticleEn(topic)
  ]);
  console.log(`  ES: ${bodyEs.length} chars · EN: ${bodyEn.length} chars`);

  console.log('Generating excerpts...');
  const [excerptEs, excerptEn] = await Promise.all([
    generateExcerpt(bodyEs, 'es'),
    generateExcerpt(bodyEn, 'en')
  ]);

  const image = topic.image || 'gallery1.jpg';

  const htmlEs = renderPostEs({ topic, bodyHtml: bodyEs, date, excerpt: excerptEs, image });
  const htmlEn = renderPostEn({ topic, bodyHtml: bodyEn, date, excerpt: excerptEn, image });

  const postPathEs = path.join(SITE_ROOT, 'blog', `${topic.slug_es}.html`);
  const postPathEn = path.join(SITE_ROOT, 'en', 'blog', `${topic.slug_en}.html`);

  if (DRY_RUN) {
    console.log('\n=== DRY RUN — files that would be written ===');
    console.log(postPathEs, `(${htmlEs.length} chars)`);
    console.log(postPathEn, `(${htmlEn.length} chars)`);
    console.log('Excerpt ES:', excerptEs);
    console.log('Excerpt EN:', excerptEn);
    return;
  }

  console.log('Writing post files...');
  fs.writeFileSync(postPathEs, htmlEs);
  fs.writeFileSync(postPathEn, htmlEn);

  console.log('Updating blog index pages...');
  const cardEs = renderCardEs({ topic, date, excerpt: excerptEs, image });
  const cardEn = renderCardEn({ topic, date, excerpt: excerptEn, image });
  prependCardToIndexEs(SITE_ROOT, cardEs);
  prependCardToIndexEn(SITE_ROOT, cardEn);

  console.log('Updating sitemap...');
  addToSitemap(SITE_ROOT, { topic, date });

  console.log('Updating netlify.toml redirects...');
  addNetlifyRedirects(SITE_ROOT, topic);

  state.published.push({
    id: topic.id,
    date,
    slug_es: topic.slug_es,
    slug_en: topic.slug_en
  });
  saveState(state);

  console.log('Committing and pushing...');
  const statePath = path.relative(SITE_ROOT, STATE_PATH).replace(/\\/g, '/');
  commitAndPush({
    siteRoot: SITE_ROOT,
    slug: topic.slug_es,
    branch: process.env.GIT_BRANCH || 'main',
    authorName: process.env.GIT_AUTHOR_NAME || 'Sal Negra Blog Bot',
    authorEmail: process.env.GIT_AUTHOR_EMAIL || 'blog-bot@salnegratenerife.com',
    paths: [
      `blog/${topic.slug_es}.html`,
      `en/blog/${topic.slug_en}.html`,
      'blog/index.html',
      'en/blog/index.html',
      'sitemap.xml',
      'netlify.toml',
      statePath
    ]
  });

  console.log('Done. Netlify will pick up the push and rebuild in ~1-2 minutes.');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
