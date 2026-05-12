import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { LuxLink } from "@/components/LuxButton";
import { Reveal } from "@/components/Reveal";
import { INSTAGRAM_POSTS, type InstagramPost } from "@/lib/instagram";

export function InstagramWall() {
  return (
    <section className="bg-dark-surface px-6 py-24 text-ivory lg:px-12 lg:py-28">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <Reveal>
            <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">
              Instagram
            </span>
            <h2 className="mt-4 font-display italic text-display max-w-2xl">
              A softer look at the ritual, the room and the result.
            </h2>
            <p className="mt-5 max-w-xl text-ivory/68">
              A polished editorial feed for treatment moments, shelf shots and private-suite atmosphere.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <LuxLink to="https://instagram.com/loofahspaabuja" external variant="secondary">
              Follow @loofahspaabuja <ArrowRight size={14} />
            </LuxLink>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {INSTAGRAM_POSTS.map((post, index) => (
            <Reveal key={post.id} delay={index * 70}>
              <InstagramVideoCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstagramVideoCard({ post }: { post: InstagramPost }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (previewing) {
      const playback = video.play();
      if (playback && typeof playback.catch === "function") {
        void playback.catch(() => undefined);
      }
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [previewing]);

  return (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-[30px] border border-gold/15 bg-dark-card"
      onMouseEnter={() => setPreviewing(true)}
      onMouseLeave={() => setPreviewing(false)}
      onFocus={() => setPreviewing(true)}
      onBlur={() => setPreviewing(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(201,169,110,0.18),_transparent_52%),linear-gradient(180deg,#2a241e_0%,#17120f_100%)]">
        <video
          ref={videoRef}
          src={post.video}
          className={`h-full w-full object-cover transition-all duration-[1600ms] ${
            previewing ? "scale-[1.03] opacity-100" : "scale-100 opacity-82"
          }`}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#130f0c] via-[#130f0c]/18 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-dark-surface/72 px-3 py-2 font-accent text-[10px] uppercase tracking-[0.24em] text-gold-light">
          <Play size={11} className="fill-current" />
          {previewing ? "Previewing" : "Hover to preview"}
        </div>
      </div>
      <div className="p-6">
        <div className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-light">{post.eyebrow}</div>
        <h3 className="mt-3 font-heading text-xl text-ivory">{post.title}</h3>
        <p className="mt-3 text-sm text-ivory/65">{post.caption}</p>
      </div>
    </a>
  );
}
