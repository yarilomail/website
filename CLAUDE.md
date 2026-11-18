# yarilomail website - conventions

Extends the workspace-level `/CLAUDE.md`. All global rules apply.

This repo (`yarilomail/website`) is the source of https://yarilomail.org: the
landing page, the news posts and the Security, Support and Donate pages. The
product's documentation is not here: it lives in `yarilomail/documentation`
and is published at https://doc.yarilomail.org.

Everything on the site is written in **English only**.

`README.md` describes the structure, the development commands and the
deployment. This file holds the rules for changing the site.

---

## How changes reach the site

1. Branch from fresh `develop` (`news/...`, `seo/...`, `fix/...`, `chore/...`).
2. Edit; build and run the checks locally (What is checked).
3. Open a PR into `develop`, title and description in English. One open PR at
   a time.
4. The user reviews and merges. Never merge yourself.
5. `develop` builds the image, scans it and rolls it out to
   `wwwdev.yarilomail.org`, which is served `noindex`.
6. A release is a PR from `develop` into `main` titled `release: <version>`.
   Its description says what changed for a reader of the site and names the
   run in which the develop image passed the scan. Merging it publishes the
   version, the git tag and the GitHub release, and rolls out
   `yarilomail.org`.

Never push to `main` or `develop` directly.

## Version

`version` and `appVersion` in `helm/Chart.yaml` move together, in the same PR
as the change, whenever the built site or the image changes: a page, a news
post, the theme, `.vitepress/config.mts`, the Dockerfile, the chart. The PR
title ends with the new version (`...; 0.1.52`).

No bump for a change that does not reach the image: `README.md`, this file,
a workflow, a check script.

## Pages

- `main/index.md` carries the home page's frontmatter only; its content is
  `main/.vitepress/theme/Home.vue`.
- `main/security.md`, `main/support.md`, `main/donate.md` are the static
  pages; the advisories on Security come from
  `main/.vitepress/data/advisories.json`.
- `main/news/*.md` are the news posts.

Every page:

- has `title` and `description` in its frontmatter (Search metadata);
- has exactly one `<h1>`;
- links to another page of this site with its `.html` URL
  (`/support.html`, not `/support`): every page but the home page is served
  and indexed under `.html`;
- gives every image alt text that says what it shows.

A published page's URL is permanent: a renamed page loses its place in
search and breaks every link to it.

## News posts

A post is `main/news/YYYY-MM-DD-<slug>.md`, the date being the day it is
published.

```yaml
---
date: 16 Nov 2026
title: "YariloMail 2.4.7: TLS before passwords, a Sieve sender that logs in"
link: /news/2026-11-16-yarilo-2-4-7.html
image: /news/2026-11-16-yarilo-2-4-7.png
imageAlt: "Card: YariloMail 2.4.7: TLS before passwords, a Sieve sender that logs in"
description: "YariloMail 2.4.7 refuses cleartext passwords on an unsecured connection by default, makes the Sieve sender log in and verify its MTA, opens EXAMINE read-only."
---

# YariloMail 2.4.7: TLS before passwords, a Sieve sender that logs in

*16 November 2026*
```

- `title` is the post's **headline**: it is the `# H1`, the line in the post
  list on the home page, the text drawn on the card and the `headline` of the
  post's structured data. It opens with the brand. A release post reads
  `YariloMail X.Y.Z: <the two or three things that matter>`.
- The page title is built from the headline, not written: the leading
  `YariloMail ` is dropped and ` | YariloMail` appended, so the brand stands
  once, at the end, as on every other page. With the suffix it must fit 70
  characters, which leaves the headline 68; aim for a headline that leaves
  the page title at 60 or under.
- `link` is the post's own URL, with `.html`.
- `image` is the post's card, 1200 by 630, made by
  `node scripts/og-card.mjs main/news/<post>.md` (needs `rsvg-convert` and
  IBM Plex Sans). The part of the headline after the colon must fit three
  lines of about 40 characters on it, or the script stops. `imageAlt` is
  `Card: <headline>`.
