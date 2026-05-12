import { useRef, useState } from "react";

export function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromX = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, percent)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] w-full cursor-ew-resize overflow-hidden rounded-3xl select-none touch-none"
      onMouseDown={(event) => {
        dragging.current = true;
        setFromX(event.clientX);
      }}
      onMouseMove={(event) => dragging.current && setFromX(event.clientX)}
      onMouseUp={() => {
        dragging.current = false;
      }}
      onMouseLeave={() => {
        dragging.current = false;
      }}
      onTouchStart={(event) => setFromX(event.touches[0].clientX)}
      onTouchMove={(event) => setFromX(event.touches[0].clientX)}
    >
      <img src={after} alt="After treatment" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt="Before treatment" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <span className="glass-dark absolute left-4 top-4 rounded-full px-3 py-1.5 font-accent text-[10px] uppercase tracking-[0.3em] text-ivory">
        Before
      </span>
      <span className="glass-dark absolute right-4 top-4 rounded-full px-3 py-1.5 font-accent text-[10px] uppercase tracking-[0.3em] text-gold-light">
        After
      </span>
      <div className="pointer-events-none absolute bottom-0 top-0 w-px bg-gold" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold shadow-[0_0_30px_rgba(201,169,110,0.7)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1714" strokeWidth="2.5">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
