import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import inlineReview from "review-loop";

export default defineConfig({
  site: "https://kahtaf.com",
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    inlineReview({
      storagePath: ".blog-edits/review-loop.json",
    }),
  ],
});
