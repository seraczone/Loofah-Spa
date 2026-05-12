import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { LuxLink } from "@/components/LuxButton";
import { SITE, wa } from "@/lib/site";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit Us - 20A Mombasa Street, Wuse, Abuja | Loofah Spa" },
      {
        name: "description",
        content:
          "Find Loofah Spa at 20A Mombasa Street, Zone 5, Wuse, Abuja. Open Mon-Sat 9 AM - 8 PM, Sun 11 AM - 6 PM.",
      },
      { property: "og:title", content: "Visit Loofah Spa Abuja" },
      { property: "og:description", content: "20A Mombasa Street, Zone 5, Wuse - by appointment, walk-ins welcome." },
    ],
  }),
  component: VisitPage,
});

function VisitPage() {
  return (
    <>
      <section className="bg-ink px-6 pb-16 pt-32 text-center text-ivory lg:px-12 lg:pb-20 lg:pt-36">
        <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">Find Us</span>
        <h1 className="mt-4 font-display italic text-hero">Step into the sanctuary.</h1>
      </section>

      <section className="bg-dark-surface">
        <div className="mx-auto grid max-w-[1400px] min-h-[560px] lg:min-h-[620px] lg:grid-cols-5">
          <div className="lg:col-span-2 p-8 lg:p-14 text-ivory">
            <Reveal>
              <h2 className="font-display italic text-4xl text-ivory">Loofah Spa Abuja</h2>
              <div className="mt-8 space-y-6">
                <InfoBlock icon={MapPin} title="Address">
                  <p className="text-ivory/85 leading-relaxed">{SITE.address.full}</p>
                </InfoBlock>
                <InfoBlock icon={Clock} title="Hours">
                  {SITE.hours.map((entry) => (
                    <p key={entry.day} className="text-ivory/85">
                      {entry.day}: {entry.time}
                    </p>
                  ))}
                </InfoBlock>
                <InfoBlock icon={Phone} title="Contact">
                  <p className="text-ivory/85">{SITE.phone}</p>
                  <p className="text-ivory/85">{SITE.email}</p>
                </InfoBlock>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <LuxLink to={SITE.map.searchUrl} external variant="primary">
                  <Navigation size={14} /> Get Directions
                </LuxLink>
                <LuxLink to={wa("Hi Loofah Spa! I'd like to book a visit.")} external variant="secondary">
                  <MessageCircle size={14} /> WhatsApp
                </LuxLink>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-gold/15 bg-dark-card p-5">
                  <div className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold mb-3">Nearby</div>
                  <ul className="space-y-2 text-ivory/70 text-sm">
                    <li>5 mins from Wuse Market</li>
                    <li>3 mins from Zone 5 roundabout</li>
                    <li>Ample parking available on-site</li>
                  </ul>
                </div>
                <div className="rounded-3xl border border-gold/15 bg-dark-card p-5">
                  <div className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold mb-3">Arrival tip</div>
                  <p className="text-sm text-ivory/70 leading-relaxed">
                    Message ahead on WhatsApp if you would like discreet arrival support or a live location pin before your appointment.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-3 relative bg-ink min-h-[420px]">
            <iframe
              title="Loofah Spa Abuja location"
              src={SITE.map.embedUrl}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ filter: "grayscale(0.48) contrast(1.08) brightness(0.86)" }}
            />
            <div className="absolute inset-x-6 bottom-6 rounded-[28px] border border-gold/20 bg-ink/78 p-5 text-ivory backdrop-blur-md">
              <div className="font-accent text-[10px] tracking-[0.28em] uppercase text-gold-light">Arrival window</div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-lg text-sm text-ivory/70">
                  Best for low traffic: arrive before 11:00 AM or after 4:30 PM on weekdays.
                </p>
                <LuxLink to={SITE.map.searchUrl} external variant="secondary" className="!px-5 !py-3 !text-[10px]">
                  Open map
                </LuxLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Icon size={20} className="text-gold flex-shrink-0 mt-1" />
      <div>
        <div className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold mb-1">{title}</div>
        {children}
      </div>
    </div>
  );
}
