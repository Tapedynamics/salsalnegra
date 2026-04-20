/**
 * HTML templates for blog posts (ES and EN).
 * Keep structure in sync with the handcrafted first post so the blog feels uniform.
 */

function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function jsonSafe(obj) {
  return JSON.stringify(obj, null, 2);
}

function renderPostEs({ topic, bodyHtml, date, excerpt, image }) {
  const url = `https://salnegratenerife.com/blog/${topic.slug_es}`;
  const urlEn = `https://salnegratenerife.com/en/blog/${topic.slug_en}`;
  const imgUrl = `https://salnegratenerife.com/images/${image}`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title_es,
    description: excerpt,
    image: imgUrl,
    datePublished: `${date}T09:00:00+00:00`,
    dateModified: `${date}T09:00:00+00:00`,
    inLanguage: 'es-ES',
    author: { '@type': 'Organization', name: 'Sal Negra Tenerife', url: 'https://salnegratenerife.com' },
    publisher: {
      '@type': 'Restaurant',
      name: 'Sal Negra Tenerife',
      logo: { '@type': 'ImageObject', url: 'https://salnegratenerife.com/images/logo-header.png' }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://salnegratenerife.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://salnegratenerife.com/blog/' },
      { '@type': 'ListItem', position: 3, name: topic.title_es, item: url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-7G77T77WRT"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-7G77T77WRT');
      gtag('config', 'AW-16644254944');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escape(excerpt)}">
    <meta name="keywords" content="${escape(topic.keywords_es.join(', '))}">
    <meta name="robots" content="index, follow">
    <title>${escape(topic.title_es)} | Sal Negra</title>

    <link rel="canonical" href="${url}">
    <link rel="icon" type="image/png" href="../images/logo-header.png">

    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escape(topic.title_es)}">
    <meta property="og:description" content="${escape(excerpt)}">
    <meta property="og:image" content="${imgUrl}">
    <meta property="og:locale" content="es_ES">
    <meta property="article:published_time" content="${date}T09:00:00+00:00">
    <meta property="article:author" content="Sal Negra Tenerife">
    <meta property="article:section" content="${escape(topic.category_es)}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escape(topic.title_es)}">
    <meta name="twitter:description" content="${escape(excerpt)}">
    <meta name="twitter:image" content="${imgUrl}">

    <link rel="alternate" hreflang="es" href="${url}">
    <link rel="alternate" hreflang="en" href="${urlEn}">
    <link rel="alternate" hreflang="x-default" href="${url}">

    <script type="application/ld+json">
${jsonSafe(articleLd)}
    </script>

    <script type="application/ld+json">
${jsonSafe(breadcrumbLd)}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Poppins:wght@300;400;500;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="../css/style.css?v=15">
    <link rel="stylesheet" href="blog.css?v=1">
</head>
<body>
    <nav class="navbar" id="navbar">
        <div class="container">
            <a href="../index.html" class="nav-brand">
                <img src="../images/logo-header.png" alt="Sal Negra">
            </a>
            <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
                <span></span><span></span><span></span>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="../index.html">INICIO</a></li>
                <li><a href="../sobre-nosotros.html">SOBRE NOSOTROS</a></li>
                <li><a href="../carta.html">CARTA</a></li>
                <li><a href="../reservas.html">RESERVAS</a></li>
                <li><a href="../menus-especiales.html">MENÚS ESPECIALES</a></li>
                <li><a href="../eventos.html">EVENTOS</a></li>
                <li><a href="index.html" class="active">BLOG</a></li>
                <li><a href="../contacto.html">CONTACTO</a></li>
            </ul>
        </div>
    </nav>

    <div class="blog-lang-switch" style="margin-top:80px;">
        Leyendo en español · <a href="../en/blog/${topic.slug_en}.html">Read in English</a>
    </div>

    <section class="post-hero" style="background-image: url('../images/${image}'); margin-top:0;">
        <div class="post-hero-inner">
            <div class="post-hero-meta">${escape(topic.category_es)} · ${formatDateEs(date)}</div>
            <h1>${escape(topic.title_es)}</h1>
        </div>
    </section>

    <article class="post-body">
${bodyHtml}
    </article>

    <div class="post-cta">
        <h3>Reserva tu mesa en Sal Negra</h3>
        <p>Mariscos frescos del día, vistas al mar y cocina mediterránea en el corazón de Costa Adeje.</p>
        <a href="../reservas.html" class="btn btn-primary">Reservar ahora</a>
    </div>

    <div class="post-nav">
        <a href="index.html">← Volver al blog</a>
    </div>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Sal Negra Tenerife</h4>
                    <p>Restaurante con vistas al mar en el sur de Tenerife. Cocina mediterránea y productos frescos de calidad.</p>
                </div>
                <div class="footer-section">
                    <h4>Contacto</h4>
                    <p><strong>Dirección:</strong><br>Avda. La Habana<br>Centro Comercial San Telmo<br>Local 13 b, Tenerife</p>
                    <p><strong>Teléfono:</strong><br><a href="tel:922306958">922 30 69 58</a></p>
                </div>
                <div class="footer-section">
                    <h4>Horarios</h4>
                    <p><strong>Lunes a Domingo</strong><br>13:00 - 00:00</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2008 Sal Negra Tenerife. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script src="../js/script.js?v=5"></script>
</body>
</html>
`;
}

function renderPostEn({ topic, bodyHtml, date, excerpt, image }) {
  const urlEs = `https://salnegratenerife.com/blog/${topic.slug_es}`;
  const url = `https://salnegratenerife.com/en/blog/${topic.slug_en}`;
  const imgUrl = `https://salnegratenerife.com/images/${image}`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title_en,
    description: excerpt,
    image: imgUrl,
    datePublished: `${date}T09:00:00+00:00`,
    dateModified: `${date}T09:00:00+00:00`,
    inLanguage: 'en',
    author: { '@type': 'Organization', name: 'Sal Negra Tenerife', url: 'https://salnegratenerife.com' },
    publisher: {
      '@type': 'Restaurant',
      name: 'Sal Negra Tenerife',
      logo: { '@type': 'ImageObject', url: 'https://salnegratenerife.com/images/logo-header.png' }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://salnegratenerife.com/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://salnegratenerife.com/en/blog/' },
      { '@type': 'ListItem', position: 3, name: topic.title_en, item: url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-7G77T77WRT"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-7G77T77WRT');
      gtag('config', 'AW-16644254944');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escape(excerpt)}">
    <meta name="keywords" content="${escape(topic.keywords_en.join(', '))}">
    <meta name="robots" content="index, follow">
    <title>${escape(topic.title_en)} | Sal Negra</title>

    <link rel="canonical" href="${url}">
    <link rel="icon" type="image/png" href="../../images/logo-header.png">

    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escape(topic.title_en)}">
    <meta property="og:description" content="${escape(excerpt)}">
    <meta property="og:image" content="${imgUrl}">
    <meta property="og:locale" content="en_GB">
    <meta property="og:locale:alternate" content="es_ES">
    <meta property="article:published_time" content="${date}T09:00:00+00:00">
    <meta property="article:author" content="Sal Negra Tenerife">
    <meta property="article:section" content="${escape(topic.category_en)}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escape(topic.title_en)}">
    <meta name="twitter:description" content="${escape(excerpt)}">
    <meta name="twitter:image" content="${imgUrl}">

    <link rel="alternate" hreflang="es" href="${urlEs}">
    <link rel="alternate" hreflang="en" href="${url}">
    <link rel="alternate" hreflang="x-default" href="${urlEs}">

    <script type="application/ld+json">
${jsonSafe(articleLd)}
    </script>

    <script type="application/ld+json">
${jsonSafe(breadcrumbLd)}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Poppins:wght@300;400;500;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="../../css/style.css?v=15">
    <link rel="stylesheet" href="../../blog/blog.css?v=1">
</head>
<body>
    <nav class="navbar" id="navbar">
        <div class="container">
            <a href="../../index.html" class="nav-brand">
                <img src="../../images/logo-header.png" alt="Sal Negra">
            </a>
            <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
                <span></span><span></span><span></span>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="../../index.html">HOME</a></li>
                <li><a href="../../sobre-nosotros.html">ABOUT</a></li>
                <li><a href="../../carta.html">MENU</a></li>
                <li><a href="../../reservas.html">BOOKING</a></li>
                <li><a href="../../menus-especiales.html">SPECIAL MENUS</a></li>
                <li><a href="../../eventos.html">EVENTS</a></li>
                <li><a href="index.html" class="active">BLOG</a></li>
                <li><a href="../../contacto.html">CONTACT</a></li>
            </ul>
        </div>
    </nav>

    <div class="blog-lang-switch" style="margin-top:80px;">
        Reading in English · <a href="../../blog/${topic.slug_es}.html">Leer en Español</a>
    </div>

    <section class="post-hero" style="background-image: url('../../images/${image}'); margin-top:0;">
        <div class="post-hero-inner">
            <div class="post-hero-meta">${escape(topic.category_en)} · ${formatDateEn(date)}</div>
            <h1>${escape(topic.title_en)}</h1>
        </div>
    </section>

    <article class="post-body">
${bodyHtml}
    </article>

    <div class="post-cta">
        <h3>Book a table at Sal Negra</h3>
        <p>Daily fresh seafood, sea views and Mediterranean cooking at the heart of Costa Adeje.</p>
        <a href="../../reservas.html" class="btn btn-primary">Book now</a>
    </div>

    <div class="post-nav">
        <a href="index.html">← Back to blog</a>
    </div>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Sal Negra Tenerife</h4>
                    <p>Seaside restaurant in southern Tenerife. Mediterranean cuisine and fresh, high-quality produce.</p>
                </div>
                <div class="footer-section">
                    <h4>Contact</h4>
                    <p><strong>Address:</strong><br>Avda. La Habana<br>Centro Comercial San Telmo<br>Local 13 b, Tenerife</p>
                    <p><strong>Phone:</strong><br><a href="tel:922306958">+34 922 30 69 58</a></p>
                </div>
                <div class="footer-section">
                    <h4>Opening hours</h4>
                    <p><strong>Monday to Sunday</strong><br>1 pm - midnight</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2008 Sal Negra Tenerife. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../../js/script.js?v=5"></script>
</body>
</html>
`;
}

function formatDateEs(iso) {
  const [y, m, d] = iso.split('-');
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}
function formatDateEn(iso) {
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

function renderCardEs({ topic, date, excerpt, image }) {
  return `                <article class="blog-card">
                    <a href="${topic.slug_es}.html" class="blog-card-image">
                        <img src="../images/${image}" alt="${escape(topic.title_es)}" loading="lazy">
                    </a>
                    <div class="blog-card-body">
                        <div class="blog-card-meta">
                            <span>${escape(topic.category_es)}</span><span class="sep">·</span><time datetime="${date}">${formatDateEs(date)}</time>
                        </div>
                        <h2><a href="${topic.slug_es}.html">${escape(topic.title_es)}</a></h2>
                        <p class="blog-card-excerpt">${escape(excerpt)}</p>
                        <a href="${topic.slug_es}.html" class="blog-card-link">Leer más</a>
                    </div>
                </article>
`;
}

function renderCardEn({ topic, date, excerpt, image }) {
  return `                <article class="blog-card">
                    <a href="${topic.slug_en}.html" class="blog-card-image">
                        <img src="../../images/${image}" alt="${escape(topic.title_en)}" loading="lazy">
                    </a>
                    <div class="blog-card-body">
                        <div class="blog-card-meta">
                            <span>${escape(topic.category_en)}</span><span class="sep">·</span><time datetime="${date}">${formatDateEn(date)}</time>
                        </div>
                        <h2><a href="${topic.slug_en}.html">${escape(topic.title_en)}</a></h2>
                        <p class="blog-card-excerpt">${escape(excerpt)}</p>
                        <a href="${topic.slug_en}.html" class="blog-card-link">Read more</a>
                    </div>
                </article>
`;
}

module.exports = { renderPostEs, renderPostEn, renderCardEs, renderCardEn, escape };
