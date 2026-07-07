import { type CollectionEntry, getCollection } from "astro:content";
import path from "node:path";
import { ABOUT, BLOG, HOME, PROJECTS, RESUME, WORK } from "@consts";
import { cleanSlug } from "@lib/utils";
import { renderOgImage, type OgImageInput } from "@lib/og-image";

export const prerender = true;

type OgPage = OgImageInput & {
  slug: string;
};

const STATIC_PAGES: OgPage[] = [
  { slug: "home", title: HOME.TITLE },
  { slug: "404", title: "Page Not Found" },
  { slug: "about", title: ABOUT.TITLE },
  { slug: "blog", title: BLOG.TITLE },
  { slug: "work", title: WORK.TITLE },
  { slug: "resume", title: RESUME.TITLE },
  { slug: "projects", title: PROJECTS.TITLE },
];

function firstMarkdownImage(body?: string): string | undefined {
  return body?.match(/!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/)?.[1];
}

function contentDir(collection: "blog" | "projects", id: string): string {
  return path.join(process.cwd(), "src", "content", collection, id);
}

function blogPage(post: CollectionEntry<"blog">): OgPage {
  const image = post.data.image ?? firstMarkdownImage(post.body);

  return {
    slug: `blog/${cleanSlug(post.id)}`,
    title: post.data.title,
    date: post.data.date,
    image,
    imageBaseDir: contentDir("blog", post.id),
  };
}

function projectPage(project: CollectionEntry<"projects">): OgPage {
  const image = project.data.image ?? firstMarkdownImage(project.body);

  return {
    slug: `projects/${cleanSlug(project.id)}`,
    title: project.data.title,
    date: project.data.date,
    image,
    imageBaseDir: contentDir("projects", project.id),
  };
}

export async function getStaticPaths() {
  const posts = (await getCollection("blog")).filter((post) => !post.data.draft).map(blogPage);
  const projects = (await getCollection("projects")).filter((project) => !project.data.draft).map(projectPage);

  return [...STATIC_PAGES, ...posts, ...projects].map((page) => ({
    params: { slug: page.slug },
    props: page,
  }));
}

export async function GET({ props }: { props: OgPage }) {
  const image = await renderOgImage(props);
  const body = image.buffer.slice(image.byteOffset, image.byteOffset + image.byteLength) as ArrayBuffer;

  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
