import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";

const PAGE = 5;
/** Reveal the next page once the rail is within this many px of its end. */
const THRESHOLD_PX = 360;

type Props<T> = {
  items: T[];
  render: (item: T) => ReactNode;
  keyOf: (item: T) => string | number;
  label: string;
};

/** Horizontal rail that reveals the next 5 items as the reader approaches the end. */
export function Carousel<T>({ items, render, keyOf, label }: Props<T>) {
  const [count, setCount] = useState(PAGE);
  const railRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);
  const hasMore = count < items.length;
  const railId = `rail-${label.replace(/\W+/g, "-").toLowerCase()}`;

  const loadMore = useCallback(() => {
    setCount((c) => (c < items.length ? Math.min(c + PAGE, items.length) : c));
  }, [items.length]);

  // Primary: reveal when the sentinel scrolls into the rail.
  useEffect(() => {
    const el = sentinelRef.current, root = railRef.current;
    if (!el || !root || !hasMore || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) loadMore(); },
      { root, rootMargin: `0px ${THRESHOLD_PX}px 0px 0px`, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, count, loadMore]);

  // Fallback: observer callbacks are suspended in some environments
  // (background tabs, throttled pages). Scroll position is always reliable.
  useEffect(() => {
    const root = railRef.current;
    if (!root || !hasMore) return;
    const onScroll = () => {
      if (root.scrollWidth - root.clientWidth - root.scrollLeft <= THRESHOLD_PX) loadMore();
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => root.removeEventListener("scroll", onScroll);
  }, [hasMore, count, loadMore]);

  const nudge = useCallback((dir: 1 | -1) => {
    const root = railRef.current;
    if (!root) return;
    root.scrollBy({ left: dir * 350, behavior: "smooth" });
    if (dir === 1 && root.scrollWidth - root.clientWidth - root.scrollLeft <= THRESHOLD_PX * 2)
      loadMore();
  }, [loadMore]);

  const visible = items.slice(0, count);

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-ui text-xs text-muted" role="status" aria-live="polite">
          <span className="num">{visible.length}</span> of <span className="num">{items.length}</span> loaded
        </p>
        <div className="flex gap-2">
          {([-1, 1] as const).map((d) => (
            <button key={d} type="button" onClick={() => nudge(d)} aria-controls={railId}
              aria-label={`Scroll ${label} ${d === 1 ? "right" : "left"}`}
              className="rounded-full border border-border bg-surface px-3 py-1.5 font-ui text-sm
                         text-muted transition-all duration-300 ease-out active:scale-95
                         hover:border-rahul/50 hover:text-rahulInk">
              {d === 1 ? "→" : "←"}
            </button>
          ))}
        </div>
      </div>

      <ul id={railId} ref={railRef} aria-label={label}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]">
        {visible.map((it, i) => (
          <li key={keyOf(it)} className="w-[300px] shrink-0 snap-start fade-up sm:w-[330px]"
              style={{ animationDelay: `${(i % PAGE) * 60}ms` }}>
            {render(it)}
          </li>
        ))}
        {hasMore && (
          <li ref={sentinelRef}
              className="flex w-[300px] shrink-0 snap-start items-center justify-center
                         rounded-lg border border-dashed border-border sm:w-[330px]">
            <span className="font-ui text-xs text-muted">loading next {PAGE}…</span>
          </li>
        )}
      </ul>
    </div>
  );
}
