import { createFileRoute } from "@tanstack/react-router";
import { FlavourCard, type Flavour } from "@/components/site/FlavourCard";
import watermelon from "@/assets/watermelon.jpg";
import mango from "@/assets/mango.jpg";
import lemon from "@/assets/lemon.jpg";
import orange from "@/assets/orange.jpg";
import apple from "@/assets/apple.jpg";
import pomegranate from "@/assets/pomegranate.jpg";
import sweetlime from "@/assets/sweetlime.jpg";
import guava from "@/assets/guava.jpg";

const title = "Flavours — Rasna: MixYourMagic";
const description =
  "Meet the Rasna flavour family: Summer Splash with Watermelon, Mango, Lemon and Orange, plus rich Winter Flavours like Apple, Pomegranate, Sweet Lime and Guava.";

export const Route = createFileRoute("/flavours")({
  component: FlavoursPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const summer: Flavour[] = [
  {
    name: "Watermelon",
    description: "Ice-cold, juicy and impossibly cooling — the taste of a summer afternoon.",
    image: watermelon,
    accent: "from-melon/30 to-leaf/20",
    cta: "Try It",
  },
  {
    name: "Mango",
    description: "Thick, golden Alphonso sweetness with a sun-ripened finish.",
    image: mango,
    accent: "from-mango/30 to-lemon/25",
    cta: "Explore Flavour",
  },
  {
    name: "Lemon",
    description: "Crisp, fizzy and bright with fresh mint — pure zing in a glass.",
    image: lemon,
    accent: "from-lemon/35 to-leaf/20",
    cta: "Try It",
  },
  {
    name: "Orange",
    description: "Sun-ripened citrus with real pulp for a refreshing burst.",
    image: orange,
    accent: "from-orange-fruit/30 to-mango/25",
    cta: "Explore Flavour",
  },
];

const winter: Flavour[] = [
  {
    name: "Apple",
    description: "Crisp orchard apple with a warm, spiced sweetness.",
    image: apple,
    accent: "from-melon/25 to-orange-fruit/20",
    cta: "Explore Flavour",
  },
  {
    name: "Pomegranate",
    description: "Deep ruby richness, jewel-bright and full-bodied.",
    image: pomegranate,
    accent: "from-melon/30 to-mango/20",
    cta: "Try It",
  },
  {
    name: "Sweet Lime",
    description: "Gentle mosambi freshness — soft, smooth and easy sipping.",
    image: sweetlime,
    accent: "from-leaf/25 to-lemon/25",
    cta: "Explore Flavour",
  },
  {
    name: "Guava",
    description: "Creamy pink guava with a hint of chilli-salt warmth.",
    image: guava,
    accent: "from-melon/25 to-leaf/20",
    cta: "Try It",
  },
];

function FlavoursPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Summer Splash */}
      <section className="relative pt-28 pb-20 sm:pt-40">
        <div
          aria-hidden
          className="animate-splash pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-lemon/40 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-splash pointer-events-none absolute -right-20 top-52 h-96 w-96 rounded-full bg-melon/30 blur-3xl [animation-delay:2s]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="animate-rise max-w-2xl text-center sm:text-left">
            <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em]">
              ☀️ Summer Splash
            </span>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,11vw,4rem)] leading-[0.95]">
              <span className="text-juice">SUMMER</span>
              <br />
              SPLASH
            </h1>
            <p className="mt-4 text-lg font-extrabold">Fresh. Fruity. Refreshing.</p>
            <p className="mt-3 text-muted-foreground">
              Four ice-cold classics built for hot days, tall glasses and endless refills.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {summer.map((f) => (
              <FlavourCard key={f.name} flavour={f} />
            ))}
          </div>
        </div>
      </section>

      {/* Winter Flavours */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div
          aria-hidden
          className="bg-tropic pointer-events-none absolute inset-0 opacity-[0.12]"
        />
        <div
          aria-hidden
          className="animate-splash pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-mango/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl text-center sm:ml-auto sm:text-right">
            <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em]">
              ❄️ Winter Breeze
            </span>
            <h2 className="mt-5 font-display text-[clamp(2.5rem,11vw,4rem)] leading-[0.95]">
              WINTER
              <br />
              <span className="text-juice">BREEZE</span>
            </h2>
            <p className="mt-4 text-lg font-extrabold">Rich. Fruity. Full of flavour.</p>
            <p className="mt-3 text-muted-foreground">
              Deeper, warmer fruit blends for slow evenings and cosy get-togethers.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {winter.map((f) => (
              <FlavourCard key={f.name} flavour={f} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