- `description`: see Search metadata.
- `updated`, the same form as `date`, when a published post is corrected; it
  becomes the post's last-modified date in the sitemap and in its structured
  data.

A published post keeps its headline. If it has to change, the card is made
again, since the headline is drawn on it.

## Search metadata

What a search engine, a link preview and an AI crawler read from a page. Two
fields are written by hand on every page; everything else is generated from
them and is never written by hand.

### Written on every page: `title` and `description`

**`title`**, for a page that is not a news post, is the line a search result
shows as its link.

- It names what the page is for, the way a person would search for it:
  "Donate to an open-source mail server", "Security: report a vulnerability,
  advisories". One word ("Donate", "Security") is never enough.
- At most 47 characters: the site appends ` | YariloMail` (13 characters) and
  a result page shows about 60.
- Unique across the site.
- No brand in it: the suffix carries the brand once. This holds for the home
  page too ("Open-source mail server: IMAP, JMAP, Kubernetes").
- For a news post see News posts: there the field is the headline.

**`description`** is the text under that link, on every page and every post.

- 120 to 160 characters: shorter wastes the line, longer is cut.
- It says what the page or the release is about, subject first. A release
  post names the version and its two or three main changes, not all of them.
- Unique across the site, and not a copy of the title.
- No call to action ("Learn more", "Read on").
- No double quote inside it; the value is one YAML string.

### Choosing the words

A term goes into a title or a description only when the page is about it.

- Start from what people type: "open-source mail server", "self-hosted mail
  server", "mail server on Kubernetes", "IMAP", "JMAP". Search suggestions
  for the subject show the wording; ask for them with the generic subject,
  never with the project's name.
- One term once. Repeating a word to rank for it reads as spam to a search
  engine and to a person.

### Generated: never write these by hand

`main/.vitepress/config.mts` builds them for every page. Do not add a `head:`
block to a page's frontmatter for any of them.

| What | Built from |
|:---|:---|
| `<title>` | `title` + ` \| YariloMail`; for a news post the headline without its leading brand |
| `<meta name="description">` | `description` |
| `og:title` | the same text as `<title>` |
| `og:description` | `description` |
| `og:url`, `<link rel="canonical">` | the page's own URL, with `.html` |
| `og:type` | `article` for a news post, `website` otherwise |
| `og:image`, `twitter:image`, `og:image:alt` | a post's `image` and `imageAlt`; the site's card for every other page |
| `article:published_time`, `article:modified_time` | a post's `date` and `updated` |
| JSON-LD | the home page: `Organization`, `WebSite`, `SoftwareApplication`, `SoftwareSourceCode`; a news post: `BlogPosting` with the headline, the description and the dates |
| `sitemap.xml` | every page, a post with its last-modified date |
| `llms.txt` | the static pages and every post, each with its title and description |

There is no `keywords` meta tag and none is to be added: search engines do
not use it.

The site-wide `description` in `config.mts` is the fallback for a page that
has none, so that a build never ships an empty tag. It is not a way to skip
writing one.

### When a change reaches search

Search engines see `yarilomail.org` only: staging is `noindex`. A change
reaches them with the release that merges `develop` into `main`; that release
also pings IndexNow with the URLs of the live sitemap. The IndexNow key file
in `main/public/` must stay where it is.

## What is checked

Every PR builds the site and runs:

| Check | Fails when |
|:---|:---|
| `npm run -w main test` | a unit test fails |
| `npm audit --audit-level=high` | a dependency has a high or critical advisory |
| `scripts/check-titles.mjs` | a page title is missing or longer than 70 characters |
| `scripts/check-meta.mjs` | a title lacks the ` \| YariloMail` suffix or repeats another page's; a description is outside 120 to 160 characters or repeats another page's; a `keywords` tag appears |
| `scripts/check-urls.mjs` | a link to a page of this site has no `.html` |
| `scripts/check-h1.mjs` | a page does not have exactly one `<h1>` |

Run them before a commit:

```sh
npm run -w main test
npm run -w main docs:build
for c in check-titles check-meta check-urls check-h1; do node scripts/$c.mjs main/.vitepress/dist; done
```
