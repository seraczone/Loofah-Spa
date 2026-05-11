export interface InstagramPost {
  id: string;
  video: string;
  title: string;
  caption: string;
  href: string;
  eyebrow: string;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "experience",
    video: "/media/reels/spa-experience.mp4",
    title: "The experience behind every facial",
    caption: "Attention, care and polished professionalism from the moment you walk in.",
    href: "https://instagram.com/loofahspaabuja",
    eyebrow: "Experience",
  },
  {
    id: "consistency",
    video: "/media/reels/glowing-skin-consistency.mp4",
    title: "Glowing skin rewards consistency",
    caption: "A patient, steady routine is where clear and healthy skin starts to show up.",
    href: "https://instagram.com/loofahspaabuja",
    eyebrow: "Education",
  },
  {
    id: "hammam",
    video: "/media/reels/men-hammam-faq.mp4",
    title: "Yes, men can absolutely do Hammam",
    caption: "An FAQ reel that opens the door to one of the most requested body rituals.",
    href: "https://instagram.com/loofahspaabuja",
    eyebrow: "FAQ",
  },
  {
    id: "nollywood",
    video: "/media/reels/nollywood-guest-visit.mp4",
    title: "A recent Nollywood guest moment",
    caption: "Credibility, calm energy and real-life visits from people who value the experience.",
    href: "https://instagram.com/loofahspaabuja",
    eyebrow: "Guest visit",
  },
  {
    id: "abuja-sun",
    video: "/media/reels/abuja-sun-reset.mp4",
    title: "When Abuja sun calls for a reset",
    caption: "A pause, a treatment and a reminder that stressed skin deserves recovery too.",
    href: "https://instagram.com/loofahspaabuja",
    eyebrow: "Wellness break",
  },
  {
    id: "easter",
    video: "/media/reels/easter-gift-of-rest.mp4",
    title: "A surprise gift of rest and glow",
    caption: "Soft, celebratory content that leans into gifting, care and premium thoughtfulness.",
    href: "https://instagram.com/loofahspaabuja",
    eyebrow: "Campaign",
  },
];
