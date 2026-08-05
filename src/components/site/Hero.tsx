import { Citrus, Sparkles } from "lucide-react";
import mixlab from "@/assets/mixlab.jpg";

const floaters = [
  { emoji: "🍊", className: "left-[6%] top-[22%]", delay: "0s" },
  { emoji: "🍋", className: "left-[16%] bottom-[16%]", delay: "1.2s" },
  { emoji: "🍉", className: "right-[8%] top-[18%]", delay: "0.6s" },
  { emoji: "🥭", className: "right-[14%] bottom-[20%]", delay: "1.8s" },
  { emoji: "🍃", className: "left-[45%] top-[8%]", delay: "2.4s" },
];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* juice splash blobs */}
      <div
        aria-hidden
        className="animate-splash pointer-events-none absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-melon/30 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-splash pointer-events-none absolute -right-24 top-40 h-[26rem] w-[26rem] rounded-full bg-lemon/40 blur-3xl [animation-delay:2s]"
      />
      <div
        aria-hidden
        className="animate-splash pointer-events-none absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-leaf/20 blur-3xl [animation-delay:4s]"
      />

      {floaters.map((f) => (
        <span
          key={f.emoji}
          aria-hidden
          style={{ animationDelay: f.delay }}
          className={`animate-float pointer-events-none absolute hidden text-4xl drop-shadow-lg sm:block lg:text-5xl ${f.className}`}
        >
          {f.emoji}
        </span>
      ))}

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-rise text-center lg:text-left">
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
            <Sparkles className="h-3.5 w-3.5 text-orange-fruit" />
            Create • Mix • Share
          </span>

          <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
            <span className="bg-sunrise shadow-juice grid h-14 w-14 shrink-0 place-items-center rounded-3xl text-primary-foreground">
              <Citrus className="h-7 w-7" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">Rasna</span>
          </div>

          <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            <span className="text-juice">RASNA:</span>
            <br />
            MIXYOURMAGIC
          </h1>

          <p className="mt-5 text-lg font-semibold text-muted-foreground sm:text-xl">
            Create • Mix • Share
          </p>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground lg:mx-0">
            Blend your own fruit magic, film it, and share it with a nation of mixers. The most
            loved recipes go straight to our community wall.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a
              href="#upload"
              className="bg-sunrise shadow-juice rounded-2xl px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-primary-foreground transition-transform hover:scale-105"
            >
              Upload Your Unique Recipe
            </a>
            <a
              href="#flavours"
              className="glass-panel rounded-2xl px-7 py-4 text-sm font-extrabold uppercase tracking-wide transition-transform hover:scale-105"
            >
              Explore Flavours
            </a>
          </div>
        </div>

        <div className="animate-rise relative [animation-delay:150ms]">
          <div className="bg-tropic absolute inset-6 rounded-[3rem] opacity-30 blur-2xl" />
          <div className="glass-panel shadow-lift relative overflow-hidden rounded-[3rem] p-6">
            <img
              src={mixlab}
              alt="Rasna MixLab Original layered fruit drink with ice"
              width={1024}
              height={1024}
              className="animate-float-slow mx-auto w-full max-w-md rounded-[2rem] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
