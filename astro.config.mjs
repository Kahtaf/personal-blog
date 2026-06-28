import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import inlineReview from "review-loop";

export default defineConfig({
  site: "https://kahtaf.com",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    sitemap(),
    inlineReview({
      storagePath: ".blog-edits/review-loop.json",
    }),
  ],
});
