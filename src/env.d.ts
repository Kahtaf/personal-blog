/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare global {
  interface Window {
    __blogPhotoSwipeLightbox?: import("photoswipe/lightbox").default;
    __blogPhotoSwipeLightboxes?: import("photoswipe/lightbox").default[];
  }
}

export {};
