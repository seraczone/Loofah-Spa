import { ArrowRight } from "lucide-react";
import { LuxLink } from "@/components/LuxButton";
import { Reveal } from "@/components/Reveal";
import { INSTAGRAM_POSTS } from "@/lib/instagram";

export function InstagramWall() {
  return (
    <section className="bg-dark-surface py-28 lg:py-36 px-6 lg:px-12 text-ivory">
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
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-[30px] border border-gold/15 bg-dark-card"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <video
                    src={post.video}
                    className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>
                <div className="p-6">
                  <div className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-light">
                    {post.eyebrow}
                  </div>
                  <h3 className="mt-3 font-heading text-xl text-ivory">{post.title}</h3>
                  <p className="mt-3 text-sm text-ivory/65">{post.caption}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
