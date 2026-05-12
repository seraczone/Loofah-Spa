import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

interface DeferredSectionProps {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
}

export function DeferredSection({
  children,
  fallback,
  rootMargin = "280px 0px",
}: DeferredSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [active, rootMargin]);

  return <div ref={ref}>{active ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}</div>;
}
