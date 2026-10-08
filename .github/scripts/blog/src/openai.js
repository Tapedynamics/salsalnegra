const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Current menu read (read-only) from the site: carta.html (ES) / en/menu.html (EN).
// Returns plain text "Category: dish — price (note)" plus opening hours, or '' if unavailable.
function loadMenuText(lang) {
  const file = path.join(process.env.SITE_ROOT || '', lang === 'es' ? 'carta.html' : path.join('en', 'menu.html'));
  let html;
  try {
    html = fs.readFileSync(file, 'utf8');
  } catch (err) {
    console.warn(`WARN: menu not readable (${file}): ${err.message}`);
    return '';
  }
  const clean = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const footerAt = html.indexOf('<footer');
  const main = footerAt > -1 ? html.slice(0, footerAt) : html;
  const lines = [];
  const re = /<h3>([\s\S]*?)<\/h3>|<h4>([\s\S]*?)<\/h4>\s*<span class="price">([\s\S]*?)<\/span>\s*<\/div>\s*(?:<p>([\s\S]*?)<\/p>)?/g;
  let m;
  while ((m = re.exec(main))) {
    if (m[1] !== undefined) lines.push(`\n${clean(m[1])}:`);
    else lines.push(`- ${clean(m[2])} — ${clean(m[3])}${m[4] ? ` (${clean(m[4])})` : ''}`);
  }
  const hours = html.slice(footerAt > -1 ? footerAt : 0).match(/<p><strong>([^<]+)<\/strong><br>(\d{1,2}:\d{2} - \d{1,2}:\d{2})<\/p>/);
  if (hours) lines.push(`\n${lang === 'es' ? 'Horario' : 'Opening hours'}: ${hours[1]} ${hours[2]}`);
  return lines.join('\n').trim();
}

function menuBlock(lang) {
  const menu = loadMenuText(lang);
  if (lang === 'es') {
    return menu
      ? `\n\nCarta actual de Sal Negra (única fuente para platos, precios y horarios del restaurante):\n${menu}`
      : '\n\nLa carta actual no está disponible: no cites platos, precios ni horarios de Sal Negra.';
  }
  return menu
    ? `\n\nCurrent Sal Negra menu (the only source for the restaurant's dishes, prices and opening hours):\n${menu}`
    : '\n\nThe current menu is unavailable: do not mention Sal Negra dishes, prices or opening hours.';
}

const MODEL = 'gpt-4o';

const SYSTEM_PROMPT_ES = `Eres redactor SEO para Sal Negra Tenerife, un restaurante con vistas al mar en Costa Adeje especializado en mariscos y cocina mediterránea (abierto desde 2008).
Tu misión: escribir artículos de blog útiles, honestos y con densidad natural de palabras clave para posicionar en Google España.

Reglas:
- Tono experto pero accesible, nada grandilocuente. Evita clichés turísticos.
- Incluye las palabras clave de forma natural en H2, H3 y primer párrafo.
- Estructura: introducción (2 párrafos) → 2-4 secciones H2 con H3 cuando aplique → conclusión con CTA sutil al restaurante.
- Longitud: 800-1100 palabras.
- Menciona ubicaciones reales del sur de Tenerife (Costa Adeje, Los Cristianos, Playa de las Américas, La Caleta) cuando sea relevante.
- Sal Negra se menciona máximo 2 veces, como ejemplo o CTA final.
- No inventes datos (cifras, estadísticas).
- Platos, precios y horarios SOLO de la carta actual de Sal Negra, que recibes en el mensaje: no menciones platos que no estén en ella ni des precios u horarios distintos.
- En temas informativos (por ejemplo, el gofio), relaciona el tema con los platos de Sal Negra de la carta que lo usan; si ninguno lo usa, no lo inventes.
- Devuelve SOLO HTML válido (p, h2, h3, ul, ol, li, strong, em, blockquote). NADA de <html>, <head> o <body>, solo el contenido interno del artículo.`;

const SYSTEM_PROMPT_EN = `You are an SEO writer for Sal Negra Tenerife, a seaside restaurant in Costa Adeje specialising in seafood and Mediterranean cuisine (open since 2008).
Your mission: write genuinely useful, honest blog articles with natural keyword density to rank on Google UK/IE.

Rules:
- Expert yet accessible tone, no tourist-brochure clichés.
- Weave target keywords naturally into H2, H3 and opening paragraph.
- Structure: intro (2 paragraphs) → 2-4 H2 sections with H3 where relevant → conclusion with a subtle restaurant CTA.
- Length: 800-1100 words.
- Reference real southern Tenerife locations (Costa Adeje, Los Cristianos, Playa de las Américas, La Caleta) when relevant.
- Sal Negra is mentioned at most twice — as an example, or in the final CTA.
- Do not invent data (figures, statistics).
- Dishes, prices and opening hours ONLY from Sal Negra's current menu, provided in the message: do not mention dishes that are not on it, and do not give different prices or hours.
- For informational topics (e.g. gofio), link the topic to the Sal Negra dishes on the menu that use it; if none does, do not make one up.
- Return ONLY valid HTML (p, h2, h3, ul, ol, li, strong, em, blockquote). No <html>, <head> or <body> — just the article's inner content.`;

async function generateArticleEs(topic) {
  const user = `Escribe un artículo para el blog de Sal Negra.

Título: ${topic.title_es}
Categoría: ${topic.category_es}
Ángulo/enfoque: ${topic.angle}
Palabras clave objetivo (úsalas de forma natural): ${topic.keywords_es.join(', ')}

Empieza directamente con un <p> (sin repetir el título). Cierra con una conclusión breve y una invitación sutil a reservar.${menuBlock('es')}`;

  const resp = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.7,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_ES },
      { role: 'user', content: user }
    ]
  });
  return resp.choices[0].message.content.trim();
}

async function generateArticleEn(topic) {
  const user = `Write an article for the Sal Negra blog.

Title: ${topic.title_en}
Category: ${topic.category_en}
Angle: ${topic.angle}
Target keywords (use them naturally): ${topic.keywords_en.join(', ')}

Open directly with a <p> (do not repeat the title). Close with a short conclusion and a subtle booking invitation.${menuBlock('en')}`;

  const resp = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.7,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT_EN },
      { role: 'user', content: user }
    ]
  });
  return resp.choices[0].message.content.trim();
}

async function generateExcerpt(text, lang) {
  const prompt = lang === 'es'
    ? `Extrae un extracto de 140-160 caracteres que funcione como meta description SEO. Responde solo con el texto, sin comillas.\n\nArtículo:\n${text.slice(0, 2500)}`
    : `Extract a 140-160 character excerpt that works as an SEO meta description. Respond with plain text only, no quotes.\n\nArticle:\n${text.slice(0, 2500)}`;

  const resp = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.4,
    messages: [{ role: 'user', content: prompt }]
  });
  return resp.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
}

module.exports = { generateArticleEs, generateArticleEn, generateExcerpt };
