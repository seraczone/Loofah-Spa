import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "mask";
  as?: "div" | "section" | "h1" | "h2" | "h3" | "p" | "span" | "li";
}

export function Reveal({ children, className = "", delay = 0, variant = "up", as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("is-visible"), delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const cls = variant === "mask" ? "reveal-mask" : "reveal-up";
  // @ts-expect-error – dynamic tag
  return <Tag ref={ref} className={`${cls} ${className}`}>{children}</Tag>;
}
