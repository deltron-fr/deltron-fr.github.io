import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/seo';

export const prerender = true;

const xmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
};

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (char) => xmlEscapeMap[char]);

type SitemapEntry = {
    url: string;
    lastmod?: string;
};

export const GET: APIRoute = () => {
    const entries: SitemapEntry[] = [
        { url: absoluteUrl('/') },
        { url: absoluteUrl('/resume/') },
    ];

    const body = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...entries.map(({ url, lastmod }) =>
            [
                '  <url>',
                `    <loc>${escapeXml(url)}</loc>`,
                lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : undefined,
                '  </url>',
            ]
                .filter(Boolean)
                .join('\n'),
        ),
        '</urlset>',
        '',
    ].join('\n');

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
};
