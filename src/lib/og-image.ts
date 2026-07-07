import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { SITE } from "@consts";
import { formatDate } from "@lib/utils";

export type OgImageInput = {
  title: string;
  date?: Date;
  image?: string;
  imageBaseDir?: string;
};

const WIDTH = 1200;
const HEIGHT = 630;
const IMAGE_X = 450;
const AVATAR_SIZE = 64;
const PROJECT_ROOT = process.cwd();
const BACKGROUND = "#f5f5f4";
const TEXT = "#000000";
const MUTED = "#78716c";
const BORDER = "#d6d3d1";
const FONT_SANS = "Inter, ui-sans-serif, system-ui, sans-serif";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function imageMime(source: string): string {
  if (source.endsWith(".jpg") || source.endsWith(".jpeg")) return "image/jpeg";
  if (source.endsWith(".webp")) return "image/webp";
  if (source.endsWith(".svg")) return "image/svg+xml";
  return "image/png";
}

function toDataUri(buffer: Buffer, mime = "image/png"): string {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

function resolveLocalImage(source: string, baseDir?: string): string {
  if (source.startsWith("/")) {
    return path.join(PROJECT_ROOT, "public", source.slice(1));
  }

  return path.resolve(baseDir ?? PROJECT_ROOT, source);
}

async function readImage(source: string, baseDir?: string): Promise<Buffer | undefined> {
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source);
    if (!response.ok) return undefined;
    return Buffer.from(await response.arrayBuffer());
  }

  const imagePath = resolveLocalImage(source, baseDir);
  if (!existsSync(imagePath)) return undefined;
  return readFile(imagePath);
}

async function prepareHeroImage(source: string, baseDir?: string): Promise<string | undefined> {
  const input = await readImage(source, baseDir);
  if (!input) return undefined;

  const buffer = await sharp(input)
    .rotate()
    .resize(WIDTH - IMAGE_X, HEIGHT, { fit: "cover" })
    .png()
    .toBuffer();

  return toDataUri(buffer);
}

async function prepareAvatar(): Promise<string> {
  const avatarPath = path.join(PROJECT_ROOT, "public", "profile-avatar.jpg");
  const avatar = await sharp(avatarPath)
    .rotate()
    .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover" })
    .png()
    .toBuffer();

  return toDataUri(avatar);
}

async function prepareLogo(): Promise<string> {
  const logoPath = path.join(PROJECT_ROOT, "public", "k-logo.svg");
  const logo = await readFile(logoPath);
  return toDataUri(logo, imageMime(logoPath));
}

async function fontFaceCss(): Promise<string> {
  const inter400Path = path.join(PROJECT_ROOT, "node_modules", "@fontsource", "inter", "files", "inter-latin-400-normal.woff2");
  const inter600Path = path.join(PROJECT_ROOT, "node_modules", "@fontsource", "inter", "files", "inter-latin-600-normal.woff2");
  const [inter400, inter600] = await Promise.all([readFile(inter400Path), readFile(inter600Path)]);

  return `
    @font-face {
      font-family: "Inter";
      src: url("${toDataUri(inter400, "font/woff2")}") format("woff2");
      font-weight: 400;
    }
    @font-face {
      font-family: "Inter";
      src: url("${toDataUri(inter600, "font/woff2")}") format("woff2");
      font-weight: 600;
    }
  `;
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }

    if (lines.length === maxLines) break;
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  if (words.join(" ").length > lines.join(" ").length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[,.:\s]+$/, "")}...`;
  }

  return lines;
}

function titleLayout(title: string, hasHeroImage: boolean) {
  const sizes = hasHeroImage ? [48, 44, 40, 36] : [74, 66, 58, 52, 46];
  const availableWidth = hasHeroImage ? 354 : 1030;
  const maxLines = hasHeroImage ? 6 : 4;

  for (const fontSize of sizes) {
    const maxChars = Math.floor(availableWidth / (fontSize * 0.5));
    const lines = wrapText(title, maxChars, maxLines);
    const lineHeight = Math.round(fontSize * 1.12);
    const maxHeight = hasHeroImage ? 330 : 360;

    if (lines.length * lineHeight <= maxHeight) {
      return { lines, fontSize, lineHeight };
    }
  }

  const fontSize = sizes[sizes.length - 1];
  return {
    lines: wrapText(title, Math.floor(availableWidth / (fontSize * 0.5)), maxLines),
    fontSize,
    lineHeight: Math.round(fontSize * 1.12),
  };
}

function renderTitle(lines: string[], fontSize: number, lineHeight: number, hasHeroImage: boolean): string {
  const x = hasHeroImage ? 48 : 64;
  const y = hasHeroImage ? 168 : 210;

  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" font-size="${fontSize}" font-weight="600" font-family="${FONT_SANS}" fill="${TEXT}">${escapeXml(line)}</text>`,
    )
    .join("");
}

export async function renderOgImage(input: OgImageInput): Promise<Buffer> {
  const heroImage = input.image ? await prepareHeroImage(input.image, input.imageBaseDir) : undefined;
  const hasHeroImage = Boolean(heroImage);
  const avatar = await prepareAvatar();
  const logo = await prepareLogo();
  const fonts = await fontFaceCss();
  const { lines, fontSize, lineHeight } = titleLayout(input.title, hasHeroImage);
  const authorY = hasHeroImage ? 493 : 500;
  const secondaryText = input.date ? formatDate(input.date) : "kahtaf.com";
  const logoX = hasHeroImage ? 48 : 64;
  const logoY = hasHeroImage ? 54 : 62;
  const avatarX = hasHeroImage ? 48 : 64;
  const authorX = hasHeroImage ? 128 : 144;

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <style>${fonts}</style>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="${BACKGROUND}"/>
      ${heroImage ? `<image href="${heroImage}" x="${IMAGE_X}" y="0" width="${WIDTH - IMAGE_X}" height="${HEIGHT}" preserveAspectRatio="xMidYMid slice"/>` : ""}
      ${heroImage ? `<rect x="${IMAGE_X}" y="0" width="1" height="${HEIGHT}" fill="${BORDER}"/>` : ""}
      <image href="${logo}" x="${logoX}" y="${logoY}" width="54" height="44" preserveAspectRatio="xMidYMid meet"/>
      ${renderTitle(lines, fontSize, lineHeight, hasHeroImage)}
      <defs>
        <clipPath id="avatarClip"><circle cx="${avatarX + 32}" cy="${authorY + 32}" r="30"/></clipPath>
      </defs>
      <circle cx="${avatarX + 32}" cy="${authorY + 32}" r="31" fill="none" stroke="${BORDER}" stroke-width="2"/>
      <image href="${avatar}" x="${avatarX}" y="${authorY}" width="${AVATAR_SIZE}" height="${AVATAR_SIZE}" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>
      <text x="${authorX}" y="${authorY + 24}" font-size="25" font-weight="600" font-family="${FONT_SANS}" fill="${TEXT}">${escapeXml(SITE.NAME)}</text>
      <text x="${authorX}" y="${authorY + 56}" font-size="23" font-weight="400" font-family="${FONT_SANS}" fill="${MUTED}">${escapeXml(secondaryText)}</text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}
