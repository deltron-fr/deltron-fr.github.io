# Kelechi Ogbonnaya — Portfolio

## Description

This is the source for Kelechi Ogbonnaya's personal portfolio at `deltron-fr.github.io`.

The portfolio is static and contains an engineering overview, selected work, an HTML resume, downloadable CVs, and contact links.

## How to build it

Requirements:

- Node.js `>= 22.12.0`
- `pnpm`

Install dependencies:

```sh
pnpm install
```

Start local development:

```sh
pnpm dev
```

Create a production build:

```sh
pnpm build
```

Preview the production build locally:

```sh
pnpm preview
```

Run the project checks:

```sh
pnpm lint
```

Build the static site:

```sh
pnpm build
```

## Deployment

The site is deployed to [deltron-fr.github.io](https://deltron-fr.github.io/) with GitHub Pages. Pushing to `main` runs the GitHub Actions workflow in `.github/workflows/deploy.yml`, builds the Astro site, and publishes the generated static files.

## What tech this website uses

- [Astro](https://astro.build/) for the site framework
- [TypeScript](https://www.typescriptlang.org/) for typed scripts and routes
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- Static output suitable for GitHub Pages or another static host
- [anime.js](https://animejs.com/) for motion
- [Satori](https://github.com/vercel/satori) and `sharp` for Open Graph image generation
- [unplugin-icons](https://github.com/unplugin/unplugin-icons) and Iconify for icons
