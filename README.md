# Russian Grammar Guide

Interactive trainer for Russian noun, adjective, verb, numeral and pronoun endings.

English interface. Russian words are marked with `lang="ru"`.

## Live

- GitHub Pages: https://otlichnik612-glitch.github.io/russian-grammar-guide/
- Netlify (one click from this repo): [Deploy to Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/otlichnik612-glitch/russian-grammar-guide)

Netlify settings if you connect the repo by hand:

- Build command: `npm run build`
- Publish directory: `dist`

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:8080`).

## Build

```bash
npm run build
npm run preview
```

## What’s inside

- **Nouns, Adjectives, Verbs, Numerals, Pronouns** — step-by-step wizards
- **Transform my word** — type a dictionary form (or a digit for numerals) and get the inflected form
- Result screens with the rule, the ending, and examples

Stack: React, TypeScript, Vite, Tailwind CSS, React Router.
