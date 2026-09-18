# Portfolio

Personal site built with [Astro](https://astro.build) and deployed to GitHub
Pages by the workflow in `.github/workflows/deploy.yml` on every push to
`main`. No servers, no cost.

## Run locally

```bash
npm install
npm run dev
```

## Add a project

Create one Markdown file in `src/content/projects/`. The site builds the
card, the project page and any series grouping from its front matter:

```md
---
title: "My Project"
summary: "One line that says what it does"
date: 2026-11-01
category: cybersec          # ai | cybersec | info-management | software (see src/categories.ts)
tags: [Python, FastAPI]
status: complete            # maintained | complete | in-progress | planned
series: "Some Series"       # optional - groups phases together
phase: 2                    # optional - order within the series
repo: https://github.com/you/repo
demo: https://example.com   # optional
cover: /images/my-project.png   # put the image in public/images/
frameLabel: "myapp.example.com" # text in the browser-frame title bar
featured: true              # show on the home page
order: 40                   # higher sorts first
---

Write the body in Markdown. Inline HTML/SVG works too.
```

Everything personal (name, headline, bio, links) lives in `src/site.ts`.
Category cards (the accordion under Projects) are defined in
`src/categories.ts`; a category with no projects shows a "Coming soon"
placeholder until its first Markdown file lands.

## Deploy

Push to `main`. In the GitHub repo settings, set **Pages → Source** to
**GitHub Actions** once; every later push deploys automatically.
