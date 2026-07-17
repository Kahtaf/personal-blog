import type { ReactNode } from "react";

type MagicTweetCardProps = {
  author: string;
  handle: string;
  url: string;
  date: string;
  avatarUrl: string;
  verified?: boolean;
  children: ReactNode;
};

/**
 * Astro-compatible adaptation of Magic UI's Tweet Card:
 * https://magicui.design/docs/components/tweet-card
 *
 * The upstream server component fetches a post through react-tweet at render
 * time. This static-site version receives the already verified post metadata
 * as props, so builds do not depend on X being available.
 */
export default function MagicTweetCard({
  author,
  handle,
  url,
  date,
  avatarUrl,
  verified = false,
  children,
}: MagicTweetCardProps) {
  return (
    <div className="not-prose relative my-8 flex h-fit w-full flex-col gap-4 overflow-hidden rounded-xl border border-stone-900/15 bg-white/50 p-5 text-stone-900 shadow-sm dark:border-white/15 dark:bg-stone-800/50 dark:text-stone-50">
      <div className="flex flex-row items-start justify-between tracking-normal">
        <div className="flex items-center space-x-3">
          <a href={`https://x.com/${handle}`} target="_blank" rel="noreferrer" className="shrink-0 no-underline" aria-label={`Open ${author}'s X profile`}>
            <img
              title={`Profile picture of ${author}`}
              alt={`Profile picture of ${author}`}
              height={48}
              width={48}
              src={avatarUrl}
              className="size-12 overflow-hidden rounded-full border border-stone-900/15 object-cover dark:border-white/15"
            />
          </a>
          <div className="flex flex-col gap-0.5">
            <a href={`https://x.com/${handle}`} target="_blank" rel="noreferrer" className="flex items-center font-medium whitespace-nowrap no-underline text-stone-950 transition-opacity hover:opacity-80 dark:text-white">
              {author}
              {verified && <Verified className="ml-1 inline size-4 text-sky-500" />}
            </a>
            <a href={`https://x.com/${handle}`} target="_blank" rel="noreferrer" className="text-sm no-underline text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-300 dark:hover:text-white">
              @{handle}
            </a>
          </div>
        </div>
        <a href={url} target="_blank" rel="noreferrer" aria-label="Open post on X" className="no-underline text-stone-500 transition-all hover:scale-105 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white">
          <XIcon className="size-5" />
        </a>
      </div>

      <div className="text-[15px] leading-relaxed tracking-normal wrap-break-word text-stone-900 dark:text-stone-50">{children}</div>

      <a href={url} target="_blank" rel="noreferrer" className="w-fit text-sm no-underline text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-300 dark:hover:text-white">
        <time>{date}</time>
        <span aria-hidden="true"> · </span>
        View on X
      </a>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.9 2.3h3.7l-8.1 9.3L24 21.7h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 2.3h7.6L12.9 9l6-6.7Zm-1.3 17.1h2L6.5 4.5H4.4l13.2 14.9Z" />
    </svg>
  );
}

function Verified({ className }: { className?: string }) {
  return (
    <svg aria-label="Verified Account" viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </svg>
  );
}
