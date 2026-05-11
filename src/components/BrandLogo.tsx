import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  imageClassName,
  labelClassName,
  showLocation = true,
}: {
  className?: string;
  imageClassName?: string;
  labelClassName?: string;
  showLocation?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <img
        src="/brand/loofah-logo-gold.png"
        alt="Loofah The Spa"
        className={cn(
          "h-12 w-auto object-contain drop-shadow-[0_12px_30px_rgba(201,169,110,0.28)]",
          imageClassName,
        )}
      />
      {showLocation ? (
        <span
          className={cn(
            "font-accent text-[10px] tracking-[0.3em] uppercase whitespace-nowrap",
            labelClassName,
          )}
        >
          Spa Abuja
        </span>
      ) : null}
    </span>
  );
}
