import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface BaseProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  magnetic?: boolean;
}

const variants = {
  primary:
    "bg-gold text-ink hover:bg-gold-deep hover:text-ivory border border-gold",
  secondary:
    "bg-transparent text-ivory border border-gold hover:bg-gold hover:text-ink",
  ghost:
    "bg-transparent text-ink border border-ink/20 hover:border-gold hover:text-gold-deep",
} as const;

const base =
  "btn-shimmer inline-flex items-center justify-center gap-2 rounded-pill px-9 py-4 text-[13px] font-medium tracking-[0.18em] uppercase font-body transition-colors duration-500 ease-[cubic-bezier(.25,.1,0,1)] cursor-pointer";

function useMagnetic(enabled: boolean) {
  const ref = useRef<HTMLElement | null>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
  };
  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return { ref, onMouseMove, onMouseLeave };
}

interface BtnProps extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {}

export function LuxButton({
  children,
  variant = "primary",
  className = "",
  magnetic = true,
  ...rest
}: BtnProps) {
  const m = useMagnetic(magnetic);
  return (
    <button
      ref={m.ref as React.RefObject<HTMLButtonElement>}
      onMouseMove={m.onMouseMove}
      onMouseLeave={m.onMouseLeave}
      className={`${base} ${variants[variant]} ${className}`}
      style={{ transition: "transform .4s cubic-bezier(.25,.1,0,1), background-color .5s, color .5s, border-color .5s" }}
      {...rest}
    >
      {children}
    </button>
  );
}

interface LinkBtnProps extends BaseProps {
  to: string;
  params?: Record<string, string>;
  external?: boolean;
  target?: string;
  rel?: string;
}
export function LuxLink({
  children,
  variant = "primary",
  className = "",
  magnetic = true,
  to,
  external,
  target,
  rel,
  params,
}: LinkBtnProps) {
  const m = useMagnetic(magnetic);
  const cls = `${base} ${variants[variant]} ${className}`;
  const style = {
    transition:
      "transform .4s cubic-bezier(.25,.1,0,1), background-color .5s, color .5s, border-color .5s",
  };
  if (external) {
    return (
      <a
        ref={m.ref as React.RefObject<HTMLAnchorElement>}
        onMouseMove={m.onMouseMove}
        onMouseLeave={m.onMouseLeave}
        href={to}
        target={target ?? "_blank"}
        rel={rel ?? "noopener noreferrer"}
        className={cls}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      to={to}
      params={params as never}
      // @ts-expect-error – ref forwarded via Link's underlying anchor
      ref={m.ref}
      onMouseMove={m.onMouseMove}
      onMouseLeave={m.onMouseLeave}
      className={cls}
      style={style}
    >
      {children}
    </Link>
  );
}
