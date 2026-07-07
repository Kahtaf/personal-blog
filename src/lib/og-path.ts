export function getOgImagePath(pathname: string): string {
  const slug = pathname.replace(/\/+$/, "").replace(/^\/+/, "");
  return slug ? `/og/${slug}.png` : "/og/home.png";
}
