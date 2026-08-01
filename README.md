# yarilomail website

<table><tr>
<td><img src="https://raw.githubusercontent.com/yarilomail/website/main/doc/logo.svg" width="110" alt="yarilomail logo"/></td>
<td>

Source for the [yarilomail.org](https://yarilomail.org) website — the
open-source mail server — built with [VitePress](https://vitepress.dev/) and
self-hosted on Kubernetes.

Licensed under **AGPLv3** — see [LICENSE](LICENSE).

[![CI](https://github.com/yarilomail/website/actions/workflows/ci.yml/badge.svg)](https://github.com/yarilomail/website/actions/workflows/ci.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)](LICENSE)
[![VitePress](https://img.shields.io/badge/VitePress-1.x-5c73e7?logo=vite&logoColor=white)](https://vitepress.dev/)
[![Container](https://img.shields.io/badge/ghcr.io-website-blue?logo=github)](https://github.com/yarilomail/website/pkgs/container/website)

</td>
</tr></table>

---

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

GitOps via ArgoCD on the microk8s cluster. The site is built into a small
`nginx:alpine` image, pushed to GHCR, and rolled out by ArgoCD.

- `main` branch → `yarilomail.org` (production, `helm_values/values-prod.yaml`)
- `develop` branch → `wwwdev.yarilomail.org` (staging, `helm_values/values-staging.yaml`)

Flow: push → `.github/workflows/deploy.yml` builds `Dockerfile`, pushes
`ghcr.io/yarilomail/website:<sha>`, and bumps the image tag in the matching
values file. ArgoCD (`argocd-app.yaml`) syncs the change into namespace
`yarilomail`.

TLS is issued by cert-manager (`letsencrypt-prod` ClusterIssuer, Cloudflare
DNS-01). The origin sits behind Cloudflare; the ingress is restricted to
Cloudflare IP ranges. Staging serves `X-Robots-Tag: noindex`.

### Layout

- `Dockerfile`, `deploy/nginx.conf` — image build + static serving
- `helm/` — chart (Deployment, Service, Ingress)
- `helm_values/` — per-environment values (prod, staging)
- `argocd-app.yaml` — ArgoCD Applications (prod + staging)
