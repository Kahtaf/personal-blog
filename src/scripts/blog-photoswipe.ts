import PhotoSwipeLightbox from "photoswipe/lightbox";
import type PhotoSwipe from "photoswipe";

const articleSelector = "article[data-blog-content]";
const imageSelector = "a[data-blog-lightbox-image]";
const gallerySelector = "[data-blog-lightbox-gallery]";

function getAnchors(scope: ParentNode) {
  return Array.from(scope.querySelectorAll<HTMLAnchorElement>(imageSelector));
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

function prepareImages(scope: ParentNode) {
  getAnchors(scope).forEach((anchor) => {
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

function getCaption(trigger: Element | undefined) {
  if (!(trigger instanceof HTMLElement)) return "";

  return (
    trigger.dataset.blogLightboxCaption ??
    trigger.closest("figure")?.querySelector("figcaption")?.innerHTML ??
    ""
  );
}

function updateCaption(element: HTMLElement, pswp: PhotoSwipe) {
  const caption = getCaption(pswp.currSlide?.data.element);

  element.innerHTML = caption;
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

function getLightboxScopes(article: HTMLElement) {
  const groupedScopes = Array.from(article.querySelectorAll<HTMLElement>(gallerySelector));
  const groupedAnchors = new Set(groupedScopes.flatMap((scope) => getAnchors(scope)));
  const standaloneScopes = getAnchors(article)
    .filter((anchor) => !groupedAnchors.has(anchor))
    .map((anchor) => anchor.closest<HTMLElement>("figure") ?? anchor);

  return [...groupedScopes, ...standaloneScopes].filter((scope) => scope.querySelector(imageSelector));
}

function initLightboxForScope(scope: HTMLElement) {
  prepareImages(scope);

  const lightbox = new PhotoSwipeLightbox({
    gallery: scope,
    children: imageSelector,
    pswpModule: () => import("photoswipe"),
    bgOpacity: 0.92,
    showHideAnimationType: "zoom",
  });

  registerCaption(lightbox);
  lightbox.init();

  scope.addEventListener(
    "click",
    async (event) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(imageSelector);
      if (!anchor || !scope.contains(anchor)) return;

      if (syncImageData(anchor)) return;

      event.preventDefault();
      event.stopPropagation();

      if (!(await ensureImageData(anchor))) return;

      const index = getAnchors(scope).indexOf(anchor);
      if (index >= 0) {
        lightbox.loadAndOpen(index);
      }
    },
    { capture: true },
  );

  return lightbox;
}

function initBlogPhotoSwipe() {
  window.__blogPhotoSwipeLightboxes?.forEach((lightbox) => lightbox.destroy());
  window.__blogPhotoSwipeLightboxes = undefined;
  window.__blogPhotoSwipeLightbox?.destroy();
  window.__blogPhotoSwipeLightbox = undefined;

  const article = document.querySelector<HTMLElement>(articleSelector);
  if (!article || !article.querySelector(imageSelector)) return;

  window.__blogPhotoSwipeLightboxes = getLightboxScopes(article).map(initLightboxForScope);
}

document.addEventListener("astro:page-load", initBlogPhotoSwipe);
document.addEventListener("DOMContentLoaded", initBlogPhotoSwipe);
