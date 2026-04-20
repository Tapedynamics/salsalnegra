# Sal Negra Blog Automation (GitHub Actions)

Weekly bilingual (ES + EN) blog generator for `salnegratenerife.com`, runs as a GitHub Action.

## How it runs

Every Monday 08:00 UTC (≈09:00 CET / 10:00 CEST) the workflow `.github/workflows/blog-weekly.yml`:

1. Checks out the site repo.
2. Installs deps from `.github/scripts/blog/package-lock.json`.
3. Picks the next unused topic from `src/topics.js` (or a pinned one via manual dispatch).
4. Generates an SEO-oriented article in Spanish via GPT-4o.
5. Generates a parallel article in English.
6. Writes `blog/<slug-es>.html` and `en/blog/<slug-en>.html`.
7. Updates `blog/index.html`, `en/blog/index.html`, `sitemap.xml`, `netlify.toml`.
8. Commits the changes back to `main` with `Sal Negra Blog Bot` identity.

Netlify picks up the push and rebuilds automatically.

## Setup (one-time)

Add the OpenAI key as a GitHub Secret on the repo:

1. https://github.com/Tapedynamics/salsalnegra/settings/secrets/actions
2. `New repository secret`
3. Name: `OPENAI_API_KEY`, Value: the key (same one used by the gestionale).
4. Save.

No server setup, no SSH keys, no `.env` files on prod.

## Manual run

From the Actions tab → `Weekly Blog Post` → `Run workflow`:

- Leave inputs empty → generates the next unused topic.
- `topic_id`: pin a specific entry from `src/topics.js` (e.g. `5`).
- `dry_run: true`: generate nothing, just log what would happen.

## Local testing

```bash
cd .github/scripts/blog
npm install
cp .env.example .env
# Fill OPENAI_API_KEY and SITE_ROOT (absolute path to the site repo root)
DRY_RUN=1 npm run generate   # no files written, no commit
npm run list-topics          # see pool with [X] published markers
```

## State

`state/published.json` is committed back by the bot after each run — this is how the bot knows which topics to skip. Never hand-edit it during a run.

## Adding topics

Append entries to `src/topics.js`. Each needs a unique `id`. After the pool runs out the workflow fails gracefully until new topics are added.

## Rollback a bad post

```bash
git revert <commit-sha>
# Edit state/published.json to drop the last entry so the topic can re-run.
git push
```
