export const SITE = {
  name: "Loofah Spa Abuja",
  shortName: "Loofah Spa",
  tagline: "Luxury Skin & Wellness Redefined.",
  description:
    "Abuja's most luxurious skin, laser, and wellness destination. Advanced laser aesthetics, transformative skincare, and elite wellness - exclusively for discerning clients.",
  address: {
    street: "20A Mombasa Street, Zone 5",
    city: "Wuse, Abuja",
    region: "FCT",
    country: "Nigeria",
    full: "20A Mombasa Street, Zone 5, Wuse, Abuja, FCT, Nigeria",
  },
  hours: [
    { day: "Mon - Sat", time: "9:00 AM - 8:00 PM" },
    { day: "Sunday", time: "11:00 AM - 6:00 PM" },
  ],
  phone: "+234 800 000 0000",
  whatsapp: "2349111111143",
  email: "Loofahspang@gmail.com",
  map: {
    searchUrl:
      "https://www.google.com/maps/search/?api=1&query=20A%20Mombasa%20Street%2C%20Zone%205%2C%20Wuse%2C%20Abuja%2C%20FCT%2C%20Nigeria",
    embedUrl:
      "https://maps.google.com/maps?q=20A%20Mombasa%20Street%2C%20Zone%205%2C%20Wuse%2C%20Abuja%2C%20FCT%2C%20Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },
  social: {
    instagram: "https://instagram.com/loofahlaserandaesthetics",
    facebook: "https://facebook.com/loofahspa",
    tiktok: "https://tiktok.com/@loofahspaabuja",
  },
  url: "https://loofahspa.ng",
  ogImage:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
} as const;

export const wa = (msg: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
