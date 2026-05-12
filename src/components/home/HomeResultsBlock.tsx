import { ArrowRight, Star } from "lucide-react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { LuxLink } from "@/components/LuxButton";
import { Reveal } from "@/components/Reveal";

export default function HomeResultsBlock() {
  return (
    <>
      <ResultsTeaser />
      <SocialProof />
    </>
  );
}

function ResultsTeaser() {
  return (
    <section className="overflow-hidden bg-dark-surface px-6 py-24 text-ivory lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <span className="font-accent text-[11px] uppercase tracking-[0.3em] text-gold">Real Results</span>
          <h2 className="mt-4 font-display text-display italic">
            Transformations that <span className="text-gradient-gold">speak quietly</span>, but unmistakably.
          </h2>
          <p className="mt-6 max-w-md font-light text-subhead text-ivory/70">
            Hundreds of Abuja clients have stepped into Loofah Spa with a concern and walked out with renewed confidence.
            Slide to see real results from our clinical archive.
          </p>
          <div className="mt-10">
            <LuxLink to="/results" variant="secondary">
              See All Transformations <ArrowRight size={14} />
            </LuxLink>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <BeforeAfterSlider
            before="https://images.unsplash.com/photo-1581585504225-bb6c6cb27cf6?auto=format&fit=crop&w=900&q=80"
            after="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80"
          />
        </Reveal>
      </div>
    </section>
  );
}

function SocialProof() {
  const reviews = [
    { name: "Adaeze M.", text: "The best self-care investment I've made in Abuja.", rating: 5, treatment: "Hydra Glow Facial" },
    { name: "Tunde A.", text: "Professional, clean, and the results speak for themselves.", rating: 5, treatment: "Laser Hair Removal" },
    { name: "Ngozi I.", text: "Felt like a private retreat. I'll be back.", rating: 5, treatment: "Wellness Massage" },
    { name: "Kemi O.", text: "My acne scars are visibly faded. So grateful.", rating: 5, treatment: "Microneedling" },
    { name: "Ibrahim K.", text: "The IV drip lounge alone is worth it.", rating: 5, treatment: "IV Therapy" },
  ];

  return (
    <section className="bg-cream py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-12">
        <Reveal>
          <span className="font-accent text-[11px] uppercase tracking-[0.3em] text-gold-deep">Loved by Abuja</span>
          <h2 className="mt-4 font-display text-display italic text-ink">Voices from the sanctuary.</h2>
        </Reveal>
      </div>

      <div className="mt-16 overflow-hidden">
        <div className="marquee flex gap-6 whitespace-nowrap">
          {[...reviews, ...reviews, ...reviews].map((review, index) => (
            <div key={`${review.name}-${index}`} className="inline-flex w-[340px] flex-col whitespace-normal rounded-3xl border border-nude/40 bg-ivory p-7">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm text-gold-deep ring-2 ring-gold">
                  {review.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm text-ink">{review.name}</div>
                  <div className="flex gap-0.5 text-gold">
                    {[...Array(review.rating)].map((_, starIndex) => (
                      <Star key={starIndex} size={11} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-display text-lg italic leading-snug text-ink">"{review.text}"</p>
              <p className="mt-4 font-accent text-[10px] uppercase tracking-[0.25em] text-gold-deep">{review.treatment}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="mx-auto max-w-2xl font-display text-2xl italic text-mocha">
          "The best self-care investment I've made in Abuja."
        </p>
        <p className="mt-3 font-accent text-[10px] uppercase tracking-[0.3em] text-gold-deep">- Adaeze M., verified client</p>
      </div>
    </section>
  );
}
