# yarilomail website

Source for the [yarilomail.org](https://yarilomail.org) website, built with
[VitePress](https://vitepress.dev/).

## Structure

npm workspace monorepo (one site for now, room for more subdomains later):

- `main/` → yarilomail.org

## Development

```sh
npm install
npm run -w main docs:dev      # local dev server with hot reload
npm run -w main docs:build    # production build -> main/.vitepress/dist
npm run -w main docs:preview  # preview the production build
```

## Content

- `main/index.md` + `main/.vitepress/theme/Home.vue` — landing page
- `main/news/*.md` — news entries (frontmatter: `date`, `title`, `link`)
- `main/security.md`, `main/support.md` — static pages
- `main/public/` — static assets (favicon, robots.txt)

## Deployment

- `develop` branch → wwwdev.yarilomail.org (staging)
- `main` branch → yarilomail.org (production)

Deployment runs via GitHub Actions and is gated on the `DEPLOY_KEY` secret; until
that is configured the workflow only builds the site.
