import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { AstroConfig } from 'astro';

export async function GET(astro_config: AstroConfig) {
  const blog = await getCollection('blog');
  // content "read on the blog at [link]"
  return rss({
    title: 'IC-IT’s Blog',
    description: 'Blog about software engineering and other things.',
    site: astro_config.site || '[NOT SET?]',
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publicationDate,
      description: post.data.description,
      link: `/${post.slug}/`,
      content: `Read on the blog at <a href="${astro_config.site}${post.slug}/">${astro_config.site}${post.slug}/</a>`,
    })),
  });
}