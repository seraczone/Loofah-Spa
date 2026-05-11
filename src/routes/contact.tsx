import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Reveal } from "@/components/Reveal";
import { LuxLink } from "@/components/LuxButton";
import { useAuth } from "@/components/providers/AuthProvider";
import { saveLead } from "@/lib/app-store";
import { SITE, wa } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(1, "Message required").max(1000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Loofah Spa Abuja" },
      {
        name: "description",
        content: "Reach Loofah Spa Abuja by WhatsApp, phone, email or visit us at 20A Mombasa Street, Wuse.",
      },
      { property: "og:title", content: "Contact Loofah Spa Abuja" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: current.name || profile?.full_name || user?.user_metadata?.full_name || "",
      email: current.email || user?.email || "",
    }));
  }, [profile?.full_name, user?.email, user?.user_metadata?.full_name]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = schema.safeParse(form);

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        nextErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    try {
      setErrors({});
      const result = await saveLead({
        user_id: user?.id ?? null,
        lead_type: "contact",
        source: "contact-form",
        name: form.name,
        email: form.email,
        message: form.message,
        metadata: {
          channel: "contact-page",
        },
      });
      void result;
      setSent(true);
      toast.success("Message saved.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save your message.";
      toast.error(message);
    }
  };

  return (
    <>
      <section className="bg-ink text-ivory pt-40 pb-20 px-6 lg:px-12 text-center">
        <span className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold">Contact</span>
        <h1 className="mt-4 font-display italic text-hero">We'd love to hear from you.</h1>
      </section>

      <section className="bg-ivory py-24 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16">
          <Reveal>
            <h2 className="font-display italic text-display text-ink">Send a message.</h2>
            <p className="mt-4 text-ink/70 max-w-md">
              Fill the form below and we will log the enquiry immediately before you continue the conversation.
            </p>

            <form onSubmit={submit} className="mt-10 space-y-5 max-w-md">
              <FormField
                label="Name"
                value={form.name}
                onChange={(value) => setForm((current) => ({ ...current, name: value }))}
                error={errors.name}
              />
              <FormField
                label="Email"
                value={form.email}
                onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                error={errors.email}
              />
              <label className="block">
                <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold-deep">Message</span>
                <textarea
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  rows={5}
                  className="mt-2 w-full bg-cream border border-nude/60 rounded-2xl p-4 outline-none focus:border-gold"
                />
                {errors.message ? <span className="text-destructive text-xs mt-1 block">{errors.message}</span> : null}
              </label>
              <button
                type="submit"
                className="btn-shimmer inline-flex items-center gap-2 rounded-pill bg-ink text-ivory px-9 py-4 text-[12px] tracking-[0.22em] uppercase"
              >
                {sent ? "Saved inquiry" : "Send"} <Send size={14} />
              </button>
              {sent ? (
                <div className="rounded-2xl border border-gold/25 bg-ivory px-4 py-4 text-sm text-ink/70">
                  Your message is on file.
                  <a
                    href={wa(`Hi Loofah Spa! ${form.name} (${form.email}) here.\n\n${form.message}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-gold-deep underline"
                  >
                    Continue on WhatsApp
                  </a>
                </div>
              ) : null}
            </form>
          </Reveal>

          <Reveal delay={150}>
            <div className="bg-cream rounded-3xl p-8 lg:p-10 border border-nude/40">
              <h3 className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold-deep">Other ways to reach us</h3>
              <ul className="mt-8 space-y-6">
                <Item icon={MapPin} title="Visit" body={SITE.address.full} />
                <Item icon={Phone} title="Call" body={SITE.phone} />
                <Item icon={Mail} title="Email" body={SITE.email} />
                <Item icon={MessageCircle} title="WhatsApp" body="Tap below to chat" />
              </ul>
              <div className="mt-10">
                <LuxLink to={wa("Hi Loofah Spa!")} external variant="primary">
                  Open WhatsApp
                </LuxLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function FormField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold-deep">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full bg-cream border border-nude/60 rounded-pill py-4 px-5 outline-none focus:border-gold transition-colors"
      />
      {error ? <span className="text-destructive text-xs mt-1 block">{error}</span> : null}
    </label>
  );
}

function Item({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof MapPin;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4">
      <div className="w-10 h-10 rounded-full bg-ivory border border-gold/40 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-gold-deep" />
      </div>
      <div>
        <div className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold-deep">{title}</div>
        <div className="mt-1 text-ink">{body}</div>
      </div>
    </li>
  );
}
