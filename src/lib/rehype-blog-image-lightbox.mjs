import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dimensionsCache = new Map();

export function rehypeBlogImageLightbox() {
  return async (tree, file) => {
    if (!isBlogContentFile(file)) return;
    await transformNode(tree, file);
  };
}

function isBlogContentFile(file) {
  const sourcePath = getSourcePath(file);
  if (!sourcePath) return false;

  return sourcePath.includes(`${path.sep}src${path.sep}content${path.sep}blog${path.sep}`);
}

async function transformNode(node, file) {
  if (!node || !Array.isArray(node.children)) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (isStandaloneImageParagraph(child)) {
      const image = child.children.find(isImageElement);
      node.children[index] = await createFigure(image, file);
      continue;
    }

    await transformNode(child, file);
  }
}

function isStandaloneImageParagraph(node) {
  if (node?.type !== "element" || node.tagName !== "p" || !Array.isArray(node.children)) {
    return false;
  }

  const meaningfulChildren = node.children.filter((child) => {
    return child.type !== "text" || child.value.trim() !== "";
  });

  return meaningfulChildren.length === 1 && isImageElement(meaningfulChildren[0]);
}

function isImageElement(node) {
  return node?.type === "element" && node.tagName === "img";
}

async function createFigure(image, file) {
  const src = String(image.properties?.src ?? "");
  const alt = String(image.properties?.alt ?? "");
  const dimensions = await getImageDimensions(src, file);

  const imageProperties = {
    ...image.properties,
    loading: image.properties?.loading ?? "lazy",
    decoding: image.properties?.decoding ?? "async",
  };

  if (dimensions) {
    imageProperties.width = dimensions.width;
    imageProperties.height = dimensions.height;
  }

  const anchorProperties = {
    href: src,
    "data-blog-lightbox-image": "",
    "data-blog-lightbox-original-src": src,
    "aria-label": alt ? `Open image: ${alt}` : "Open image",
  };

  if (dimensions) {
    anchorProperties["data-pswp-width"] = dimensions.width;
    anchorProperties["data-pswp-height"] = dimensions.height;
  }

  const children = [
    {
      type: "element",
      tagName: "a",
      properties: anchorProperties,
      children: [
        {
          ...image,
          properties: imageProperties,
        },
      ],
    },
  ];

  if (alt) {
    children.push({
      type: "element",
      tagName: "figcaption",
      properties: {},
      children: [{ type: "text", value: alt }],
    });
  }

  return {
    type: "element",
    tagName: "figure",
    properties: {
      className: ["blog-image-lightbox"],
    },
    children,
  };
}

async function getImageDimensions(src, file) {
  if (!src) return undefined;

  try {
    const imageInput = await getImageInput(src, file);
    if (!imageInput) return undefined;

    const { cacheKey, input } = imageInput;
    if (dimensionsCache.has(cacheKey)) return dimensionsCache.get(cacheKey);

    const metadata = await sharp(input).metadata();
    if (!metadata.width || !metadata.height) return undefined;

    const dimensions = {
      width: metadata.width,
      height: metadata.height,
    };
    dimensionsCache.set(cacheKey, dimensions);
    return dimensions;
  } catch (error) {
    file.message(`Unable to infer image dimensions for ${src}: ${error.message}`);
    return undefined;
  }
}

async function getImageInput(src, file) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return {
      cacheKey: src,
      input: Buffer.from(await response.arrayBuffer()),
    };
  }

  if (src.startsWith("/")) {
    const publicPath = path.join(process.cwd(), "public", src);
    return {
      cacheKey: publicPath,
      input: publicPath,
    };
  }

  const sourcePath = getSourcePath(file);
  if (!sourcePath) return undefined;

  const resolvedPath = path.resolve(path.dirname(sourcePath), src);
  return {
    cacheKey: resolvedPath,
    input: resolvedPath,
  };
}

function getSourcePath(file) {
  const sourcePath = file.history?.[0];
  if (!sourcePath) return undefined;

  return sourcePath.startsWith("file://") ? fileURLToPath(sourcePath) : sourcePath;
}
