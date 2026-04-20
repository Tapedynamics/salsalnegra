const fs = require('fs');
const path = require('path');
const { renderCardEs, renderCardEn } = require('./templates');

function insertAfter(haystack, marker, insertion) {
  const idx = haystack.indexOf(marker);
  if (idx === -1) throw new Error(`Marker not found: ${marker}`);
  const cut = idx + marker.length;
  return haystack.slice(0, cut) + '\n' + insertion + haystack.slice(cut);
}

function prependCardToIndexEs(siteRoot, card) {
  const p = path.join(siteRoot, 'blog', 'index.html');
  const html = fs.readFileSync(p, 'utf8');
  const updated = insertAfter(html, '<!-- POSTS START -->', card.trimEnd());
  fs.writeFileSync(p, updated);
}

function prependCardToIndexEn(siteRoot, card) {
  const p = path.join(siteRoot, 'en', 'blog', 'index.html');
  const html = fs.readFileSync(p, 'utf8');
  const updated = insertAfter(html, '<!-- POSTS START -->', card.trimEnd());
  fs.writeFileSync(p, updated);
}

function addToSitemap(siteRoot, { topic, date }) {
  const p = path.join(siteRoot, 'sitemap.xml');
  const xml = fs.readFileSync(p, 'utf8');

  const esUrl = `https://salnegratenerife.com/blog/${topic.slug_es}`;
  const enUrl = `https://salnegratenerife.com/en/blog/${topic.slug_en}`;

  const entries = `  <url>
    <loc>${esUrl}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esUrl}"/>
  </url>
  <url>
    <loc>${enUrl}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esUrl}"/>
  </url>
`;

  const updated = xml.replace('</urlset>', entries + '</urlset>');
  fs.writeFileSync(p, updated);
}

function addNetlifyRedirects(siteRoot, topic) {
  const p = path.join(siteRoot, 'netlify.toml');
  const toml = fs.readFileSync(p, 'utf8');

  const marker = '# 404 fallback';
  const entries = `# Auto-generated blog redirect (${topic.slug_es})
[[redirects]]
  from = "/blog/${topic.slug_es}.html"
  to = "/blog/${topic.slug_es}"
  status = 301
  force = true

[[redirects]]
  from = "/en/blog/${topic.slug_en}.html"
  to = "/en/blog/${topic.slug_en}"
  status = 301
  force = true

`;

  const idx = toml.indexOf(marker);
  if (idx === -1) throw new Error('404 fallback marker not found in netlify.toml');
  const updated = toml.slice(0, idx) + entries + toml.slice(idx);
  fs.writeFileSync(p, updated);
}

module.exports = {
  prependCardToIndexEs,
  prependCardToIndexEn,
  addToSitemap,
  addNetlifyRedirects
};
