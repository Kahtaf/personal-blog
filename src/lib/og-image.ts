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
  const logoPath = path.join(PROJECT_ROOT, "public", "k-logo-light.svg");
  const logo = await readFile(logoPath);
  return toDataUri(logo, imageMime(logoPath));
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
  const sizes = hasHeroImage ? [52, 48, 44, 40] : [82, 74, 66, 58, 52];
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
  const y = hasHeroImage ? 169 : 160;

  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" font-size="${fontSize}" font-weight="600" font-family="Georgia, 'Times New Roman', serif" fill="#f8fafc">${escapeXml(line)}</text>`,
    )
    .join("");
}

export async function renderOgImage(input: OgImageInput): Promise<Buffer> {
  const heroImage = input.image ? await prepareHeroImage(input.image, input.imageBaseDir) : undefined;
  const hasHeroImage = Boolean(heroImage);
  const avatar = await prepareAvatar();
  const logo = await prepareLogo();
  const { lines, fontSize, lineHeight } = titleLayout(input.title, hasHeroImage);
  const authorY = hasHeroImage ? 493 : 500;
  const secondaryText = input.date ? formatDate(input.date) : "kahtaf.com";
  const panelWidth = hasHeroImage ? IMAGE_X : WIDTH;

  const svg = `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="#0f172a"/>
      <rect width="${panelWidth}" height="${HEIGHT}" fill="#111827"/>
      ${heroImage ? `<image href="${heroImage}" x="${IMAGE_X}" y="0" width="${WIDTH - IMAGE_X}" height="${HEIGHT}" preserveAspectRatio="xMidYMid slice"/>` : ""}
      ${heroImage ? `<rect x="${IMAGE_X}" y="0" width="1" height="${HEIGHT}" fill="#1f2937"/>` : ""}
      ${!heroImage ? `<path d="M760 -120 C1040 55 1060 270 1320 390" fill="none" stroke="#312e81" stroke-width="190" stroke-opacity="0.22"/>` : ""}
      ${!heroImage ? `<path d="M790 695 C980 500 1040 420 1260 380" fill="none" stroke="#0f766e" stroke-width="160" stroke-opacity="0.14"/>` : ""}
      <rect x="${hasHeroImage ? 48 : 64}" y="53" width="64" height="64" rx="8" fill="#4f46e5"/>
      <image href="${logo}" x="${hasHeroImage ? 60 : 76}" y="65" width="40" height="40" preserveAspectRatio="xMidYMid meet"/>
      ${renderTitle(lines, fontSize, lineHeight, hasHeroImage)}
      <defs>
        <clipPath id="avatarClip"><circle cx="${hasHeroImage ? 80 : 96}" cy="${authorY + 31}" r="31"/></clipPath>
      </defs>
      <circle cx="${hasHeroImage ? 80 : 96}" cy="${authorY + 31}" r="31" fill="none" stroke="#f8fafc" stroke-width="4"/>
      <image href="${avatar}" x="${hasHeroImage ? 48 : 64}" y="${authorY}" width="${AVATAR_SIZE}" height="${AVATAR_SIZE}" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>
      <text x="${hasHeroImage ? 128 : 144}" y="${authorY + 20}" font-size="27" font-weight="700" letter-spacing="1.4" font-family="Georgia, 'Times New Roman', serif" fill="#f8fafc">${escapeXml(SITE.NAME.toUpperCase())}</text>
      <text x="${hasHeroImage ? 128 : 144}" y="${authorY + 58}" font-size="26" font-weight="400" font-family="Georgia, 'Times New Roman', serif" fill="#cbd5e1">${escapeXml(secondaryText)}</text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}
