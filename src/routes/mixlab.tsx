import { createFileRoute, Link } from "@tanstack/react-router";
import { Flavours } from "@/components/site/Flavours";
import mixlab from "@/assets/mixlab.jpg";

const title = "MixLab — Create Your Own Rasna Drink";
const description =
  "Step into the Rasna MixLab: pick a base, layer your fruits, name your creation and share your signature drink with the community.";

export const Route = createFileRoute("/mixlab")({
  component: MixLabPage,
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

const steps = [
  { n: "01", t: "Pick your base", d: "Start with a Rasna flavour you love." },
  { n: "02", t: "Layer your fruits", d: "Add pulp, citrus, mint, spice — go wild." },
  { n: "03", t: "Shake & chill", d: "Ice it down, top it up, taste and tweak." },
  { n: "04", t: "Name your mix", d: "Give it a name and share it with the world." },
];

function MixLabPage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative pt-28 pb-16 sm:pt-40 sm:pb-20">
        <div
          aria-hidden
          className="animate-splash pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-melon/25 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="animate-rise text-center lg:text-left">
            <span className="glass-panel inline-flex rounded-full px-4 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em]">
              The MixLab
            </span>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,11vw,4rem)] leading-[0.95]">
              MIX YOUR <span className="text-juice">MAGIC</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              Flavours are where you discover Rasna. MixLab is where you make it yours — blend,
              film and submit your own signature recipe.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                to="/upload"
                className="bg-sunrise shadow-juice min-h-12 rounded-2xl px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-105"
              >
                Upload Your Recipe
              </Link>
              <Link
                to="/flavours"
                className="glass-panel min-h-12 rounded-2xl px-7 py-4 text-sm font-extrabold uppercase tracking-wide transition-transform hover:scale-105"
              >
                Browse Flavours
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-tropic absolute inset-6 rounded-[3rem] opacity-30 blur-2xl" />
            <div className="glass-panel shadow-lift relative overflow-hidden rounded-[2.5rem] p-4 sm:p-6">
              <img
                src={mixlab}
                alt="Rasna MixLab Original layered fruit drink"
                loading="lazy"
                width={1024}
                height={1024}
                className="animate-float-slow mx-auto w-full max-w-md rounded-[2rem] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card-hover rounded-[2rem] border border-border bg-card p-6">
              <span className="text-juice font-display text-3xl">{s.n}</span>
              <h3 className="mt-3 font-display text-xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <Flavours />
    </div>
  );
}
