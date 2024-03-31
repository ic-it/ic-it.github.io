import { defineConfig, squooshImageService } from "astro/config";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://ic-it.github.io",
  compressHTML: true,
  scopedStyleStrategy: "class",
  image: {
    service: squooshImageService(),
  },
  markdown: {
    remarkPlugins: [
      "remark-math"
    ],
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            class: "heading-linker",
          },
        },
      ],
      [
        'rehype-katex',
        {
          // Katex plugin options
        }
      ],
    ],
  },
  integrations: [svelte()],
});
