import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import inlineReview from "review-loop";
import { rehypeBlogImageLightbox } from "./src/lib/rehype-blog-image-lightbox.mjs";

function syncBlogLightboxAnchors() {
  return {
    name: "sync-blog-lightbox-anchors",
    hooks: {
      async "astro:build:done"({ dir }) {
        const outputDir = path.resolve(fileURLToPath(dir));
        const htmlFiles = await findHtmlFiles(path.join(outputDir, "blog"));

        await Promise.all(
          htmlFiles.map(async (filePath) => {
            const html = await fs.readFile(filePath, "utf8");
            const updated = html.replace(
              /<a\b(?=[^>]*\bdata-blog-lightbox-image\b)([^>]*)>(\s*<img\b([^>]*)>)/g,
              (match, anchorAttributes, imageHtml, imageAttributes) => {
                const imageSrc = getHtmlAttribute(imageAttributes, "src");
                if (!imageSrc) return match;

                const syncedAnchorAttributes = setHtmlAttribute(
                  setHtmlAttribute(anchorAttributes, "href", imageSrc),
                  "data-pswp-src",
                  imageSrc,
                );

                return `<a${syncedAnchorAttributes}>${imageHtml}`;
              },
            );

            if (updated !== html) {
              await fs.writeFile(filePath, updated);
            }
          }),
        );
      },
    },
  };
}

async function findHtmlFiles(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
      entries.map((entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return findHtmlFiles(entryPath);
        if (entry.isFile() && entry.name.endsWith(".html")) return [entryPath];
        return [];
      }),
    );

    return files.flat();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function getHtmlAttribute(attributes, name) {
  const match = attributes.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return match?.[1];
}

function setHtmlAttribute(attributes, name, value) {
  const escapedValue = escapeHtmlAttribute(value);
  const attributePattern = new RegExp(`\\s${name}="[^"]*"`, "i");

  if (attributePattern.test(attributes)) {
    return attributes.replace(attributePattern, ` ${name}="${escapedValue}"`);
  }

  return `${attributes} ${name}="${escapedValue}"`;
}

function escapeHtmlAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

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
    syncBlogLightboxAnchors(),
  ],
  markdown: {
    // Astro 7's default Satteri processor does not run custom rehype plugins.
    // Keep unified explicit and keep the plugin scoped internally to blog files.
    processor: unified({
      rehypePlugins: [rehypeBlogImageLightbox],
    }),
  },
});
