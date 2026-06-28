import PhotoSwipeLightbox from "photoswipe/lightbox";
import type PhotoSwipe from "photoswipe";

const articleSelector = "article[data-blog-content]";
const imageSelector = "a[data-blog-lightbox-image]";

function getAnchors(article: HTMLElement) {
  return Array.from(article.querySelectorAll<HTMLAnchorElement>(imageSelector));
}

function getImage(anchor: HTMLAnchorElement) {
  return anchor.querySelector("img");
}

function syncImageSource(anchor: HTMLAnchorElement) {
  const image = getImage(anchor);
  const src = image?.currentSrc || image?.src || anchor.href;

  if (!src) return;

  anchor.href = src;
  anchor.dataset.pswpSrc = src;
}

function syncImageDimensions(anchor: HTMLAnchorElement) {
  if (anchor.dataset.pswpWidth && anchor.dataset.pswpHeight) return true;

  const image = getImage(anchor);
  const width = image?.naturalWidth || image?.width;
  const height = image?.naturalHeight || image?.height;

  if (!width || !height) return false;

  anchor.dataset.pswpWidth = String(width);
  anchor.dataset.pswpHeight = String(height);
  return true;
}

function syncImageData(anchor: HTMLAnchorElement) {
  syncImageSource(anchor);
  return syncImageDimensions(anchor);
}

function prepareImages(article: HTMLElement) {
  getAnchors(article).forEach((anchor) => {
    syncImageData(anchor);
  });
}

async function ensureImageData(anchor: HTMLAnchorElement) {
  if (syncImageData(anchor)) return true;

  const image = getImage(anchor);
  if (!image) return false;

  if (!image.complete) {
    await new Promise<void>((resolve) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => resolve(), { once: true });
    });
  }

  if (typeof image.decode === "function" && image.complete && image.naturalWidth) {
    await image.decode().catch(() => undefined);
  }

  return syncImageData(anchor);
}

function updateCaption(element: HTMLElement, pswp: PhotoSwipe) {
  const trigger = pswp.currSlide?.data.element;
  const caption = trigger?.closest("figure")?.querySelector("figcaption");

  element.innerHTML = caption?.innerHTML ?? "";
  element.hidden = !caption;
}

function registerCaption(lightbox: PhotoSwipeLightbox) {
  lightbox.on("uiRegister", () => {
    lightbox.pswp?.ui?.registerElement({
      name: "blog-caption",
      order: 9,
      isButton: false,
      appendTo: "root",
      html: "",
      onInit: (element, pswp) => {
        updateCaption(element, pswp);
        pswp.on("change", () => updateCaption(element, pswp));
      },
    });
  });
}

function initBlogPhotoSwipe() {
  window.__blogPhotoSwipeLightbox?.destroy();
  window.__blogPhotoSwipeLightbox = undefined;

  const article = document.querySelector<HTMLElement>(articleSelector);
  if (!article || !article.querySelector(imageSelector)) return;

  prepareImages(article);

  const lightbox = new PhotoSwipeLightbox({
    gallery: article,
    children: imageSelector,
    pswpModule: () => import("photoswipe"),
    bgOpacity: 0.92,
    showHideAnimationType: "zoom",
  });

  registerCaption(lightbox);
  lightbox.init();

  article.addEventListener(
    "click",
    async (event) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(imageSelector);
      if (!anchor || !article.contains(anchor)) return;

      if (syncImageData(anchor)) return;

      event.preventDefault();
      event.stopPropagation();

      if (!(await ensureImageData(anchor))) return;

      const index = getAnchors(article).indexOf(anchor);
      if (index >= 0) {
        lightbox.loadAndOpen(index);
      }
    },
    { capture: true },
  );

  window.__blogPhotoSwipeLightbox = lightbox;
}

document.addEventListener("astro:page-load", initBlogPhotoSwipe);
document.addEventListener("DOMContentLoaded", initBlogPhotoSwipe);
