import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { LuxLink } from "@/components/LuxButton";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Loofah Spa Abuja" },
      { name: "description", content: "Loofah Spa is Abuja's destination for medical-grade aesthetics and wellness. Born from a belief that luxury self-care should belong to every Nigerian." },
      { property: "og:title", content: "Our Story — Loofah Spa Abuja" },
      { property: "og:description", content: "Born in Abuja. Built on trust, science and warmth." },
    ],
  }),
  component: AboutPage,
});

const CHAPTERS = [
  {
    eyebrow: "The Foundation",
    title: "Born from a belief that luxury wellness should belong to every Nigerian who desires transformation.",
    body: "Loofah Spa was founded in Wuse to bridge the gap between medical-grade aesthetics and the warmth of a true Nigerian welcome.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85",
  },
  {
    eyebrow: "The Philosophy",
    title: "We don't just treat skin. We restore confidence.",
    body: "Every guest is met with discretion, listened to without judgment, and treated with a plan made entirely for them.",
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=1400&q=85",
  },
  {
    eyebrow: "The Technology",
    title: "Medical-grade technology. Human-first care. Results you can see.",
    body: "From our Q-switched lasers to our hospital-grade sterilisation, no shortcut is taken when it comes to your safety or your results.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1400&q=85",
  },
  {
    eyebrow: "The Commitment",
    title: "Every client receives a personalised care plan — because your skin is as unique as you are.",
    body: "We will be here for the long ritual: the first consultation, the milestone glow, and every renewal in between.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=85",
  },
];

function AboutPage() {
  return (
    <>
      <section className="bg-ink px-6 pb-16 pt-32 text-center text-ivory lg:px-12 lg:pb-20 lg:pt-36">
        <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">Our Story</span>
        <h1 className="mt-4 font-display italic text-hero">
          A sanctuary, <br />
          <span className="text-gradient-gold">built in Abuja.</span>
        </h1>
      </section>

      {CHAPTERS.map((c, i) => (
        <section key={c.eyebrow} className={`px-6 py-20 lg:px-12 lg:py-24 ${i % 2 ? "bg-cream" : "bg-ivory"}`}>
          <div className={`max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <Reveal>
              <div className="overflow-hidden rounded-3xl">
                <img src={c.image} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover ken-burns" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold-deep">Chapter 0{i + 1} · {c.eyebrow}</span>
              <h2 className="mt-4 font-display italic text-display text-ink leading-tight">{c.title}</h2>
              <div className="mt-6 gold-line w-24 origin-left" />
              <p className="mt-6 text-lg text-ink/70 font-light leading-relaxed max-w-md">{c.body}</p>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="bg-dark-surface px-6 py-20 text-center text-ivory lg:px-12 lg:py-24">
        <Reveal>
          <h2 className="font-display italic text-display max-w-3xl mx-auto">
            Visit the sanctuary. <br /> Begin your ritual.
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <LuxLink to="/book">Book Consultation</LuxLink>
            <LuxLink to="/visit" variant="secondary">Find the Spa</LuxLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
