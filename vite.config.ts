import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const SITE_TITLE = 'Power Automate Expression Interpreter'
const SITE_DESCRIPTION =
  'Evaluate Power Automate and Azure Logic Apps expressions in your browser. Define variables, use function intellisense and snippets—no Power Platform account required.'

function escapeAttr(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function escapeXmlText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Root-relative path to a file in `public/`, respecting VITE_BASE_PATH. */
function publicAssetPath(file: string): string {
  const base = process.env.VITE_BASE_PATH || '/'
  if (base === '/') return `/${file}`
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base
  return `${prefix}/${file}`
}

function seoPlugin(): Plugin {
  let outDir = path.resolve('dist')
  return {
    name: 'seo-build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    transformIndexHtml(html) {
      const raw = process.env.VITE_SITE_URL || 'http://localhost:5173/'
      const siteUrl = raw.endsWith('/') ? raw : `${raw}/`
      const pageUrl = siteUrl
      const imageUrl = new URL('og-image.png', siteUrl).href
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: pageUrl,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      }
      const head = `
    <meta name="description" content="${escapeAttr(SITE_DESCRIPTION)}" />
    <link rel="canonical" href="${escapeAttr(pageUrl)}" />
    <meta name="theme-color" content="#0e7490" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeAttr(SITE_TITLE)}" />
    <meta property="og:description" content="${escapeAttr(SITE_DESCRIPTION)}" />
    <meta property="og:url" content="${escapeAttr(pageUrl)}" />
    <meta property="og:image" content="${escapeAttr(imageUrl)}" />
    <meta property="og:site_name" content="${escapeAttr(SITE_TITLE)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(SITE_TITLE)}" />
    <meta name="twitter:description" content="${escapeAttr(SITE_DESCRIPTION)}" />
    <meta name="twitter:image" content="${escapeAttr(imageUrl)}" />
    <link rel="apple-touch-icon" href="${escapeAttr(publicAssetPath('icon.png'))}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
      return html
        .replace(/<title>[^<]*<\/title>/, `<title>${SITE_TITLE}</title>`)
        .replace('</title>', `</title>${head}`)
    },
    closeBundle() {
      const raw = process.env.VITE_SITE_URL || 'http://localhost:5173/'
      const siteUrl = raw.endsWith('/') ? raw : `${raw}/`
      const sitemapHref = new URL('sitemap.xml', siteUrl).href
      fs.writeFileSync(
        path.join(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${sitemapHref}\n`,
      )
      const loc = escapeXmlText(siteUrl)
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${loc}</loc>
  </url>
</urlset>
`
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), seoPlugin()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/**/*.test.ts', 'src/**/metadata.ts'],
    },
  },
})
