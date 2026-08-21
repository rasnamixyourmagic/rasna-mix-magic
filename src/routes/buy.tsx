import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, Store, Truck } from "lucide-react";
import mixlabBox from "@/assets/mixlab-box.jpg";

const title = "Buy Rasna — Packs, Bottles & Where to Find Us";
const description =
  "Grab Rasna packs online or in store: single bottles, family packs and the MixLab party kit with every fruit flavour.";

export const Route = createFileRoute("/buy")({
  component: BuyPage,
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

const packs = [
  {
    name: "MixLab Party Kit",
    price: "₹60",
    blurb: "Every flavour plus a mixing guide — built for making your own recipes.",
    image: mixlabBox,
    accent: "from-lemon/30 to-leaf/20",
  },
];

const channels = [
  { icon: Store, t: "In stores", d: "Available at leading supermarkets and neighbourhood shops." },
  { icon: Truck, t: "Home delivery", d: "Order on quick-commerce apps and get it chilled in minutes." },
  { icon: ShoppingBag, t: "Bulk & events", d: "Planning a party? Ask us about bulk MixLab kits." },
];

function BuyPage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-28 pb-16 sm:pt-40">
        <div
          aria-hidden
          className="animate-splash pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-lemon/35 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="animate-rise max-w-2xl text-center sm:text-left">
            <span className="glass-panel inline-flex rounded-full px-4 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em]">
              Buy Rasna
            </span>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,11vw,4rem)] leading-[0.95]">
              GRAB YOUR <span className="text-juice">MIX</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              Bottles, family packs and party kits — everything you need to start mixing.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packs.map((p) => (
              <article
                key={p.name}
                className="card-hover group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.accent} opacity-70 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative flex h-full flex-col">
                  <div className="overflow-hidden rounded-[1.5rem] bg-background/50 aspect-square">
                    <img
                      src={p.image}
                      alt={`Rasna ${p.name}`}
                      loading="lazy"
                      width={768}
                      height={768}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h2 className="mt-5 font-display text-2xl">{p.name}</h2>
                  <p className="text-juice font-display text-xl">{p.price}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
                  <div className="mt-auto pt-6">
                    <a
                      href="mailto:hello@rasnamixyourmagic.com?subject=Rasna%20order"
                      className="bg-sunrise inline-flex min-h-11 items-center rounded-2xl px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-primary-foreground transition-transform group-hover:scale-105"
                    >
                      Order Now
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {channels.map((c) => (
              <div key={c.t} className="glass-panel rounded-[2rem] p-6">
                <c.icon className="h-6 w-6 text-orange-fruit" />
                <h3 className="mt-3 font-display text-lg">{c.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/flavours"
              className="glass-panel inline-flex min-h-12 items-center rounded-2xl px-7 py-4 text-sm font-extrabold uppercase tracking-wide transition-transform hover:scale-105"
            >
              Explore Flavours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
